import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { config } from './config.js';

const execFileAsync = promisify(execFile);

const PRINT_TIMEOUT_MS = 120_000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

export async function printImage(imagePath: string): Promise<void> {
  const absolutePath = path.resolve(imagePath);
  await fs.access(absolutePath);

  if (process.platform === 'win32') {
    await withTimeout(printWindows(absolutePath), PRINT_TIMEOUT_MS, 'Print timed out');
    return;
  }

  if (process.platform === 'darwin') {
    await execFileAsync('lp', config.printerName ? ['-d', config.printerName, absolutePath] : [absolutePath]);
    return;
  }

  await execFileAsync('lp', config.printerName ? ['-d', config.printerName, absolutePath] : [absolutePath]);
}

async function printWindows(absolutePath: string): Promise<void> {
  const escapedPath = absolutePath.replace(/\\/g, '\\\\').replace(/'/g, "''");
  const printerName = config.printerName.replace(/'/g, "''");

  const script = `
    Add-Type -AssemblyName System.Drawing
    Add-Type -AssemblyName System.Drawing.Printing
    $img = [System.Drawing.Image]::FromFile('${escapedPath}')
    $pd = New-Object System.Drawing.Printing.PrintDocument
    $pd.DocumentName = 'Polaroid Guestbook'
    if ('${printerName}' -ne '') {
      $pd.PrinterSettings.PrinterName = '${printerName}'
    }
    $printed = $false
    $pd.add_PrintPage({
      param($sender, $e)
      $ratio = [Math]::Min($e.MarginBounds.Width / $img.Width, $e.MarginBounds.Height / $img.Height)
      $w = [int]($img.Width * $ratio)
      $h = [int]($img.Height * $ratio)
      $x = $e.MarginBounds.X + ($e.MarginBounds.Width - $w) / 2
      $y = $e.MarginBounds.Y + ($e.MarginBounds.Height - $h) / 2
      $e.Graphics.DrawImage($img, $x, $y, $w, $h)
      $script:printed = $true
    })
    $pd.Print()
    $img.Dispose()
    if (-not $printed) { throw 'Print page was not rendered' }
  `;

  await execFileAsync('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    script,
  ]);
}

export async function listPrinters(): Promise<string[]> {
  if (process.platform !== 'win32') {
    return [];
  }
  const { stdout } = await execFileAsync('powershell.exe', [
    '-NoProfile',
    '-Command',
    'Get-Printer | Select-Object -ExpandProperty Name',
  ]);
  return stdout
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}
