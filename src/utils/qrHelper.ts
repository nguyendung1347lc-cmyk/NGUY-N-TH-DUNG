import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e293b', // slate-800
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

export function downloadQRCode(dataUrl: string, fileName: string = 'ma-qr-lop-hoc-so.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getShareableUrl(type: 'task' | 'game' | 'class', id: string): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?view=student&${type}=${id}`;
}

export function parseUrlParams(): { view: string | null; type: 'task' | 'game' | null; id: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const task = params.get('task');
    const game = params.get('game');
    const typeParam = params.get('type');
    
    const type: 'task' | 'game' | null = task 
      ? 'task' 
      : game 
      ? 'game' 
      : (typeParam === 'task' || typeParam === 'game') 
      ? typeParam 
      : null;
    
    const id = task || game || params.get('id') || '';
    return { view, type, id };
  } catch {
    return { view: null, type: null, id: '' };
  }
}

