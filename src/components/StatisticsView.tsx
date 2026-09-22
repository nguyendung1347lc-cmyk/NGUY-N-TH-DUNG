import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderDown, 
  Gamepad2, 
  Award, 
  CheckCircle2, 
  School,
  Clock
} from 'lucide-react';
import { Classroom, Task, StudentSubmission, QuizGame, GameResult } from '../types';

interface StatisticsViewProps {
  classes: Classroom[];
  tasks: Task[];
  submissions: StudentSubmission[];
  games: QuizGame[];
  results: GameResult[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  classes,
  tasks,
  submissions,
  games,
  results
}) => {
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const totalSubmissions = submissions.length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
  
  // Average game score calculation
  const averageGameScore = results.length > 0
    ? Math.round((results.reduce((sum, r) => sum + r.score, 0) / results.length) * 10) / 10
    : 0;

  // Class statistics breakdown
  const classStats = classes.map(cls => {
    const classTasks = tasks.filter(t => t.targetClasses.includes(cls.id));
    const classSubs = submissions.filter(s => s.classId === cls.id);
    const classResults = results.filter(r => r.classId === cls.id);
    const avgScore = classResults.length > 0
      ? Math.round((classResults.reduce((s, r) => s + r.score, 0) / classResults.length) * 10) / 10
      : 0;

    // Approximate participation rate
    const participationRate = Math.min(100, Math.round((classSubs.length / Math.max(1, cls.studentCount)) * 100));

    return {
      class: cls,
      taskCount: classTasks.length,
      submissionCount: classSubs.length,
      playCount: classResults.length,
      avgScore,
      participationRate
    };
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Báo Cáo Thống Kê Hoạt Động Học Tập THPT</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Tổng hợp dữ liệu bài nộp, mức độ tích cực và kết quả trò chơi củng cố của 6 lớp
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Nhiệm vụ đã giao</span>
            <FolderDown className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{tasks.length}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {totalSubmissions} bài nộp đã ghi nhận
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Tiến độ chấm bài</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {totalSubmissions > 0 ? Math.round((reviewedCount / totalSubmissions) * 100) : 0}%
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Đã đánh giá {reviewedCount}/{totalSubmissions} bài
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Trò chơi củng cố</span>
            <Gamepad2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">{games.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {results.length} lượt học sinh tham gia
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Điểm TB trò chơi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {averageGameScore} <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Đánh giá mức hiểu bài nhanh
          </div>
        </div>
      </div>

      {/* Visual Comparison: Submissions across 6 classes */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Biểu Đồ So Sánh Số Bài Nộp Giữa Các Lớp
          </h3>
          <p className="text-xs text-slate-500">
            Thống kê trực quan số lượng bài học sinh đã nộp theo từng lớp 10A, 10B, 11A, 11B, 12A, 12B
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {classStats.map(stat => {
            const maxSubs = Math.max(...classStats.map(s => s.submissionCount), 1);
            const percentage = Math.round((stat.submissionCount / maxSubs) * 100);

            return (
              <div key={stat.class.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${stat.class.bgLight} ${stat.class.color}`}>
                      {stat.class.id}
                    </span>
                    <span className="text-slate-800">{stat.class.name}</span>
                    <span className="text-slate-400 font-normal">({stat.class.studentCount} HS)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-extrabold">{stat.submissionCount} bài nộp</span>
                    <span className="text-slate-400 font-normal text-[11px]">{stat.playCount} lượt chơi</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Activity Detailed Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h4 className="font-bold text-slate-900 text-base">Tổng Hợp Hoạt Động Chi Tiết 6 Lớp</h4>
          <p className="text-xs text-slate-500">Đối chiếu tiến độ học tập và kết quả theo từng lớp</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Lớp</th>
                <th className="p-4">Khối</th>
                <th className="p-4">Sĩ số</th>
                <th className="p-4">Nhiệm vụ</th>
                <th className="p-4">Bài đã nộp</th>
                <th className="p-4">Lượt chơi game</th>
                <th className="p-4">Điểm TB Game</th>
                <th className="p-4">Đánh giá chung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStats.map(stat => (
                <tr key={stat.class.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-black text-slate-900 text-sm">
                    Lớp {stat.class.id}
                  </td>
                  <td className="p-4 font-medium text-slate-600">
                    Khối {stat.class.grade}
                  </td>
                  <td className="p-4 text-slate-600 font-mono">
                    {stat.class.studentCount} HS
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    {stat.taskCount}
                  </td>
                  <td className="p-4 font-extrabold text-emerald-600">
                    {stat.submissionCount}
                  </td>
                  <td className="p-4 font-extrabold text-purple-600">
                    {stat.playCount}
                  </td>
                  <td className="p-4 font-black text-amber-600">
                    {stat.avgScore > 0 ? `${stat.avgScore}/100` : '—'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      Học tập tích cực
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
