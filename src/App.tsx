import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { 
  Classroom, 
  Task, 
  StudentSubmission, 
  QuizGame, 
  GameResult, 
  ActivityNotification, 
  ActiveTab,
  ClassId 
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ClassManagement } from './components/ClassManagement';
import { TaskManagement } from './components/TaskManagement';
import { TaskDetailSubmissions } from './components/TaskDetailSubmissions';
import { SubmissionRepository } from './components/SubmissionRepository';
import { GameManagement } from './components/GameManagement';
import { GameResultsLeaderboard } from './components/GameResultsLeaderboard';
import { StatisticsView } from './components/StatisticsView';
import { StudentTaskPortal } from './components/StudentTaskPortal';
import { StudentGamePlayer } from './components/StudentGamePlayer';
import { QRModal } from './components/QRModal';
import { parseUrlParams } from './utils/qrHelper';
import { 
  GraduationCap, 
  FileEdit, 
  Gamepad2, 
  ArrowRight
} from 'lucide-react';

export function App() {
  // Core Data States
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [games, setGames] = useState<QuizGame[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);

  // Navigation & View States
  const [currentView, setCurrentView] = useState<'teacher' | 'student'>('teacher');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedTaskIdForSubmissions, setSelectedTaskIdForSubmissions] = useState<string | null>(null);
  const [selectedGameIdForLeaderboard, setSelectedGameIdForLeaderboard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Student Active Item Selection
  const [activeStudentTask, setActiveStudentTask] = useState<Task | null>(null);
  const [activeStudentGame, setActiveStudentGame] = useState<QuizGame | null>(null);

  // Modals
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    type: 'task' | 'game' | 'class';
    id: string;
    title: string;
    targetClasses: string[];
  }>({
    isOpen: false,
    type: 'task',
    id: '',
    title: '',
    targetClasses: []
  });

  // 1. Initial Load & URL Parameter routing
  useEffect(() => {
    refreshData();

    // Check URL parameters for direct student QR/Link access
    const { type, id, view } = parseUrlParams();

    if (view === 'student' || type) {
      setCurrentView('student');
      const loadedTasks = storageService.getTasks();
      const loadedGames = storageService.getGames();

      if (type === 'task' && id) {
        const found = loadedTasks.find(t => t.id === id);
        if (found) setActiveStudentTask(found);
      } else if (type === 'game' && id) {
        const found = loadedGames.find(g => g.id === id);
        if (found) setActiveStudentGame(found);
      }
    }
  }, []);

  const refreshData = () => {
    setClasses(storageService.getClasses());
    setTasks(storageService.getTasks());
    setSubmissions(storageService.getSubmissions());
    setGames(storageService.getGames());
    setResults(storageService.getResults());
    setNotifications(storageService.getNotifications());
  };

  // Handlers for Tasks
  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = storageService.addTask(taskData);
    refreshData();
    // Show QR modal for teacher to project/share immediately
    handleShowQR('task', newTask.id, newTask.title, newTask.targetClasses);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Cô Dung có chắc chắn muốn xóa nhiệm vụ này không?')) {
      storageService.deleteTask(id);
      refreshData();
      if (selectedTaskIdForSubmissions === id) {
        setSelectedTaskIdForSubmissions(null);
      }
    }
  };

  const handleUpdateReview = (submissionId: string, score: number | undefined, feedback: string) => {
    storageService.updateSubmissionReview(submissionId, score, feedback);
    refreshData();
  };

  // Handlers for Games
  const handleCreateGame = (gameData: Omit<QuizGame, 'id' | 'createdAt'>) => {
    const newGame = storageService.addGame(gameData);
    refreshData();
    handleShowQR('game', newGame.id, newGame.title, newGame.targetClasses);
  };

  const handleStudentSubmitTask = (subData: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    storageService.addSubmission(subData);
    refreshData();
  };

  const handleStudentSubmitGameResult = (resultData: Omit<GameResult, 'id' | 'completedAt'>) => {
    storageService.addGameResult(resultData);
    refreshData();
  };

  // QR Modal Trigger
  const handleShowQR = (type: 'task' | 'game' | 'class', id: string, title: string, targetClasses: string[]) => {
    setQrModal({
      isOpen: true,
      type,
      id,
      title,
      targetClasses
    });
  };

  // Switch to student view for specific item
  const handleOpenStudentView = (type: 'task' | 'game', id: string) => {
    setCurrentView('student');
    if (type === 'task') {
      const t = tasks.find(item => item.id === id);
      if (t) {
        setActiveStudentTask(t);
        setActiveStudentGame(null);
      }
    } else {
      const g = games.find(item => item.id === id);
      if (g) {
        setActiveStudentGame(g);
        setActiveStudentTask(null);
      }
    }
  };

  const handleResetData = () => {
    storageService.resetAllData();
    refreshData();
  };

  const handleMarkNotificationsRead = () => {
    storageService.markAllNotificationsAsRead();
    setNotifications(storageService.getNotifications());
  };

  const handleOpenNotificationTarget = (notif: ActivityNotification) => {
    if (notif.taskId) {
      setSelectedTaskIdForSubmissions(notif.taskId);
      setActiveTab('tasks');
    } else if (notif.gameId) {
      setSelectedGameIdForLeaderboard(notif.gameId);
      setActiveTab('results');
    } else if (notif.classId) {
      setSelectedClassId(notif.classId);
      setActiveTab('classes');
    }
  };

  // Filter tasks or submissions when global search query is used
  const displayTasks = searchQuery.trim()
    ? tasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.targetClasses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tasks;

  const displaySubmissions = searchQuery.trim()
    ? submissions.filter(s =>
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.classId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : submissions;

  const activeTaskForDetail = selectedTaskIdForSubmissions 
    ? tasks.find(t => t.id === selectedTaskIdForSubmissions) 
    : null;

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'submitted').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onToggleView={(view) => {
          setCurrentView(view);
          if (view === 'student') {
            setActiveStudentTask(null);
            setActiveStudentGame(null);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onResetData={handleResetData}
        onOpenNotificationTarget={handleOpenNotificationTarget}
      />

      {/* Main Body Layout */}
      {currentView === 'teacher' ? (
        /* TEACHER PERSPECTIVE */
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={(tab: ActiveTab) => {
              setActiveTab(tab);
              setSelectedClassId(null);
              setSelectedTaskIdForSubmissions(null);
            }}
            pendingSubmissionsCount={pendingSubmissionsCount}
            totalActiveTasks={tasks.length}
            totalGames={games.length}
            onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* 1. Dashboard View */}
            {activeTab === 'overview' && !selectedClassId && (
              <TeacherDashboard
                classes={classes}
                tasks={displayTasks}
                submissions={displaySubmissions}
                games={games}
                results={results}
                notifications={notifications}
                onNavigateTab={(tab: ActiveTab) => {
                  setActiveTab(tab);
                  setSelectedClassId(null);
                }}
                onSelectClass={(classId: string) => {
                  setSelectedClassId(classId);
                  setActiveTab('classes');
                }}
                onOpenCreateTask={() => setIsCreateTaskModalOpen(true)}
                onOpenCreateGame={() => setActiveTab('games')}
                onShowQR={handleShowQR}
                onViewTaskSubmissions={(taskId: string) => {
                  setSelectedTaskIdForSubmissions(taskId);
                  setActiveTab('tasks');
                }}
              />
            )}

            {/* 2. Specific Class Management View */}
            {activeTab === 'classes' && (
              <ClassManagement
                classes={classes}
                tasks={tasks}
                submissions={submissions}
                games={games}
                results={results}
                selectedClassId={selectedClassId}
                onSelectClass={(id: string | null) => setSelectedClassId(id)}
                onShowQR={handleShowQR}
                onViewTaskSubmissions={(taskId: string) => {
                  setSelectedTaskIdForSubmissions(taskId);
                  setActiveTab('tasks');
                }}
              />
            )}

            {/* 3. Task Management & Submissions */}
            {activeTab === 'tasks' && !selectedTaskIdForSubmissions && (
              <TaskManagement
                tasks={displayTasks}
                submissions={displaySubmissions}
                isCreateModalOpen={isCreateTaskModalOpen}
                onOpenCreateModal={() => setIsCreateTaskModalOpen(true)}
                onCloseCreateModal={() => setIsCreateTaskModalOpen(false)}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
                onShowQR={handleShowQR}
                onViewTaskSubmissions={(taskId: string) => setSelectedTaskIdForSubmissions(taskId)}
                onOpenStudentView={handleOpenStudentView}
              />
            )}

            {/* 3b. Specific Task Submissions View */}
            {activeTab === 'tasks' && activeTaskForDetail && (
              <TaskDetailSubmissions
                task={activeTaskForDetail}
                submissions={submissions}
                onBack={() => setSelectedTaskIdForSubmissions(null)}
                onUpdateReview={handleUpdateReview}
                onShowQR={handleShowQR}
              />
            )}

            {/* 4. Submissions Repository ("Kho bài nộp") */}
            {activeTab === 'submissions' && (
              <SubmissionRepository
                submissions={displaySubmissions}
                tasks={tasks}
                classes={classes}
                onOpenReviewModal={(sub) => {
                  setSelectedTaskIdForSubmissions(sub.taskId);
                  setActiveTab('tasks');
                }}
              />
            )}

            {/* 5. Games Management */}
            {activeTab === 'games' && (
              <GameManagement
                games={games}
                onCreateGame={handleCreateGame}
                onShowQR={handleShowQR}
                onOpenLeaderboard={(gameId) => {
                  setSelectedGameIdForLeaderboard(gameId);
                  setActiveTab('results');
                }}
                onOpenStudentView={handleOpenStudentView}
              />
            )}

            {/* 6. Leaderboard & TOP 5 Results */}
            {activeTab === 'results' && (
              <GameResultsLeaderboard
                results={results}
                games={games}
                classes={classes}
                selectedGameId={selectedGameIdForLeaderboard || undefined}
              />
            )}

            {/* 7. Statistics View */}
            {activeTab === 'statistics' && (
              <StatisticsView
                classes={classes}
                tasks={tasks}
                submissions={submissions}
                games={games}
                results={results}
              />
            )}
          </main>
        </div>
      ) : (
        /* STUDENT PERSPECTIVE (ZERO LOGIN REQUIRED) */
        <div className="flex-1 py-6 px-4 max-w-4xl mx-auto w-full space-y-6">
          {/* Active Student Task View */}
          {activeStudentTask ? (
            <StudentTaskPortal
              task={activeStudentTask}
              onSubmit={handleStudentSubmitTask}
              onBackToOverview={() => setActiveStudentTask(null)}
            />
          ) : activeStudentGame ? (
            /* Active Student Game View */
            <StudentGamePlayer
              game={activeStudentGame}
              onSubmitResult={handleStudentSubmitGameResult}
              onViewLeaderboard={() => {
                setCurrentView('teacher');
                setActiveTab('results');
                setSelectedGameIdForLeaderboard(activeStudentGame.id);
              }}
              onBackToOverview={() => setActiveStudentGame(null)}
            />
          ) : (
            /* Student General Portal / Activity Selector */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>CỔNG HỌC TẬP HỌC SINH THPT</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Lớp Học Số – Cô Giáo Nguyễn Thị Dung
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
                  Học sinh không cần đăng nhập hay nhớ mật khẩu. Chọn nhiệm vụ hoặc trò chơi bên dưới để nộp bài và tham gia củng cố kiến thức!
                </p>
              </div>

              {/* Tasks to submit */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-indigo-600" />
                    <span>Nhiệm Vụ Học Tập Cần Nộp</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {tasks.length} nhiệm vụ đang mở
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setActiveStudentTask(task)}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {task.subject} • Khối {task.grade}
                          </span>
                          <div className="flex items-center gap-1">
                            {task.targetClasses.map(c => (
                              <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {task.objective}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Hạn nộp: {new Date(task.deadline).toLocaleDateString('vi-VN')}</span>
                        <span className="font-bold text-indigo-600 flex items-center gap-1">
                          <span>Nộp bài</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Games to play */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-purple-600" />
                    <span>Trò Chơi Củng Cố Kiến Thức</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {games.length} trò chơi thử thách
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.map(game => (
                    <div
                      key={game.id}
                      onClick={() => setActiveStudentGame(game)}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                            {game.subject} • Khối {game.grade}
                          </span>
                          <div className="flex items-center gap-1">
                            {game.targetClasses.map(c => (
                              <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {game.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {game.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{game.questions.length} câu • {game.totalPoints} điểm</span>
                        <span className="font-bold text-purple-600 flex items-center gap-1">
                          <span>Chơi ngay</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REUSABLE QR MODAL (Projector / Screen Sharing Ready) */}
      <QRModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal(prev => ({ ...prev, isOpen: false }))}
        type={qrModal.type}
        itemId={qrModal.id}
        title={qrModal.title}
        targetClasses={qrModal.targetClasses}
        onOpenStudentView={handleOpenStudentView}
      />
    </div>
  );
}
export default App;
