import { Classroom, Task, StudentSubmission, QuizGame, GameResult, ActivityNotification } from '../types';
import { DEFAULT_CLASSES, INITIAL_TASKS, INITIAL_SUBMISSIONS, INITIAL_GAMES, INITIAL_GAME_RESULTS, INITIAL_NOTIFICATIONS } from '../data/initialData';

const KEYS = {
  CLASSES: 'lop_hoc_so_classes',
  TASKS: 'lop_hoc_so_tasks',
  SUBMISSIONS: 'lop_hoc_so_submissions',
  GAMES: 'lop_hoc_so_games',
  RESULTS: 'lop_hoc_so_results',
  NOTIFICATIONS: 'lop_hoc_so_notifications'
};

export const storageService = {
  getClasses(): Classroom[] {
    try {
      const data = localStorage.getItem(KEYS.CLASSES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveClasses(DEFAULT_CLASSES);
    return DEFAULT_CLASSES;
  },

  saveClasses(classes: Classroom[]): void {
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);

    this.addNotification({
      type: 'task_created',
      title: 'Nhiệm vụ mới đã tạo',
      message: `Đã tạo "${newTask.title}" cho các lớp: ${newTask.targetClasses.join(', ')}`,
      taskId: newTask.id,
      read: false
    });

    return newTask;
  },

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  },

  getSubmissions(): StudentSubmission[] {
    try {
      const data = localStorage.getItem(KEYS.SUBMISSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveSubmissions(INITIAL_SUBMISSIONS);
    return INITIAL_SUBMISSIONS;
  },

  saveSubmissions(subs: StudentSubmission[]): void {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(subs));
  },

  addSubmission(sub: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>): StudentSubmission {
    const subs = this.getSubmissions();
    const newSub: StudentSubmission = {
      ...sub,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };
    subs.unshift(newSub);
    this.saveSubmissions(subs);

    this.addNotification({
      type: 'submission',
      title: 'Bài nộp mới từ học sinh',
      message: `Học sinh ${newSub.studentName} (${newSub.classId}) vừa nộp bài cho "${newSub.taskTitle}"`,
      classId: newSub.classId,
      taskId: newSub.taskId,
      read: false
    });

    return newSub;
  },

  updateSubmissionReview(submissionId: string, score: number | undefined, teacherFeedback: string): void {
    const subs = this.getSubmissions();
    const index = subs.findIndex(s => s.id === submissionId);
    if (index !== -1) {
      subs[index] = {
        ...subs[index],
        score,
        teacherFeedback,
        status: 'reviewed'
      };
      this.saveSubmissions(subs);
    }
  },

  getGames(): QuizGame[] {
    try {
      const data = localStorage.getItem(KEYS.GAMES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveGames(INITIAL_GAMES);
    return INITIAL_GAMES;
  },

  saveGames(games: QuizGame[]): void {
    localStorage.setItem(KEYS.GAMES, JSON.stringify(games));
  },

  addGame(game: Omit<QuizGame, 'id' | 'createdAt'>): QuizGame {
    const games = this.getGames();
    const newGame: QuizGame = {
      ...game,
      id: `game-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    games.unshift(newGame);
    this.saveGames(games);

    this.addNotification({
      type: 'game_created',
      title: 'Trò chơi mới được tạo',
      message: `Đã tạo trò chơi củng cố: "${newGame.title}" (${newGame.questions.length} câu hỏi)`,
      gameId: newGame.id,
      read: false
    });

    return newGame;
  },

  getResults(): GameResult[] {
    try {
      const data = localStorage.getItem(KEYS.RESULTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveResults(INITIAL_GAME_RESULTS);
    return INITIAL_GAME_RESULTS;
  },

  getGameResults(): GameResult[] {
    return this.getResults();
  },

  saveResults(results: GameResult[]): void {
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
  },

  addGameResult(result: Omit<GameResult, 'id' | 'completedAt'>): GameResult {
    const results = this.getResults();
    const newRes: GameResult = {
      ...result,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      completedAt: new Date().toISOString()
    };
    results.unshift(newRes);
    this.saveResults(results);

    this.addNotification({
      type: 'game_complete',
      title: 'Học sinh hoàn thành trò chơi',
      message: `${newRes.studentName} (${newRes.classId}) đạt ${newRes.score}/${newRes.totalScore} điểm trò chơi "${newRes.gameTitle}"`,
      classId: newRes.classId,
      gameId: newRes.gameId,
      read: false
    });

    return newRes;
  },

  getNotifications(): ActivityNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  },

  saveNotifications(notifs: ActivityNotification[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif: Omit<ActivityNotification, 'id' | 'timestamp'>): void {
    const notifs = this.getNotifications();
    const newNotif: ActivityNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    this.saveNotifications(notifs.slice(0, 50)); // keep last 50
  },

  markAllNotificationsAsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(notifs);
  },

  clearNotifications(): void {
    this.saveNotifications([]);
  },

  resetAllData(): void {
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.setItem(KEYS.GAMES, JSON.stringify(INITIAL_GAMES));
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(INITIAL_GAME_RESULTS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};
