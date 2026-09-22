import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  User, 
  School,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, ClassId, StudentSubmission } from '../types';

interface StudentTaskPortalProps {
  task: Task;
  defaultClassId?: ClassId;
  onSubmit: (submission: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  onBackToOverview?: () => void;
}

export const StudentTaskPortal: React.FC<StudentTaskPortalProps> = ({
  task,
  defaultClassId,
  onSubmit,
  onBackToOverview
}) => {
  // Student identification state - NO GOOGLE LOGIN REQUIRED
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('lop_hoc_so_last_student_name') || '';
  });
  const [selectedClass, setSelectedClass] = useState<ClassId>(
    (defaultClassId && task.targetClasses.includes(defaultClassId)) 
      ? defaultClassId 
      : (task.targetClasses[0] || '10A')
  );

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    studentName: string;
    classId: string;
    fileName: string;
    time: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);

    // Read small/medium files as Base64 for instant preview & persistence
    if (selectedFile.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileBase64(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFileBase64(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Vui lòng nhập Họ và tên của em để cô giáo biết bài làm của ai nhé!');
      return;
    }
    if (!file) {
      alert('Vui lòng chọn hoặc tải file bài làm lên trước khi bấm nộp.');
      return;
    }

    setIsSubmitting(true);

    // Save name for convenience next time
    localStorage.setItem('lop_hoc_so_last_student_name', studentName.trim());

    setTimeout(() => {
      const sub = {
        taskId: task.id,
        taskTitle: task.title,
        studentName: studentName.trim(),
        classId: selectedClass,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.type || file.name.split('.').pop() || 'file',
        fileDataUrl: fileBase64 || undefined
      };

      onSubmit(sub);

      setSubmittedData({
        studentName: studentName.trim(),
        classId: selectedClass,
        fileName: file.name,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN')
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // Celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 400);
  };

  const handleResetForAnother = () => {
    setIsSuccess(false);
    setFile(null);
    setFileBase64(null);
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-4 sm:px-6">
      {/* Back button if available */}
      {onBackToOverview && (
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>
      )}

      {/* SUCCESS SCREEN (Section 11 of Prompt) */}
      {isSuccess && submittedData ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              NỘP BÀI THÀNH CÔNG!
            </h2>
            <p className="text-sm text-slate-600">
              Bài làm của em đã được gửi an toàn đến <strong>Cô giáo Nguyễn Thị Dung</strong>.
            </p>
          </div>

          {/* Submission Receipt */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Học sinh:</span>
              <span className="font-extrabold text-slate-900">{submittedData.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Lớp:</span>
              <span className="font-bold text-indigo-700">{submittedData.classId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Nhiệm vụ:</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-xs">{task.title}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">File đã nộp:</span>
              <span className="font-mono text-emerald-700 font-bold truncate max-w-xs">{submittedData.fileName}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-500">Thời gian nộp:</span>
              <span className="font-medium text-slate-600">{submittedData.time}</span>
            </div>
          </div>

          {/* Motivational note */}
          <div className="p-3.5 bg-indigo-50/80 rounded-2xl text-xs text-indigo-900 leading-relaxed font-medium">
            ✨ Em đã hoàn thành xuất sắc nhiệm vụ này! Hãy tự tin và tiếp tục phát huy trong các tiết học tiếp theo nhé.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nộp lại / Nộp bổ sung</span>
            </button>
          </div>
        </div>
      ) : (
        /* MAIN SUBMISSION FORM (3 SECONDS TO UNDERSTAND - 3 CLICKS TO SUBMIT) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white">
                {task.subject} • Khối {task.grade}
              </span>
              <span className="text-xs text-indigo-200 font-medium">Cô giáo Nguyễn Thị Dung</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black leading-tight text-white">
              {task.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-indigo-200 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Hạn nộp: <strong className="text-amber-200">{new Date(task.deadline).toLocaleDateString('vi-VN')} {new Date(task.deadline).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</strong>
              </span>
            </div>
          </div>

          {/* Task Objective & Guidelines */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/60 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mục Tiêu Bài Học:
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {task.objective}
              </p>
            </div>

            {task.instructions && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Yêu Cầu & Hướng Dẫn:
                </h4>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {task.instructions}
                </p>
              </div>
            )}

            {task.studentNotes && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Lưu ý:</strong> {task.studentNotes}</span>
              </div>
            )}
          </div>

          {/* Student Form (No login required) */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Step 1: Student info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Bước 1: Nhập Họ và Tên của em <span className="text-rose-500">*</span></span>
                </label>
                <span className="text-[11px] text-emerald-600 font-bold">Không cần đăng nhập</span>
              </div>

              <input
                type="text"
                required
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold text-slate-900"
              />
            </div>

            {/* Step 2: Choose Class */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <School className="w-4 h-4 text-indigo-600" />
                <span>Bước 2: Chọn lớp của em <span className="text-rose-500">*</span></span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {task.targetClasses.map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`py-2.5 rounded-xl font-black text-xs transition border ${
                      selectedClass === cls
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Lớp {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: File Upload Area */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Bước 3: Chọn hoặc chụp ảnh file bài làm <span className="text-rose-500">*</span></span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {task.allowedFileTypes.join(', ').toUpperCase()}
                </span>
              </label>

              <div
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : file
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                />

                {file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-xs mx-auto">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        {formatFileSize(file.size)} • Bấm vào để đổi file khác
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Chạm vào đây để chọn file hoặc chụp ảnh bài làm
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Kéo thả file Word, PDF, PowerPoint hoặc ảnh bài chụp
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || !file}
                className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || !file
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 cursor-pointer active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <span>Đang tải bài nộp lên...</span>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>NỘP BÀI LÀM CHO CÔ DUNG</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Hệ thống tự động lưu vào kho bài nộp của lớp {selectedClass}
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
