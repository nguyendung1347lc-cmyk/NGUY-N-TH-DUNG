import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Star, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles,
  Layers,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { GameResult, QuizGame, Classroom } from '../types';

interface GameResultsLeaderboardProps {
  results: GameResult[];
  games: QuizGame[];
  classes: Classroom[];
  selectedGameId?: string;
}

export const GameResultsLeaderboard: React.FC<GameResultsLeaderboardProps> = ({
  results,
  games,
  classes,
  selectedGameId
}) => {
  const [activeGameId, setActiveGameId] = useState<string>(selectedGameId || (games[0]?.id || 'all'));
  const [classFilter, setClassFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const currentGame = games.find(g => g.id === activeGameId);

  // Filter and sort results
  const filteredResults = results
    .filter(r => {
      const matchGame = activeGameId === 'all' || r.gameId === activeGameId;
      const matchClass = classFilter === 'all' || r.classId === classFilter;
      const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase());
      return matchGame && matchClass && matchSearch;
    })
    .sort((a, b) => {
      // Primary: Highest score
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: Faster duration
      return a.durationSeconds - b.durationSeconds;
    });

  const top5 = filteredResults.slice(0, 5);

  const handleExportResultsCSV = () => {
    const headers = 'Hạng,Họ và tên,Lớp,Trò chơi,Điểm số,Tổng điểm,Số câu đúng,Tỷ lệ đúng (%),Thời gian (giây),Thời điểm hoàn thành\n';
    const rows = filteredResults.map((r, idx) => 
      `${idx + 1},"${r.studentName}","${r.classId}","${r.gameTitle.replace(/"/g, '""')}","${r.score}","${r.totalScore}","${r.correctAnswersCount}/${r.totalQuestionsCount}","${r.accuracyRate}%","${r.durationSeconds}s","${r.completedAt}"`
    ).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bang_Xep_Hang_Top5_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Bảng Vinh Danh TOP 5 & Kết Quả Trò Chơi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chấm điểm tự động • Xếp hạng khách quan theo Điểm cao nhất & Thời gian nhanh nhất
          </p>
        </div>

        <button
          onClick={handleExportResultsCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Bảng Xếp Hạng Excel</span>
        </button>
      </div>

      {/* Select Game & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Chọn trò chơi:</span>
          <select
            value={activeGameId}
            onChange={e => setActiveGameId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none"
          >
            <option value="all">Tất cả trò chơi</option>
            {games.map(g => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Class Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 font-semibold">Lớp:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="all">Tất cả lớp</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>Lớp {c.id}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm tên học sinh..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* PODIUM VINH DANH TOP 5 (Prompt Requirement 17) */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>KHÔNG GIAN VINH DANH HỌC TẬP TÍCH CỰC</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
            🏆 BẢNG VINH DANH TOP 5
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            Tuyên dương nỗ lực, phản xạ nhanh và sự am hiểu kiến thức của các em học sinh
          </p>
        </div>

        {top5.length === 0 ? (
          <div className="py-12 text-center text-indigo-300 text-xs">
            Chưa có học sinh tham gia trò chơi này. Chiếu mã QR để cả lớp tham gia!
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto items-end pt-4">
              {/* TOP 2 (Silver) */}
              {top5[1] && (
                <div className="order-2 sm:order-1 bg-white/10 backdrop-blur-md rounded-2xl border border-slate-300/30 p-5 text-center flex flex-col items-center justify-between min-h-[220px]">
                  <div className="w-12 h-12 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-black text-lg shadow-md mb-2">
                    🥈
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200/20 text-slate-200">
                      TOP 2
                    </span>
                    <h4 className="font-black text-base text-white mt-1 line-clamp-1">{top5[1].studentName}</h4>
                    <span className="text-xs text-indigo-200 font-semibold block">Lớp {top5[1].classId}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/10 w-full">
                    <span className="font-extrabold text-amber-300 text-lg">{top5[1].score} đ</span>
                    <span className="text-[11px] text-indigo-300 block">{top5[1].durationSeconds} giây</span>
                  </div>
                </div>
              )}

              {/* TOP 1 (Gold) */}
              {top5[0] && (
                <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-400/20 to-amber-500/10 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-6 text-center flex flex-col items-center justify-between min-h-[260px] shadow-lg shadow-amber-500/20 transform sm:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-2xl shadow-lg mb-2">
                    🥇
                  </div>
                  <div>
                    <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 shadow-sm">
                      QUÁN QUÂN TOP 1
                    </span>
                    <h4 className="font-black text-lg text-white mt-1.5">{top5[0].studentName}</h4>
                    <span className="text-xs text-amber-200 font-bold block">Lớp {top5[0].classId}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-amber-400/30 w-full">
                    <span className="font-black text-amber-300 text-2xl">{top5[0].score} điểm</span>
                    <span className="text-xs text-indigo-200 block">Thời gian: {top5[0].durationSeconds} giây</span>
                  </div>
                </div>
              )}

              {/* TOP 3 (Bronze) */}
              {top5[2] && (
                <div className="order-3 bg-white/10 backdrop-blur-md rounded-2xl border border-amber-700/30 p-5 text-center flex flex-col items-center justify-between min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black text-lg shadow-md mb-2">
                    🥉
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600/20 text-amber-200">
                      TOP 3
                    </span>
                    <h4 className="font-black text-base text-white mt-1 line-clamp-1">{top5[2].studentName}</h4>
                    <span className="text-xs text-indigo-200 font-semibold block">Lớp {top5[2].classId}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/10 w-full">
                    <span className="font-extrabold text-amber-300 text-lg">{top5[2].score} đ</span>
                    <span className="text-[11px] text-indigo-300 block">{top5[2].durationSeconds} giây</span>
                  </div>
                </div>
              )}
            </div>

            {/* TOP 4 & TOP 5 Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
              {top5[3] && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-lg bg-indigo-500/30 text-amber-300 font-bold text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>TOP 4</span>
                    </span>
                    <span className="font-bold text-white text-sm">{top5[3].studentName}</span>
                    <span className="text-indigo-300 text-xs">(Lớp {top5[3].classId})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-300">{top5[3].score} điểm</span>
                    <span className="text-[10px] text-indigo-300 block">{top5[3].durationSeconds}s</span>
                  </div>
                </div>
              )}

              {top5[4] && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-lg bg-indigo-500/30 text-amber-300 font-bold text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>TOP 5</span>
                    </span>
                    <span className="font-bold text-white text-sm">{top5[4].studentName}</span>
                    <span className="text-indigo-300 text-xs">(Lớp {top5[4].classId})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-300">{top5[4].score} điểm</span>
                    <span className="text-[10px] text-indigo-300 block">{top5[4].durationSeconds}s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* FULL RANKING TABLE */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-base">Toàn Bộ Bảng Xếp Hạng</h4>
            <p className="text-xs text-slate-500">Xếp từ điểm cao nhất đến thấp nhất (ưu tiên thời gian hoàn thành)</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {filteredResults.length} lượt học sinh đã tham gia
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4 w-16 text-center">Hạng</th>
                <th className="p-4">Học sinh</th>
                <th className="p-4">Lớp</th>
                <th className="p-4">Trò chơi</th>
                <th className="p-4">Điểm số</th>
                <th className="p-4">Số câu đúng</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Thời điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không có dữ liệu lượt chơi nào.
                  </td>
                </tr>
              ) : (
                filteredResults.map((res, idx) => (
                  <tr key={res.id} className={`hover:bg-slate-50 transition ${idx < 5 ? 'bg-amber-50/20' : ''}`}>
                    <td className="p-4 text-center">
                      {idx === 0 ? (
                        <span className="font-black text-base text-amber-500">🥇 1</span>
                      ) : idx === 1 ? (
                        <span className="font-black text-base text-slate-400">🥈 2</span>
                      ) : idx === 2 ? (
                        <span className="font-black text-base text-amber-700">🥉 3</span>
                      ) : idx < 5 ? (
                        <span className="font-bold text-xs text-amber-600">⭐ {idx + 1}</span>
                      ) : (
                        <span className="font-bold text-slate-400">{idx + 1}</span>
                      )}
                    </td>

                    <td className="p-4 font-extrabold text-slate-900 text-sm">
                      {res.studentName}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                        {res.classId}
                      </span>
                    </td>

                    <td className="p-4 text-slate-700 font-medium max-w-xs truncate">
                      {res.gameTitle}
                    </td>

                    <td className="p-4 font-black text-emerald-600 text-sm">
                      {res.score}/{res.totalScore}
                    </td>

                    <td className="p-4 text-slate-600">
                      {res.correctAnswersCount}/{res.totalQuestionsCount} câu ({res.accuracyRate}%)
                    </td>

                    <td className="p-4 text-slate-500 font-mono">
                      {res.durationSeconds} giây
                    </td>

                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(res.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(res.completedAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
