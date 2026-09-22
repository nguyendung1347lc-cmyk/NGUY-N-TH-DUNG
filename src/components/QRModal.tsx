import React, { useEffect, useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  ExternalLink,
  Presentation,
  Sparkles
} from 'lucide-react';
import { generateQRCodeDataUrl, downloadQRCode, getShareableUrl } from '../utils/qrHelper';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'task' | 'game' | 'class';
  itemId: string;
  targetClasses?: string[];
  onOpenStudentView?: (type: 'task' | 'game', id: string) => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  itemId,
  targetClasses = [],
  onOpenStudentView
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);

  const shareableUrl = getShareableUrl(type, itemId);

  useEffect(() => {
    if (isOpen) {
      generateQRCodeDataUrl(shareableUrl).then((url) => {
        setQrDataUrl(url);
      });
      setCopied(false);
    }
  }, [isOpen, shareableUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (qrDataUrl) {
      const fileName = `QR_${type === 'task' ? 'NhiemVu' : 'TroChoi'}_${itemId}.png`;
      downloadQRCode(qrDataUrl, fileName);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all ${
      isProjectorMode ? 'bg-slate-950 p-6' : ''
    }`}>
      <div 
        className={`bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all border border-slate-200 ${
          isProjectorMode 
            ? 'w-full max-w-4xl h-[92vh] justify-between p-8 text-center' 
            : 'w-full max-w-lg'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-indigo-700">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Presentation className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {type === 'task' ? 'Mã QR Giao Nhiệm Vụ' : 'Mã QR Trò Chơi Củng Cố'}
              </span>
              <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsProjectorMode(!isProjectorMode)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
              title={isProjectorMode ? 'Thu nhỏ' : 'Chế độ Chiếu lên bảng (Projector Mode)'}
            >
              {isProjectorMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className={`p-6 flex flex-col items-center justify-center ${isProjectorMode ? 'flex-1' : ''}`}>
          {targetClasses.length > 0 && (
            <div className="mb-3 flex items-center gap-1.5 flex-wrap justify-center">
              <span className="text-xs text-slate-500 font-medium">Áp dụng cho:</span>
              {targetClasses.map((c) => (
                <span key={c} className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Lớp {c}
                </span>
              ))}
            </div>
          )}

          {/* QR Code Container */}
          <div className={`relative p-4 bg-white rounded-3xl shadow-md border-2 border-slate-200 transition-all ${
            isProjectorMode ? 'p-6 shadow-xl border-indigo-400' : ''
          }`}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className={`transition-all rounded-xl ${
                  isProjectorMode ? 'w-80 h-80 md:w-96 md:h-96' : 'w-56 h-56'
                }`}
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-xl animate-pulse text-slate-400 text-xs">
                Đang tạo mã QR...
              </div>
            )}
          </div>

          {/* Student Guidance Prompt */}
          <div className="mt-4 text-center max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Học sinh KHÔNG cần tài khoản • Không cần đăng nhập</span>
            </div>
            <p className={`text-slate-600 ${isProjectorMode ? 'text-lg font-medium' : 'text-xs'}`}>
              Mở Camera điện thoại quét mã QR hoặc nhập Link → Nhập <strong>Họ tên + Lớp</strong> → Bắt đầu ngay!
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="w-full mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 truncate font-mono select-all pl-2">
              {shareableUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-indigo-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Tải ảnh QR (.PNG) để dán Slide</span>
          </button>

          {onOpenStudentView && (
            <button
              onClick={() => {
                onClose();
                onOpenStudentView(type === 'task' ? 'task' : 'game', itemId);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Thử nghiệm giao diện Học sinh</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
