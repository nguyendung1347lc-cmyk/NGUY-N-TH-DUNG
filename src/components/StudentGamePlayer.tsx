import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  School, 
  User, 
  Award,
  Star,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizGame, ClassId, GameResult, Question } from '../types';

interface StudentGamePlayerProps {
  game: QuizGame;
  defaultClassId?: ClassId;
  onSubmitResult: (result: Omit<GameResult, 'id' | 'completedAt'>) => void;
  onViewLeaderboard?: () => void;
  onBackToOverview?: () => void;
}

export const StudentGamePlayer: React.FC<StudentGamePlayerProps> = ({
  game,
  defaultClassId,
  onSubmitResult,
  onViewLeaderboard,
  onBackToOverview
}) => {
  // Step: 'register' -> 'playing' -> 'finished'
  const [step, setStep] = useState<'register' | 'playing' | 'finished'>('register');
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('lop_hoc_so_last_student_name') || '';
  });
  const [selectedClass, setSelectedClass] = useState<ClassId>(
    (defaultClassId && game.targetClasses.includes(defaultClassId)) 
      ? defaultClassId 
      : (game.targetClasses[0] || '10A')
  );

  // Gameplay state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [shortAnswerText, setShortAnswerText] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(game.timeLimitPerQuestion || 30);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [finalScore, setFinalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const currentQ: Question | undefined = game.questions[currentQIndex];

  // Timer countdown per question
  useEffect(() => {
    if (step !== 'playing' || !game.timeLimitPerQuestion || isAnswerRevealed) return;

    if (timeLeft <= 0) {
      handleConfirmAnswer();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft, isAnswerRevealed]);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Vui lòng nhập Họ và tên để ghi nhận kết quả và vinh danh nhé!');
      return;
    }
    localStorage.setItem('lop_hoc_so_last_student_name', studentName.trim());
    setGameStartTime(Date.now());
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeft(game.timeLimitPerQuestion || 30);
    setStep('playing');
  };

  const checkIsCorrect = (q: Question, ans: any): boolean => {
    if (q.type === 'multiple_choice') {
      return ans === q.correctAnswer;
    } else if (q.type === 'true_false') {
      return ans === q.correctBoolean;
    } else if (q.type === 'short_answer') {
      if (!ans || typeof ans !== 'string') return false;
      const clean = ans.trim().toLowerCase();
      return q.acceptedAnswers?.some(a => a.toLowerCase() === clean) || false;
    } else if (q.type === 'drag_fill') {
      return ans === q.correctFill;
    }
    return true;
  };

  const handleConfirmAnswer = () => {
    if (!currentQ) return;
    setIsAnswerRevealed(true);

    let answer: any = null;
    if (currentQ.type === 'multiple_choice') answer = selectedAnswer;
    else if (currentQ.type === 'true_false') answer = selectedBool;
    else if (currentQ.type === 'short_answer') answer = shortAnswerText;
    else if (currentQ.type === 'drag_fill') answer = selectedAnswer;

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
  };

  const handleNextQuestion = () => {
    setIsAnswerRevealed(false);
    setSelectedAnswer(null);
    setSelectedBool(null);
    setShortAnswerText('');

    if (currentQIndex + 1 < game.questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setTimeLeft(game.timeLimitPerQuestion || 30);
    } else {
      // Calculate final results
      const totalTime = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
      setDurationSeconds(totalTime);

      let earnedScore = 0;
      let corrects = 0;

      game.questions.forEach(q => {
        const ans = userAnswers[q.id];
        const isRight = checkIsCorrect(q, ans);
        if (isRight) {
          earnedScore += (q.points || 20);
          corrects += 1;
        }
      });

      setFinalScore(earnedScore);
      setCorrectCount(corrects);
      setStep('finished');

      // Submit result to teacher's database
      onSubmitResult({
        gameId: game.id,
        gameTitle: game.title,
        studentName: studentName.trim(),
        classId: selectedClass,
        score: earnedScore,
        totalScore: game.totalPoints,
        correctAnswersCount: corrects,
        totalQuestionsCount: game.questions.length,
        durationSeconds: totalTime,
        accuracyRate: Math.round((corrects / game.questions.length) * 100)
      });

      // Confetti for good performance!
      if (corrects >= game.questions.length * 0.6) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-4 sm:px-6">
      {/* STEP 1: REGISTRATION (NO LOGIN REQUIRED) */}
      {step === 'register' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-6 space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-purple-100 text-xs font-bold">
              <Gamepad2 className="w-4 h-4 text-purple-200" />
              <span>TRÒ CHƠI CỦNG CỐ KIẾN THỨC</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{game.title}</h1>
            <p className="text-xs text-purple-200">{game.description}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-semibold text-purple-200">
              <span>⚡ {game.questions.length} câu hỏi</span>
              <span>🏆 {game.totalPoints} điểm tối đa</span>
            </div>
          </div>

          <form onSubmit={handleStartGame} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-600" />
                <span>Nhập Họ và Tên của em <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Ví dụ: Trần Minh Đức"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <School className="w-4 h-4 text-purple-600" />
                <span>Chọn lớp của em <span className="text-rose-500">*</span></span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {game.targetClasses.map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`py-2.5 rounded-xl font-black text-xs transition border ${
                      selectedClass === cls
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Lớp {cls}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-purple-200 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              <span>BẮT ĐẦU TRÒ CHƠI NGAY</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: PLAYING QUESTION */}
      {step === 'playing' && currentQ && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-4 animate-in fade-in duration-200">
          {/* Progress & Question Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-purple-100 text-purple-800">
                Câu {currentQIndex + 1}/{game.questions.length}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                +{currentQ.points || 20} điểm
              </span>
            </div>

            {game.timeLimitPerQuestion ? (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-200 text-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            ) : null}
          </div>

          {/* Question Prompt */}
          <div className="p-6 space-y-5">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {currentQ.prompt}
            </h3>

            {/* Multiple Choice Options */}
            {currentQ.type === 'multiple_choice' && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrectAnswer = opt === currentQ.correctAnswer;
                  
                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (isAnswerRevealed) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black';
                    } else if (isSelected && !isCorrectAnswer) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-900';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-purple-600 text-white border-purple-600 shadow-sm font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerRevealed}
                      onClick={() => setSelectedAnswer(opt)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerRevealed && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerRevealed && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* True / False */}
            {currentQ.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, label: 'ĐÚNG' },
                  { val: false, label: 'SAI' }
                ].map(item => {
                  const isSelected = selectedBool === item.val;
                  const isCorrect = item.val === currentQ.correctBoolean;
                  let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                  if (isAnswerRevealed) {
                    if (isCorrect) style = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black';
                    else if (isSelected) style = 'bg-rose-100 border-rose-500 text-rose-900';
                  } else if (isSelected) {
                    style = 'bg-purple-600 text-white border-purple-600 font-bold';
                  }

                  return (
                    <button
                      key={item.label}
                      disabled={isAnswerRevealed}
                      onClick={() => setSelectedBool(item.val)}
                      className={`p-4 rounded-2xl border text-center font-black text-sm transition ${style}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Short Answer */}
            {currentQ.type === 'short_answer' && (
              <div className="space-y-2">
                <input
                  type="text"
                  disabled={isAnswerRevealed}
                  value={shortAnswerText}
                  onChange={e => setShortAnswerText(e.target.value)}
                  placeholder="Gõ câu trả lời của em tại đây..."
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
                {isAnswerRevealed && (
                  <p className="text-xs text-slate-600">
                    Đáp án đúng được chấp nhận: <strong className="text-emerald-700">{currentQ.acceptedAnswers?.join(' / ')}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Explanation card after reveal */}
            {isAnswerRevealed && currentQ.explanation && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-900 animate-in fade-in">
                💡 <strong>Kiến thức ghi nhớ:</strong> {currentQ.explanation}
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100">
              {!isAnswerRevealed ? (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                >
                  XÁC NHẬN CÂU TRẢ LỜI
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>{currentQIndex + 1 < game.questions.length ? 'CÂU TIẾP THEO' : 'XEM KẾT QUẢ & THÀNH TÍCH'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: FINISHED SCORE & CELEBRATION */}
      {step === 'finished' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black">
              HOÀN THÀNH THỬ THÁCH
            </span>
            <h2 className="text-2xl font-black text-slate-900 pt-2">
              Chúc Mừng {studentName}!
            </h2>
            <p className="text-xs text-slate-500">Lớp {selectedClass} • {game.title}</p>
          </div>

          {/* Big Score Badge */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-purple-100 max-w-sm mx-auto space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Điểm Đạt Được</span>
            <div className="text-4xl font-black text-purple-700">
              {finalScore} <span className="text-lg font-normal text-slate-400">/ {game.totalPoints}</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-600 pt-2 font-semibold">
              <span className="text-emerald-700">✓ {correctCount}/{game.questions.length} câu đúng</span>
              <span className="text-slate-500">⏱ {durationSeconds} giây</span>
            </div>
          </div>

          {/* Motivational note */}
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Kết quả của em đã được tự động lưu vào <strong>Bảng Vinh Danh</strong> của cô giáo Nguyễn Thị Dung.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onViewLeaderboard && (
              <button
                onClick={onViewLeaderboard}
                className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                <span>Xem Bảng Vinh Danh TOP 5</span>
              </button>
            )}

            <button
              onClick={() => {
                setStep('register');
              }}
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
