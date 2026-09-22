import React, { useState } from 'react';
import { 
  Gamepad2, 
  PlusCircle, 
  QrCode, 
  Copy, 
  Check, 
  Trophy, 
  Play, 
  Clock, 
  Trash2, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';
import { QuizGame, Question, QuestionType, ClassId } from '../types';
import { getShareableUrl } from '../utils/qrHelper';

interface GameManagementProps {
  games: QuizGame[];
  onCreateGame: (game: Omit<QuizGame, 'id' | 'createdAt'>) => void;
  onShowQR: (type: 'task' | 'game', id: string, title: string, targetClasses: string[]) => void;
  onOpenLeaderboard: (gameId: string) => void;
  onOpenStudentView: (type: 'task' | 'game', id: string) => void;
}

export const GameManagement: React.FC<GameManagementProps> = ({
  games,
  onCreateGame,
  onShowQR,
  onOpenLeaderboard,
  onOpenStudentView
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedGameId, setCopiedGameId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Sinh học');
  const [grade, setGrade] = useState<'10' | '11' | '12'>('10');
  const [selectedClasses, setSelectedClasses] = useState<ClassId[]>(['10A', '10B']);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-new-1',
      type: 'multiple_choice',
      prompt: 'Câu hỏi trắc nghiệm số 1:',
      points: 25,
      options: ['A. Lựa chọn A', 'B. Lựa chọn B', 'C. Lựa chọn C', 'D. Lựa chọn D'],
      correctAnswer: 'A. Lựa chọn A',
      explanation: 'Giải thích kiến thức cho học sinh'
    }
  ]);

  const handleCopyLink = (gameId: string) => {
    const url = getShareableUrl('game', gameId);
    navigator.clipboard.writeText(url);
    setCopiedGameId(gameId);
    setTimeout(() => setCopiedGameId(null), 2500);
  };

  const handleAddQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: `q-${Date.now()}-${questions.length + 1}`,
      type,
      prompt: type === 'multiple_choice' 
        ? 'Nhập nội dung câu hỏi trắc nghiệm:'
        : type === 'true_false'
        ? 'Nhập nhận định đúng / sai:'
        : type === 'short_answer'
        ? 'Nhập câu hỏi điền từ ngắn:'
        : type === 'drag_fill'
        ? 'Câu hỏi có chỗ khuyết [blank]...'
        : type === 'matching'
        ? 'Nối cột A với cột B phù hợp:'
        : 'Sắp xếp các bước sau theo đúng thứ tự:',
      points: 20,
      options: type === 'multiple_choice' ? ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'] : undefined,
      correctAnswer: type === 'multiple_choice' ? 'A. Đáp án 1' : undefined,
      correctBoolean: type === 'true_false' ? true : undefined,
      acceptedAnswers: type === 'short_answer' ? ['Từ khóa'] : undefined,
      fillChoices: type === 'drag_fill' ? ['Từ đúng', 'Từ bẫy 1', 'Từ bẫy 2'] : undefined,
      correctFill: type === 'drag_fill' ? 'Từ đúng' : undefined,
      matchingPairs: type === 'matching' ? [
        { left: 'Khái niệm A', right: 'Định nghĩa A' },
        { left: 'Khái niệm B', right: 'Định nghĩa B' }
      ] : undefined,
      sequenceSteps: type === 'sequencing' ? [
        'Bước 1: Chuẩn bị',
        'Bước 2: Tiến hành',
        'Bước 3: Tổng kết'
      ] : undefined
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('Trò chơi cần ít nhất 1 câu hỏi.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên trò chơi.');
      return;
    }

    const totalPts = questions.reduce((sum, q) => sum + (q.points || 20), 0);

    onCreateGame({
      title,
      subject,
      grade,
      targetClasses: selectedClasses,
      topic: topic || 'Ôn tập kiến thức',
      description: description || 'Trò chơi tương tác rèn luyện tư duy nhanh.',
      timeLimitPerQuestion: timeLimit,
      questions,
      totalPoints: totalPts,
      status: 'active'
    });

    setIsCreateModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <span>Trò Chơi Củng Cố Kiến Thức (Gamification)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Học sinh quét mã QR / mở Link → Nhập Họ tên + Lớp → Chơi trực tiếp trên điện thoại
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm shadow-purple-200 transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ TẠO TRÒ CHƠI MỚI</span>
        </button>
      </div>

      {/* Gamification Highlights Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">6 Dạng Câu Hỏi Đa Dạng</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">Trắc nghiệm, Đúng/Sai, Điền từ, Kéo thả, Ghép đôi, Sắp xếp thứ tự.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Bảng Vinh Danh TOP 5</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">Tự động tính điểm, xếp hạng từ cao xuống thấp & trao danh hiệu vinh danh.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Chiếu QR Lên Bảng / Máy Chiếu</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">Cả lớp cùng quét QR tham gia ngay cuối tiết mà không cần đăng nhập.</p>
          </div>
        </div>
      </div>

      {/* List of Created Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {games.map(game => {
          const isCopied = copiedGameId === game.id;
          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                    {game.subject} • Khối {game.grade}
                  </span>
                  <div className="flex items-center gap-1">
                    {game.targetClasses.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                  <span>⚡ <strong>{game.questions.length}</strong> câu hỏi</span>
                  <span>🏆 <strong>{game.totalPoints}</strong> điểm tối đa</span>
                  {game.timeLimitPerQuestion ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {game.timeLimitPerQuestion}s / câu
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(game.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Đã sao chép!' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={() => onShowQR('game', game.id, game.title, game.targetClasses)}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Mã QR</span>
                  </button>

                  <button
                    onClick={() => onOpenStudentView('game', game.id)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
                    title="Mở giao diện học sinh để chơi thử"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenLeaderboard(game.id)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Xem TOP 5 & Xếp hạng</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE GAME MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center gap-2.5 text-purple-700">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Gamepad2 className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Tạo Trò Chơi Củng Cố Mới</h3>
                  <p className="text-xs text-slate-500">Tổ chức trò chơi nhanh cuối tiết học với tính năng chấm điểm & xếp hạng</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên trò chơi / Thử thách <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Đấu trí 5 phút: Ôn tập quy luật di truyền"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian/câu</label>
                  <select
                    value={timeLimit}
                    onChange={e => setTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="15">15 giây</option>
                    <option value="25">25 giây</option>
                    <option value="30">30 giây</option>
                    <option value="45">45 giây</option>
                    <option value="0">Không giới hạn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ví dụ: Rèn phản xạ nhanh câu hỏi trắc nghiệm và điền khuyết"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Questions Builder */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">
                    Danh Sách Câu Hỏi ({questions.length})
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-semibold">+ Thêm:</span>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('multiple_choice')}
                      className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-200"
                    >
                      Trắc nghiệm A/B/C/D
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('true_false')}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200"
                    >
                      Đúng / Sai
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('short_answer')}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200"
                    >
                      Điền từ ngắn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('matching')}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-200"
                    >
                      Ghép đôi
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-700">
                          Câu {idx + 1} ({q.type === 'multiple_choice' ? 'Trắc nghiệm' : q.type === 'true_false' ? 'Đúng/Sai' : q.type === 'short_answer' ? 'Điền từ' : 'Ghép đôi'})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.prompt}
                        onChange={e => {
                          const updated = [...questions];
                          updated[idx].prompt = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder="Nội dung câu hỏi..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                      />

                      {q.type === 'multiple_choice' && q.options && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <input
                              key={oIdx}
                              type="text"
                              value={opt}
                              onChange={e => {
                                const updated = [...questions];
                                if (updated[idx].options) {
                                  updated[idx].options![oIdx] = e.target.value;
                                }
                                setQuestions(updated);
                              }}
                              className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  TẠO TRÒ CHƠI & LẤY MÃ QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
