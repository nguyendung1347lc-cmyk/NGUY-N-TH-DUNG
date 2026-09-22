import React, { useState } from 'react';
import { 
  FolderDown, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Layers, 
  School,
  Database
} from 'lucide-react';
import { StudentSubmission, Task, Classroom } from '../types';

interface SubmissionRepositoryProps {
  submissions: StudentSubmission[];
  tasks: Task[];
  classes: Classroom[];
  onOpenReviewModal: (sub: StudentSubmission) => void;
}

export const SubmissionRepository: React.FC<SubmissionRepositoryProps> = ({
  submissions,
  tasks,
  classes,
  onOpenReviewModal
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'reviewed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewSub, setPreviewSub] = useState<StudentSubmission | null>(null);

  const filteredSubmissions = submissions.filter(sub => {
    const matchClass = selectedClass === 'all' || sub.classId === selectedClass;
    const matchTask = selectedTask === 'all' || sub.taskId === selectedTask;
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sub.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sub.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchTask && matchStatus && matchSearch;
  });

  const handleDownloadFile = (sub: StudentSubmission) => {
    if (sub.fileDataUrl) {
      const a = document.createElement('a');
      a.href = sub.fileDataUrl;
      a.download = sub.fileName;
      a.click();
    } else {
      const content = `KHO LƯU TRỮ BÀI NỘP - LỚP HỌC SỐ\nHọc sinh: ${sub.studentName}\nLớp: ${sub.classId}\nNhiệm vụ: ${sub.taskTitle}\nThời gian nộp: ${sub.submittedAt}\nFile: ${sub.fileName} (${sub.fileSize})`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = sub.fileName.endsWith('.txt') ? sub.fileName : `${sub.fileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportCSV = () => {
    const headers = 'STT,Họ và tên,Lớp,Nhiệm vụ,Tên file,Dung lượng,Thời gian nộp,Trạng thái,Điểm số,Nhận xét\n';
    const rows = filteredSubmissions.map((s, idx) => 
      `${idx + 1},"${s.studentName}","${s.classId}","${s.taskTitle.replace(/"/g, '""')}","${s.fileName}","${s.fileSize}","${s.submittedAt}","${s.status}","${s.score ?? ''}","${(s.teacherFeedback || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Bai_Nop_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Long-term storage guarantee */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderDown className="w-6 h-6 text-indigo-600" />
            <span>Kho Lưu Trữ Bài Nộp Học Sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cấu trúc khoa học: <strong>LỚP → BÀI HỌC / NHIỆM VỤ → HỌC SINH → BÀI NỘP</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Lưu trữ lâu dài • Không tự động xóa</span>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs"
            title="Xuất bảng điểm và danh sách ra file Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất báo cáo Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Multi-Filters and Search Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên học sinh, file..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Filter by Class */}
          <div>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-semibold text-slate-700"
            >
              <option value="all">Tất cả lớp (10A - 12B)</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>Lớp {c.name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Task */}
          <div>
            <select
              value={selectedTask}
              onChange={e => setSelectedTask(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-semibold text-slate-700 truncate"
            >
              <option value="all">Tất cả nhiệm vụ học tập</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Filter by Review Status */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-semibold text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="submitted">Chưa đánh giá</option>
              <option value="reviewed">Đã chấm điểm / nhận xét</option>
            </select>
          </div>
        </div>

        {/* Quick count chips */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Tìm thấy <strong>{filteredSubmissions.length}</strong> bài nộp trong kho lưu trữ
          </span>
          {(selectedClass !== 'all' || selectedTask !== 'all' || statusFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedTask('all');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4 w-12 text-center">STT</th>
                <th className="p-4">Học sinh</th>
                <th className="p-4">Lớp</th>
                <th className="p-4">Nhiệm vụ</th>
                <th className="p-4">File bài nộp</th>
                <th className="p-4">Thời gian nộp</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    Không tìm thấy bài nộp nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-4 font-extrabold text-slate-900">{sub.studentName}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                        {sub.classId}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="font-semibold text-slate-800 line-clamp-1">{sub.taskTitle}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <span className="font-mono text-indigo-600 font-medium block truncate max-w-xs">{sub.fileName}</span>
                          <span className="text-[10px] text-slate-400">{sub.fileSize}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      {sub.status === 'reviewed' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sub.score !== undefined ? `${sub.score}/10` : 'Đã xem'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Chưa chấm
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPreviewSub(sub)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Xem bài"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadFile(sub)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Tải về máy tính"
                        >
                          <Download className="w-3.5 h-3.5" />
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

      {/* File Preview Modal */}
      {previewSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{previewSub.fileName}</h4>
                <p className="text-xs text-slate-500">
                  {previewSub.studentName} • Lớp {previewSub.classId} • {previewSub.fileSize}
                </p>
              </div>
              <button
                onClick={() => setPreviewSub(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-slate-50/50 space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <p><strong>Nhiệm vụ:</strong> {previewSub.taskTitle}</p>
                <p><strong>Thời gian nộp:</strong> {new Date(previewSub.submittedAt).toLocaleString('vi-VN')}</p>
                {previewSub.score !== undefined && (
                  <p><strong>Điểm số:</strong> <span className="font-bold text-emerald-600">{previewSub.score}/10</span></p>
                )}
                {previewSub.teacherFeedback && (
                  <p><strong>Nhận xét của cô Dung:</strong> <em>"{previewSub.teacherFeedback}"</em></p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2">
              <button
                onClick={() => handleDownloadFile(previewSub)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Tải file về máy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
