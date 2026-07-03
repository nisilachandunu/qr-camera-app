import fs from 'fs/promises';
import { config } from '../config/index.js';
import type { PrintJob, PrintJobStatus } from '../types/print-job.js';

interface JobsData {
  jobs: PrintJob[];
  queue: string[];
}

export class PrintQueueService {
  private jobs: Map<string, PrintJob> = new Map();
  private queue: string[] = [];
  private activeJobId: string | null = null;
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;
    await fs.mkdir(config.dataDir, { recursive: true });
    try {
      const raw = await fs.readFile(config.jobsFile, 'utf-8');
      const data = JSON.parse(raw) as JobsData;
      this.jobs = new Map(data.jobs.map((j) => [j.id, j]));
      this.queue = data.queue;
      const active = [...this.jobs.values()].find(
        (j) => j.status === 'assigned' || j.status === 'printing',
      );
      this.activeJobId = active?.id ?? null;
    } catch {
      this.jobs = new Map();
      this.queue = [];
      this.activeJobId = null;
      await this.persist();
    }
    this.loaded = true;
  }

  private async persist(): Promise<void> {
    await fs.mkdir(config.dataDir, { recursive: true });
    const data: JobsData = {
      jobs: [...this.jobs.values()],
      queue: this.queue,
    };
    await fs.writeFile(config.jobsFile, JSON.stringify(data, null, 2));
  }

  async createJob(imagePath: string, imageUrl: string): Promise<PrintJob> {
    await this.load();
    const job: PrintJob = {
      id: crypto.randomUUID(),
      imagePath,
      imageUrl,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    this.jobs.set(job.id, job);
    this.queue.push(job.id);
    await this.persist();
    return job;
  }

  getJob(jobId: string): PrintJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): PrintJob[] {
    return [...this.jobs.values()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  getQueuedJobs(): PrintJob[] {
    return this.queue
      .map((id) => this.jobs.get(id))
      .filter((j): j is PrintJob => j !== undefined && j.status === 'queued');
  }

  getQueueLength(): number {
    return this.queue.filter((id) => {
      const job = this.jobs.get(id);
      return job && (job.status === 'queued' || job.status === 'assigned' || job.status === 'printing');
    }).length;
  }

  getCurrentJob(): PrintJob | null {
    if (!this.activeJobId) return null;
    return this.jobs.get(this.activeJobId) ?? null;
  }

  hasActiveJob(): boolean {
    return this.activeJobId !== null;
  }

  async peekNextJob(): Promise<PrintJob | null> {
    await this.load();
    if (this.activeJobId) return null;
    for (const id of this.queue) {
      const job = this.jobs.get(id);
      if (job && job.status === 'queued') {
        return job;
      }
    }
    return null;
  }

  async assignJob(jobId: string, printerId: string): Promise<PrintJob | null> {
    await this.load();
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'queued' || this.activeJobId) return null;
    job.status = 'assigned';
    job.printerId = printerId;
    this.activeJobId = jobId;
    await this.persist();
    return job;
  }

  async updateStatus(jobId: string, status: PrintJobStatus, error?: string): Promise<PrintJob | null> {
    await this.load();
    const job = this.jobs.get(jobId);
    if (!job) return null;
    job.status = status;
    if (error) job.error = error;
    if (status === 'completed' || status === 'failed') {
      job.completedAt = new Date().toISOString();
      if (this.activeJobId === jobId) {
        this.activeJobId = null;
      }
    }
    await this.persist();
    return job;
  }

  async revertActiveToQueued(): Promise<void> {
    await this.load();
    if (!this.activeJobId) return;
    const job = this.jobs.get(this.activeJobId);
    if (job && (job.status === 'assigned' || job.status === 'printing')) {
      job.status = 'queued';
      job.printerId = undefined;
      this.activeJobId = null;
      await this.persist();
    }
  }

  async completeJob(jobId: string): Promise<PrintJob | null> {
    return this.updateStatus(jobId, 'completed');
  }

  async failJob(jobId: string, error: string): Promise<PrintJob | null> {
    return this.updateStatus(jobId, 'failed', error);
  }

  async startPrinting(jobId: string): Promise<PrintJob | null> {
    return this.updateStatus(jobId, 'printing');
  }
}

export const printQueueService = new PrintQueueService();
