import React from 'react';
import { 
  FileEdit, 
  FolderDown, 
  Gamepad2, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  QrCode, 
  Sparkles,
  School,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { Classroom, Task, StudentSubmission, QuizGame, GameResult, ActivityNotification, ActiveTab } from '../types';

interface TeacherDashboardProps {
  classes: Classroom[];
  tasks: Task[];
  submissions: StudentSubmission[];
  games: QuizGame[];
  results: GameResult[];
  notifications: ActivityNotification[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectClass: (classId: string) => void;
  onOpenCreateTask: () => void;
  onOpenCreateGame: () => void;
  onShowQR: (type: 'task' | 'game', id: string, title: string, targetClasses: string[]) => void;
  onViewTaskSubmissions: (taskId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  classes,
  tasks,
  submissions,
  games,
  results,
  notifications,
  onNavigateTab,
  onSelectClass,
  onOpenCreateTask,
  onOpenCreateGame,
  onShowQR,
  onViewTaskSubmissions
}) => {
  const unreviewedCount = submissions.filter(s => s.status === 'submitted').length;
  const activeTasksCount = tasks.filter(t => t.status === 'active').length;
  const totalSubmissions = submissions.length;
  const totalParticipants = results.length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Greeting */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Nền tảng Giáo dục THPT Thông minh • Không cần đăng nhập</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Xin chào Cô giáo Nguyễn Thị Dung! 👋
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Hôm nay cô muốn giao nhiệm vụ mới, kiểm tra bài nộp của học sinh hay tổ chức trò chơi củng cố kiến thức cho các lớp?
          </p>
        </div>

        {/* 2. Four Primary Action Buttons */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenCreateTask}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white text-indigo-900 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 mb-1.5 group-hover:bg-indigo-600 group-hover:text-white transition">
              <FileEdit className="w-5 h-5" />
            </div>
            <span>📝 TẠO NHIỆM VỤ</span>
          </button>

          <button
            onClick={() => onNavigateTab('submissions')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mb-1.5 group-hover:bg-emerald-600 group-hover:text-white transition">
              <FolderDown className="w-5 h-5" />
            </div>
            <span>📥 XEM BÀI NỘP</span>
          </button>

          <button
            onClick={onOpenCreateGame}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white text-purple-950 font-bold text-xs sm:text-sm shadow-md hover:bg-purple-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 mb-1.5 group-hover:bg-purple-600 group-hover:text-white transition">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span>🎮 TẠO TRÒ CHƠI</span>
          </button>

          <button
            onClick={() => onNavigateTab('results')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white text-amber-950 font-bold text-xs sm:text-sm shadow-md hover:bg-amber-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 mb-1.5 group-hover:bg-amber-600 group-hover:text-white transition">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span>📊 XEM KẾT QUẢ</span>
          </button>
        </div>
      </div>

      {/* 3. Metric Stat Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tổng số lớp</span>
            <School className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{classes.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Khối 10, 11, 12</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Nhiệm vụ mở</span>
            <FileEdit className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">{activeTasksCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Đang nhận bài</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Bài đã nộp</span>
            <FolderDown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{totalSubmissions}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Lưu trữ đầy đủ</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Chưa đánh giá</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{unreviewedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cần xem & nhận xét</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Trò chơi</span>
            <Gamepad2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600">{games.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Củng cố kiến thức</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Lượt chơi</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{totalParticipants}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tương tác sôi nổi</div>
        </div>
      </div>

      {/* 4. Display 6 Classes Cards (10A, 10B, 11A, 11B, 12A, 12B) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-600" />
              <span>Danh Sách 6 Lớp Đang Giảng Dạy</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quản lý nhiệm vụ, bài nộp và hoạt động riêng biệt theo từng lớp
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('classes')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Xem chi tiết tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const classTasks = tasks.filter(t => t.targetClasses.includes(cls.id));
            const classSubmissions = submissions.filter(s => s.classId === cls.id);
            const classResults = results.filter(r => r.classId === cls.id);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg ${cls.bgLight} ${cls.color} border ${cls.borderColor}`}>
                        {cls.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{cls.name}</h4>
                        <span className="text-xs text-slate-500 font-medium">
                          Khối {cls.grade} • {cls.studentCount} Học sinh
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 mb-4">
                    {cls.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-xl mb-4 text-center">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{classTasks.length}</div>
                      <div className="text-[10px] text-slate-500">Nhiệm vụ</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-600">{classSubmissions.length}</div>
                      <div className="text-[10px] text-slate-500">Bài đã nộp</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-purple-600">{classResults.length}</div>
                      <div className="text-[10px] text-slate-500">Lượt chơi</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectClass(cls.id)}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Xem lớp {cls.id}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Active Tasks & Quick QR */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-indigo-600" />
              <span>Nhiệm Vụ Học Tập Đang Mở</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chiếu mã QR trên bảng hoặc gửi Link cho học sinh quét bằng điện thoại
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Quản lý nhiệm vụ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.slice(0, 4).map((task) => {
            const taskSubs = submissions.filter(s => s.taskId === task.id);
            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {task.subject} • Khối {task.grade}
                    </span>
                    <div className="flex items-center gap-1">
                      {task.targetClasses.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {task.objective}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <strong>{taskSubs.length}</strong> học sinh đã nộp
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onShowQR('task', task.id, task.title, task.targetClasses)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                      title="Hiển thị QR cho học sinh quét"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Mã QR</span>
                    </button>

                    <button
                      onClick={() => onViewTaskSubmissions(task.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                    >
                      <span>Xem bài ({taskSubs.length})</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Recent Activity Feed */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Hoạt Động Mới Nhất Trong Lớp</span>
          </h3>
          <button
            onClick={() => onNavigateTab('notifications')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Xem tất cả
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.slice(0, 5).map((notif) => (
            <div key={notif.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-2 rounded-xl text-xs ${
                  notif.type === 'submission' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : notif.type === 'game_complete'
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {notif.type === 'submission' ? <FolderDown className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {new Date(notif.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
