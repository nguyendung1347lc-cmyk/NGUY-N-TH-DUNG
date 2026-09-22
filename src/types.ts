export type ClassId = '10A' | '10B' | '11A' | '11B' | '12A' | '12B' | string;

export interface Classroom {
  id: ClassId;
  name: string;
  grade: '10' | '11' | '12';
  studentCount: number;
  homeroomTeacher: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
}

export type FileTypeAllowed = 'word' | 'pdf' | 'powerpoint' | 'image' | 'all';

export interface Task {
  id: string;
  title: string;
  subject: string;
  grade: '10' | '11' | '12';
  targetClasses: ClassId[]; // e.g. ['10A', '10B']
  topic: string;
  objective: string;
  instructions: string;
  deadline: string; // ISO string or formatted string
  allowedFileTypes: FileTypeAllowed[];
  studentNotes?: string;
  createdAt: string;
  status: 'active' | 'closed';
}

export interface StudentSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentName: string;
  classId: ClassId;
  fileName: string;
  fileType: string;
  fileSize: string; // e.g. "2.4 MB"
  fileDataUrl?: string; // For previews if uploaded
  submittedAt: string;
  status: 'submitted' | 'reviewed';
  score?: number;
  teacherFeedback?: string;
}

export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'short_answer' 
  | 'drag_fill' 
  | 'matching' 
  | 'sequencing';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  points: number;
  // For multiple_choice
  options?: string[]; // A, B, C, D
  correctAnswer?: string; // e.g. "A" or text
  // For true_false
  correctBoolean?: boolean;
  // For short_answer
  acceptedAnswers?: string[];
  // For drag_fill: prompt has [blank], choices are options
  fillChoices?: string[];
  correctFill?: string;
  // For matching: pairs of { left: string, right: string }
  matchingPairs?: { left: string; right: string }[];
  // For sequencing: correct order of steps
  sequenceSteps?: string[];
  explanation?: string;
}

export interface QuizGame {
  id: string;
  title: string;
  subject: string;
  grade: '10' | '11' | '12';
  targetClasses: ClassId[];
  topic: string;
  description: string;
  timeLimitPerQuestion?: number; // seconds, or 0 if unlimited
  questions: Question[];
  totalPoints: number;
  createdAt: string;
  status: 'active' | 'closed';
}

export interface GameResult {
  id: string;
  gameId: string;
  gameTitle: string;
  studentName: string;
  classId: ClassId;
  score: number;
  totalScore: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  accuracyRate: number; // percentage, e.g. 90
  durationSeconds: number; // in seconds
  completedAt: string;
}

export type ActivityNotification = {
  id: string;
  type: 'submission' | 'game_complete' | 'task_created' | 'game_created';
  title: string;
  message: string;
  timestamp: string;
  classId?: ClassId;
  taskId?: string;
  gameId?: string;
  read: boolean;
};

export type SystemNotification = ActivityNotification;

export type ActiveTab = 
  | 'overview' 
  | 'classes' 
  | 'tasks' 
  | 'submissions' 
  | 'games' 
  | 'results' 
  | 'statistics' 
  | 'notifications';
