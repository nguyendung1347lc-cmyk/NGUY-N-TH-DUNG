import React, { useState } from 'react';
import { 
  FileEdit, 
  PlusCircle, 
  Search, 
  QrCode, 
  Copy, 
  Check, 
  FolderDown, 
  Calendar, 
  Clock, 
  Filter, 
  Trash2, 
  ExternalLink,
  Sparkles,
  FileText,
  FileCheck
} from 'lucide-react';
import { Task, ClassId, FileTypeAllowed, StudentSubmission } from '../types';
import { getShareableUrl } from '../utils/qrHelper';

interface TaskManagementProps {
  tasks: Task[];
  submissions: StudentSubmission[];
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
  onShowQR: (type: 'task' | 'game', id: string, title: string, targetClasses: string[]) => void;
  onViewTaskSubmissions: (taskId: string) => void;
  onOpenStudentView: (type: 'task' | 'game', id: string) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  submissions,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
  onCreateTask,
  onDeleteTask,
  onShowQR,
  onViewTaskSubmissions,
  onOpenStudentView
}) => {
  const [classFilter, setClassFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  // New task form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Sinh học');
  const [grade, setGrade] = useState<'10' | '11' | '12'>('10');
  const [selectedClasses, setSelectedClasses] = useState<ClassId[]>(['10A', '10B']);
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [instructions, setInstructions] = useState('');
  const [deadline, setDeadline] = useState('2026-10-05T23:59');
  const [allowedTypes, setAllowedTypes] = useState<FileTypeAllowed[]>(['word', 'pdf', 'powerpoint', 'image']);
  const [studentNotes, setStudentNotes] = useState('Học sinh ghi rõ Họ tên và Lớp ở góc trên trang bài làm.');

  const handleCopyLink = (taskId: string) => {
    const url = getShareableUrl('task', taskId);
    navigator.clipboard.writeText(url);
    setCopiedTaskId(taskId);
    setTimeout(() => setCopiedTaskId(null), 2500);
  };

  const handleToggleClass = (cls: ClassId) => {
    if (selectedClasses.includes(cls)) {
      if (selectedClasses.length > 1) {
        setSelectedClasses(selectedClasses.filter(c => c !== cls));
      }
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
  };

  const handleToggleFileType = (type: FileTypeAllowed) => {
    if (allowedTypes.includes(type)) {
      if (allowedTypes.length > 1) {
        setAllowedTypes(allowedTypes.filter(t => t !== type));
      }
    } else {
      setAllowedTypes([...allowedTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !objective.trim()) {
      alert('Vui lòng nhập tên nhiệm vụ và mục tiêu.');
      return;
    }

    onCreateTask({
      title,
      subject,
      grade,
      targetClasses: selectedClasses,
      topic: topic || 'Chuyên đề học tập',
      objective,
      instructions: instructions || 'Đọc kỹ yêu cầu và tải file bài làm lên hệ thống.',
      deadline,
      allowedFileTypes: allowedTypes,
      studentNotes,
      status: 'active'
    });

    onCloseCreateModal();
    // Reset fields
    setTitle('');
    setObjective('');
    setInstructions('');
  };

  const filteredTasks = tasks.filter(t => {
    const matchesClass = classFilter === 'all' || t.targetClasses.includes(classFilter);
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.topic.toLowerCase().includes(search.toLowerCase()) ||
                          t.subject.toLowerCase().includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-indigo-600" />
            <span>Quản Lý Bài Tập / Nhiệm Vụ Học Tập</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Giao nhiệm vụ, sinh mã QR / Link và theo dõi bài nộp từng lớp học
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm shadow-indigo-200 transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ TẠO NHIỆM VỤ MỚI</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên nhiệm vụ, chủ đề..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Lớp:</span>
          </span>
          {['all', '10A', '10B', '11A', '11B', '12A', '12B'].map(c => (
            <button
              key={c}
              onClick={() => setClassFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                classFilter === c
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'all' ? 'Tất cả' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Không tìm thấy nhiệm vụ nào phù hợp.</p>
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl"
            >
              + Tạo nhiệm vụ đầu tiên
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const taskSubs = submissions.filter(s => s.taskId === task.id);
            const isCopied = copiedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {task.subject} • Khối {task.grade}
                      </span>
                      <div className="flex items-center gap-1">
                        {task.targetClasses.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                            Lớp {c}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">| {task.topic}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Mục tiêu:</strong> {task.objective}
                    </p>
                  </div>

                  {/* Submission counter badge */}
                  <div className="flex items-center gap-3 shrink-0 self-start">
                    <div className="text-right px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <span className="text-base font-extrabold text-emerald-700 block">
                        {taskSubs.length}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">Bài đã nộp</span>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Xóa nhiệm vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instructions & Meta */}
                <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-600 space-y-2 border border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Hạn nộp: <strong>{new Date(task.deadline).toLocaleDateString('vi-VN')} {new Date(task.deadline).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Định dạng:</span>
                      {task.allowedFileTypes.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-white text-slate-700 font-mono text-[10px] border border-slate-200 uppercase font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {task.instructions && (
                    <p className="text-slate-600 border-t border-slate-200/60 pt-2 whitespace-pre-line leading-relaxed">
                      {task.instructions}
                    </p>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(task.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã chép Link!' : 'Sao chép Link'}</span>
                    </button>

                    <button
                      onClick={() => onShowQR('task', task.id, task.title, task.targetClasses)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Hiển thị mã QR</span>
                    </button>

                    <button
                      onClick={() => onOpenStudentView('task', task.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition hidden sm:flex"
                      title="Mở giao diện nộp bài của học sinh để thử nghiệm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Trang học sinh</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onViewTaskSubmissions(task.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs"
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>Xem danh sách bài nộp ({taskSubs.length})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5 text-indigo-700">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <PlusCircle className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Tạo Nhiệm Vụ Học Tập Mới</h3>
                  <p className="text-xs text-slate-500">Hệ thống sẽ tự động tạo Link riêng & Mã QR chiếu trên lớp</p>
                </div>
              </div>
              <button
                onClick={onCloseCreateModal}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Tên nhiệm vụ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên nhiệm vụ / Phiếu học tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Nhiệm vụ 01 – Khám phá cấu trúc tế bào nhân thực"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
                />
              </div>

              {/* Môn học, Khối */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Sinh học, Ngữ văn, Toán..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>
              </div>

              {/* Chọn các lớp áp dụng */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lớp được giao nhiệm vụ <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['10A', '10B', '11A', '11B', '12A', '12B'] as ClassId[]).map(cls => {
                    const isSelected = selectedClasses.includes(cls);
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => handleToggleClass(cls)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Lớp {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chủ đề bài học */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên bài học / Chủ đề
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Ví dụ: Bài 7 - Tế bào nhân thực (Chương 2)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Mục tiêu nhiệm vụ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mục tiêu nhiệm vụ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  placeholder="Nêu ngắn gọn mục tiêu kiến thức, năng lực học sinh cần đạt..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Hướng dẫn thực hiện */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung yêu cầu & Hướng dẫn thực hiện
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Các bước thực hiện chi tiết, tài liệu tham khảo..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-sans"
                />
              </div>

              {/* Hạn nộp & Loại file */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hạn nộp bài
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại file được phép nộp
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { id: 'word', label: 'Word' },
                      { id: 'pdf', label: 'PDF' },
                      { id: 'powerpoint', label: 'PowerPoint' },
                      { id: 'image', label: 'Hình ảnh' },
                      { id: 'all', label: 'Nhiều loại' }
                    ].map(type => (
                      <label key={type.id} className="flex items-center gap-1 text-[11px] font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowedTypes.includes(type.id as FileTypeAllowed)}
                          onChange={() => handleToggleFileType(type.id as FileTypeAllowed)}
                          className="rounded text-indigo-600 focus:ring-0"
                        />
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ghi chú cho học sinh */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú cho học sinh
                </label>
                <input
                  type="text"
                  value={studentNotes}
                  onChange={e => setStudentNotes(e.target.value)}
                  placeholder="Ví dụ: Ghi rõ Họ tên và Lớp ở trang đầu bài làm"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Modal footer buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  TẠO NHIỆM VỤ & TẠO MÃ QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
