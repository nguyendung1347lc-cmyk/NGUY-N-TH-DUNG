import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Award, 
  Search, 
  Filter, 
  MessageSquare, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { Task, StudentSubmission } from '../types';

interface TaskDetailSubmissionsProps {
  task: Task;
  submissions: StudentSubmission[];
  onBack: () => void;
  onUpdateReview: (submissionId: string, score: number | undefined, feedback: string) => void;
  onShowQR: (type: 'task' | 'game', id: string, title: string, targetClasses: string[]) => void;
}

export const TaskDetailSubmissions: React.FC<TaskDetailSubmissionsProps> = ({
  task,
  submissions,
  onBack,
  onUpdateReview,
  onShowQR
}) => {
  const [classFilter, setClassFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  // Review modal state
  const [reviewingSub, setReviewingSub] = useState<StudentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [viewingFileSub, setViewingFileSub] = useState<StudentSubmission | null>(null);

  const taskSubmissions = submissions.filter(s => s.taskId === task.id);

  const filteredSubs = taskSubmissions.filter(s => {
    const matchClass = classFilter === 'all' || s.classId === classFilter;
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        s.fileName.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  const handleOpenReview = (sub: StudentSubmission) => {
    setReviewingSub(sub);
    setScoreInput(sub.score !== undefined ? sub.score.toString() : '');
    setFeedbackInput(sub.teacherFeedback || '');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSub) return;
    const numScore = scoreInput.trim() !== '' ? parseFloat(scoreInput) : undefined;
    onUpdateReview(reviewingSub.id, numScore, feedbackInput);
    setReviewingSub(null);
  };

  const handleDownloadFile = (sub: StudentSubmission) => {
    // If it has dataUrl, download it; otherwise create a realistic text blob representation
    if (sub.fileDataUrl) {
      const a = document.createElement('a');
      a.href = sub.fileDataUrl;
      a.download = sub.fileName;
      a.click();
    } else {
      const content = `BÀI LÀM HỌC SINH - TRƯỜNG THPT\nHọc sinh: ${sub.studentName}\nLớp: ${sub.classId}\nNhiệm vụ: ${sub.taskTitle}\nThời gian nộp: ${sub.submittedAt}\n\n[Nội dung file đính kèm: ${sub.fileName} (${sub.fileSize})]`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = sub.fileName.endsWith('.txt') ? sub.fileName : `${sub.fileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Back Nav & Task Summary Card */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách nhiệm vụ</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                {task.subject} • Khối {task.grade}
              </span>
              <span className="text-xs text-slate-500 font-medium">{task.topic}</span>
              <div className="flex items-center gap-1">
                {task.targetClasses.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                    Lớp {c}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {task.title}
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Mục tiêu:</strong> {task.objective}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onShowQR('task', task.id, task.title, task.targetClasses)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-2 transition"
            >
              <QrCode className="w-4 h-4" />
              <span>Mã QR của nhiệm vụ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Stats & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>DANH SÁCH BÀI HỌC SINH ĐÃ NỘP</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {taskSubmissions.length} bài nộp
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Bài nộp liên kết chặt chẽ: Lớp → Nhiệm vụ → Học sinh → File bài làm
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Class filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setClassFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                classFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tất cả
            </button>
            {task.targetClasses.map(c => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  classFilter === c ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm tên học sinh, file..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Submissions Table (Section 12 of prompt) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4 w-12 text-center">STT</th>
                <th className="p-4">Học sinh</th>
                <th className="p-4">Lớp</th>
                <th className="p-4">Bài nộp</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Trạng thái & Điểm</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    Chưa có học sinh nào nộp bài cho điều kiện lọc này.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 block text-sm">
                        {sub.studentName}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                        {sub.classId}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono font-medium text-slate-800 block truncate max-w-xs">
                            {sub.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {sub.fileSize} • {sub.fileType.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      <div>
                        {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>

                    <td className="p-4">
                      {sub.status === 'reviewed' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" />
                            <span>Đã chấm: {sub.score !== undefined ? `${sub.score}/10` : 'Đã xem'}</span>
                          </span>
                          {sub.teacherFeedback && (
                            <p className="text-[11px] text-slate-500 italic truncate max-w-xs">
                              "{sub.teacherFeedback}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          <span>Đã nộp (Chưa xem)</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingFileSub(sub)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                          title="Xem bài nộp"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem</span>
                        </button>

                        <button
                          onClick={() => handleDownloadFile(sub)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                          title="Tải bài về máy tính"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải</span>
                        </button>

                        <button
                          onClick={() => handleOpenReview(sub)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                          title="Chấm điểm và nhận xét"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Chấm</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CHẤM ĐIỂM & NHẬN XÉT CỦA CÔ GIÁO */}
      {reviewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Đánh Giá Bài Làm Học Sinh</h3>
                <p className="text-xs text-slate-500">
                  {reviewingSub.studentName} • Lớp {reviewingSub.classId}
                </p>
              </div>
              <button
                onClick={() => setReviewingSub(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Điểm số (Thang điểm 10)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="10"
                  value={scoreInput}
                  onChange={e => setScoreInput(e.target.value)}
                  placeholder="Ví dụ: 9.5"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lời nhận xét của Cô giáo Nguyễn Thị Dung
                </label>
                <textarea
                  rows={4}
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  placeholder="Nhận xét ưu điểm, điểm cần khắc phục và động viên học sinh..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingSub(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Lưu Đánh Giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM BÀI NỘP TRỰC TIẾP */}
      {viewingFileSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{viewingFileSub.fileName}</h4>
                  <p className="text-xs text-slate-500">
                    Học sinh: <strong>{viewingFileSub.studentName}</strong> (Lớp {viewingFileSub.classId}) • Nộp lúc: {new Date(viewingFileSub.submittedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingFileSub(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
              >
                ✕
              </button>
            </div>

            {/* File Preview Display Area */}
            <div className="p-6 flex-1 overflow-y-auto bg-slate-100/60 flex items-center justify-center min-h-[280px]">
              {viewingFileSub.fileDataUrl && viewingFileSub.fileType.includes('image') ? (
                <img
                  src={viewingFileSub.fileDataUrl}
                  alt={viewingFileSub.fileName}
                  className="max-h-96 rounded-xl shadow-md object-contain"
                />
              ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center space-y-3">
                  <FileText className="w-12 h-12 text-indigo-600 mx-auto" />
                  <h5 className="font-bold text-slate-800 text-sm">{viewingFileSub.fileName}</h5>
                  <p className="text-xs text-slate-500">
                    Định dạng: {viewingFileSub.fileType.toUpperCase()} • Dung lượng: {viewingFileSub.fileSize}
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 font-mono">
                    <p className="font-bold text-slate-800 mb-1">Tài liệu học sinh đã nộp:</p>
                    <p>• Họ tên: {viewingFileSub.studentName}</p>
                    <p>• Lớp: {viewingFileSub.classId}</p>
                    <p>• Nhiệm vụ: {viewingFileSub.taskTitle}</p>
                    <p className="mt-2 text-slate-500 italic">File lưu trữ an toàn trong kho bài nộp của lớp, sẵn sàng để cô giáo tải về và lưu hồ sơ dạy học.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                onClick={() => handleDownloadFile(viewingFileSub)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Tải file về máy tính</span>
              </button>

              <button
                onClick={() => {
                  const sub = viewingFileSub;
                  setViewingFileSub(null);
                  handleOpenReview(sub);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                Chấm điểm & Viết nhận xét
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
