export const polaroidConfig = {
  coupleNames: 'Nisila ❤️ Yashmi',
  weddingDate: '20th August 2026',
  paperColor: '#F8F6F0',
  borderThickness: 48,
  bottomBorderExtra: 120,
  fontFamily: 'Playfair Display',
  nameFontSize: 36,
  dateFontSize: 24,
  shadowBlur: 24,
  shadowOffsetY: 12,
  cornerRadius: 12,
  outputWidth: 1200,
  outputHeight: 1500,
  textColor: '#3D3630',
} as const;

export type PolaroidConfig = {
  coupleNames: string;
  weddingDate: string;
  paperColor: string;
  borderThickness: number;
  bottomBorderExtra: number;
  fontFamily: string;
  nameFontSize: number;
  dateFontSize: number;
  shadowBlur: number;
  shadowOffsetY: number;
  cornerRadius: number;
  outputWidth: number;
  outputHeight: number;
  textColor: string;
};
