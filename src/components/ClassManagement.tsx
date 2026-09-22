import React, { useState } from 'react';
import { 
  School, 
  Users, 
  FileEdit, 
  FolderDown, 
  Gamepad2, 
  ArrowLeft, 
  QrCode, 
  Search, 
  CheckCircle, 
  Clock, 
  Award,
  Plus
} from 'lucide-react';
import { Classroom, Task, StudentSubmission, QuizGame, GameResult } from '../types';

interface ClassManagementProps {
  classes: Classroom[];
  tasks: Task[];
  submissions: StudentSubmission[];
  games: QuizGame[];
  results: GameResult[];
  selectedClassId: string | null;
  onSelectClass: (id: string | null) => void;
  onShowQR: (type: 'task' | 'game', id: string, title: string, targetClasses: string[]) => void;
  onViewTaskSubmissions: (taskId: string) => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({
  classes,
  tasks,
  submissions,
  games,
  results,
  selectedClassId,
  onSelectClass,
  onShowQR,
  onViewTaskSubmissions
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'submissions' | 'games' | 'leaderboard'>('tasks');
  const [studentSearch, setStudentSearch] = useState('');

  const currentClass = classes.find(c => c.id === selectedClassId);

  if (currentClass) {
    const classTasks = tasks.filter(t => t.targetClasses.includes(currentClass.id));
    const classSubmissions = submissions.filter(s => s.classId === currentClass.id);
    const classGames = games.filter(g => g.targetClasses.includes(currentClass.id));
    const classResults = results.filter(r => r.classId === currentClass.id);

    const filteredSubmissions = classSubmissions.filter(s => 
      s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.taskTitle.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        {/* Top Back Nav & Class Header */}
        <div>
          <button
            onClick={() => onSelectClass(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách các lớp</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl ${currentClass.bgLight} ${currentClass.color} border-2 ${currentClass.borderColor}`}>
                {currentClass.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{currentClass.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    Khối {currentClass.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  GVCN: <strong>{currentClass.homeroomTeacher}</strong> • Sĩ số: <strong>{currentClass.studentCount} học sinh</strong>
                </p>
                <p className="text-xs text-slate-600 mt-0.5 italic">
                  {currentClass.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl">
                <div className="text-lg font-black text-slate-900">{classTasks.length}</div>
                <div className="text-[10px] text-slate-500 font-medium">Nhiệm vụ</div>
              </div>
              <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl">
                <div className="text-lg font-black text-emerald-600">{classSubmissions.length}</div>
                <div className="text-[10px] text-slate-500 font-medium">Bài nộp</div>
              </div>
              <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl">
                <div className="text-lg font-black text-purple-600">{classResults.length}</div>
                <div className="text-[10px] text-slate-500 font-medium">Lượt chơi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Nhiệm vụ của lớp ({classTasks.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'submissions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Bài học sinh đã nộp ({classSubmissions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('games')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'games'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Trò chơi củng cố ({classGames.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'leaderboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Vinh danh TOP ({classResults.length})</span>
          </button>
        </div>

        {/* Tab 1: Tasks */}
        {activeSubTab === 'tasks' && (
          <div className="space-y-4">
            {classTasks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 text-sm">Chưa có nhiệm vụ nào được giao riêng cho lớp này.</p>
              </div>
            ) : (
              classTasks.map(task => {
                const subs = submissions.filter(s => s.taskId === task.id && s.classId === currentClass.id);
                return (
                  <div key={task.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700">
                          {task.subject}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{task.topic}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{task.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-1">{task.objective}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-600">{subs.length} đã nộp</div>
                        <div className="text-[10px] text-slate-400">trên {currentClass.studentCount} HS</div>
                      </div>

                      <button
                        onClick={() => onShowQR('task', task.id, task.title, task.targetClasses)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
                        title="Hiển thị mã QR"
                      >
                        <QrCode className="w-4 h-4 text-indigo-600" />
                      </button>

                      <button
                        onClick={() => onViewTaskSubmissions(task.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        Xem bài nộp
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Submissions of this class */}
        {activeSubTab === 'submissions' && (
          <div className="space-y-4">
            <div className="max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Tìm theo tên học sinh lớp..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-bold">
                  <tr>
                    <th className="p-3">Học sinh</th>
                    <th className="p-3">Nhiệm vụ</th>
                    <th className="p-3">File nộp</th>
                    <th className="p-3">Thời gian</th>
                    <th className="p-3">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        Chưa có bài nộp nào cho lớp này.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="p-3 text-slate-700 max-w-xs truncate">{sub.taskTitle}</td>
                        <td className="p-3 font-mono text-[11px] text-indigo-600 font-medium">
                          {sub.fileName} ({sub.fileSize})
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(sub.submittedAt).toLocaleDateString('vi-VN')} {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3">
                          {sub.status === 'reviewed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Đã chấm: {sub.score !== undefined ? `${sub.score}/10` : 'Đã xem'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Chưa chấm
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Games */}
        {activeSubTab === 'games' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classGames.map(game => (
              <div key={game.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700">
                    {game.subject} • Khối {game.grade}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{game.questions.length} câu hỏi</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{game.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{game.description}</p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onShowQR('game', game.id, game.title, game.targetClasses)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-600" />
                    <span>Mã QR trò chơi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Leaderboard */}
        {activeSubTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Bảng Thành Tích Học Sinh Lớp {currentClass.id}</span>
            </h4>
            <div className="space-y-2">
              {classResults.slice(0, 10).map((res, idx) => (
                <div key={res.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{res.studentName}</span>
                      <span className="text-slate-400 text-[11px] block">{res.gameTitle}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 text-sm">{res.score} điểm</span>
                    <span className="text-slate-400 text-[10px] block">{res.durationSeconds}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // All 6 classes overview grid
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <School className="w-6 h-6 text-indigo-600" />
          <span>Quản Lý 6 Lớp Học THPT</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Các lớp đang giảng dạy: 10A, 10B, 11A, 11B, 12A, 12B của Cô giáo Nguyễn Thị Dung
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const classTasks = tasks.filter(t => t.targetClasses.includes(cls.id));
          const classSubs = submissions.filter(s => s.classId === cls.id);
          const classRes = results.filter(r => r.classId === cls.id);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${cls.bgLight} ${cls.color} border-2 ${cls.borderColor}`}>
                      {cls.id}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{cls.name}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        Khối {cls.grade} • {cls.studentCount} Học sinh
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                  {cls.description}
                </p>

                <div className="bg-slate-50 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center mb-5">
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">{classTasks.length}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Nhiệm vụ</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-emerald-600">{classSubs.length}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Bài nộp</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-purple-600">{classRes.length}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Lượt chơi</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectClass(cls.id)}
                className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Vào không gian Lớp {cls.id}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
