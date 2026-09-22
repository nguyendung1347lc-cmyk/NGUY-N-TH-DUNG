import { Classroom, Task, StudentSubmission, QuizGame, GameResult, ActivityNotification } from '../types';

export const DEFAULT_CLASSES: Classroom[] = [
  {
    id: '10A',
    name: 'Lớp 10A',
    grade: '10',
    studentCount: 42,
    homeroomTeacher: 'Cô Nguyễn Thị Dung',
    color: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Khối 10 - Ban Tự nhiên, học tập tích cực, năng động'
  },
  {
    id: '10B',
    name: 'Lớp 10B',
    grade: '10',
    studentCount: 40,
    homeroomTeacher: 'Thầy Trần Quốc Tuấn',
    color: 'text-teal-700',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Khối 10 - Ban Cơ bản, tinh thần tự giác cao'
  },
  {
    id: '11A',
    name: 'Lớp 11A',
    grade: '11',
    studentCount: 41,
    homeroomTeacher: 'Cô Lê Thị Mai',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Khối 11 - Định hướng KHTN, năng lực thực hành tốt'
  },
  {
    id: '11B',
    name: 'Lớp 11B',
    grade: '11',
    studentCount: 39,
    homeroomTeacher: 'Thầy Vũ Đình Trọng',
    color: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Khối 11 - Sáng tạo, thường xuyên làm việc nhóm'
  },
  {
    id: '12A',
    name: 'Lớp 12A',
    grade: '12',
    studentCount: 43,
    homeroomTeacher: 'Cô Nguyễn Thị Dung',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Khối 12 - Lớp trọng điểm ôn thi Tốt nghiệp THPT & ĐGNL'
  },
  {
    id: '12B',
    name: 'Lớp 12B',
    grade: '12',
    studentCount: 42,
    homeroomTeacher: 'Thầy Phạm Thanh Sơn',
    color: 'text-purple-700',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Khối 12 - Ôn tập chuyên đề, bứt phá giai đoạn nước rút'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    title: 'Nhiệm vụ 01 – Hoạt động khám phá: Cấu trúc & Chức năng Tế bào Nhân thực',
    subject: 'Sinh học',
    grade: '10',
    targetClasses: ['10A', '10B'],
    topic: 'Chương II: Sinh học tế bào',
    objective: 'Học sinh phân biệt được cấu trúc màng sinh chất, ti thể và lục lạp; vẽ hoặc thiết kế sơ đồ mô tả hoạt động vận chuyển chất qua màng.',
    instructions: '1. Đọc kĩ mục II bài 7 SGK.\n2. Lập bảng so sánh hoặc vẽ sơ đồ tư duy (trên giấy rồi chụp ảnh, hoặc làm trên Canva/PowerPoint/Word).\n3. Nộp file dưới định dạng PDF, Word, PowerPoint hoặc Ảnh rõ nét.',
    deadline: '2026-09-30T23:59',
    allowedFileTypes: ['pdf', 'word', 'powerpoint', 'image'],
    studentNotes: 'Ghi rõ Họ tên và Lớp ở góc trên trang bài làm trước khi nộp.',
    createdAt: '2026-09-20T08:00',
    status: 'active'
  },
  {
    id: 'task-102',
    title: 'Nhiệm vụ 02 – Phiếu học tập số 2: Cơ chế Quang hợp & Hô hấp ở Thực vật',
    subject: 'Sinh học',
    grade: '11',
    targetClasses: ['11A', '11B'],
    topic: 'Chương I: Trao đổi chất và chuyển hóa năng lượng ở sinh vật',
    objective: 'Trình bày pha sáng và pha tối của quang hợp, giải thích vai trò của sắc tố quang hợp đối với năng suất cây trồng.',
    instructions: 'Hoàn thành các câu hỏi trong Phiếu thực hành đính kèm trên lớp. Chụp ảnh bài làm trong vở hoặc đính kèm file Word/PDF tóm tắt câu trả lời.',
    deadline: '2026-10-05T18:00',
    allowedFileTypes: ['all'],
    studentNotes: 'Khuyến khích trình bày dưới dạng sơ đồ dòng năng lượng.',
    createdAt: '2026-09-21T09:30',
    status: 'active'
  },
  {
    id: 'task-103',
    title: 'Nhiệm vụ 03 – Tổng hợp chuyên đề: Quy luật Di truyền & Đột biến Gen',
    subject: 'Sinh học',
    grade: '12',
    targetClasses: ['12A', '12B'],
    topic: 'Chương I: Di truyền và Biến dị',
    objective: 'Hệ thống hóa các dạng bài tập lai một cặp tính trạng, tương tác gen và ứng dụng thực tiễn trong chọn giống.',
    instructions: 'Giải chi tiết 5 bài toán di truyền mẫu đã giao trong tiết học số 14. Trình bày các bước lập luận quy luật di truyền và viết sơ đồ lai từ P đến F2.',
    deadline: '2026-09-28T21:00',
    allowedFileTypes: ['pdf', 'word', 'image'],
    studentNotes: 'Bài tập bắt buộc phục vụ đánh giá thường xuyên kì I.',
    createdAt: '2026-09-19T14:15',
    status: 'active'
  }
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-01',
    taskId: 'task-101',
    taskTitle: 'Nhiệm vụ 01 – Hoạt động khám phá: Cấu trúc & Chức năng Tế bào Nhân thực',
    studentName: 'Nguyễn Văn An',
    classId: '10A',
    fileName: 'NguyenVanAn_10A_TeBaoNhanThuc.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    submittedAt: '2026-09-21T14:05',
    status: 'reviewed',
    score: 9.5,
    teacherFeedback: 'Bài làm rất chi tiết, sơ đồ ti thể vẽ tay rất đẹp và chú thích chuẩn xác.'
  },
  {
    id: 'sub-02',
    taskId: 'task-101',
    taskTitle: 'Nhiệm vụ 01 – Hoạt động khám phá: Cấu trúc & Chức năng Tế bào Nhân thực',
    studentName: 'Trần Thị Bích',
    classId: '10A',
    fileName: 'TranThiBich_BaiLam_NhiemVu01.docx',
    fileType: 'word',
    fileSize: '820 KB',
    submittedAt: '2026-09-21T14:08',
    status: 'reviewed',
    score: 9.0,
    teacherFeedback: 'Trình bày khoa học, phần so sánh màng đơn và màng kép rất tốt.'
  },
  {
    id: 'sub-03',
    taskId: 'task-101',
    taskTitle: 'Nhiệm vụ 01 – Hoạt động khám phá: Cấu trúc & Chức năng Tế bào Nhân thực',
    studentName: 'Lê Hoàng Nam',
    classId: '10A',
    fileName: 'SoDoTuDuy_LeHoangNam_10A.pptx',
    fileType: 'powerpoint',
    fileSize: '3.4 MB',
    submittedAt: '2026-09-21T15:20',
    status: 'submitted',
    score: undefined,
    teacherFeedback: ''
  },
  {
    id: 'sub-04',
    taskId: 'task-101',
    taskTitle: 'Nhiệm vụ 01 – Hoạt động khám phá: Cấu trúc & Chức năng Tế bào Nhân thực',
    studentName: 'Phạm Minh Đức',
    classId: '10B',
    fileName: 'MinhDuc_10B_AnhBaiTap.jpg',
    fileType: 'image',
    fileSize: '2.1 MB',
    submittedAt: '2026-09-21T16:12',
    status: 'submitted',
    score: undefined,
    teacherFeedback: ''
  },
  {
    id: 'sub-05',
    taskId: 'task-102',
    taskTitle: 'Nhiệm vụ 02 – Phiếu học tập số 2: Cơ chế Quang hợp & Hô hấp ở Thực vật',
    studentName: 'Đỗ Thảo Linh',
    classId: '11A',
    fileName: 'DoThaoLinh_11A_PhieuHocTap2.pdf',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    submittedAt: '2026-09-21T17:45',
    status: 'reviewed',
    score: 10,
    teacherFeedback: 'Xuất sắc! Lập luận quang phân li nước và chu trình Calvin rất chính xác.'
  },
  {
    id: 'sub-06',
    taskId: 'task-103',
    taskTitle: 'Nhiệm vụ 03 – Tổng hợp chuyên đề: Quy luật Di truyền & Đột biến Gen',
    studentName: 'Vũ Quốc Huy',
    classId: '12A',
    fileName: 'VuQuocHuy_12A_ChuyenDeDiTruyen.pdf',
    fileType: 'pdf',
    fileSize: '2.9 MB',
    submittedAt: '2026-09-21T19:30',
    status: 'reviewed',
    score: 9.5,
    teacherFeedback: 'Biện luận quy luật tương tác bổ sung chuẩn xác, sơ đồ lai rõ ràng.'
  },
  {
    id: 'sub-07',
    taskId: 'task-103',
    taskTitle: 'Nhiệm vụ 03 – Tổng hợp chuyên đề: Quy luật Di truyền & Đột biến Gen',
    studentName: 'Hoàng Kim Ngân',
    classId: '12A',
    fileName: 'HoangKimNgan_12A_BaiTap.docx',
    fileType: 'word',
    fileSize: '1.1 MB',
    submittedAt: '2026-09-21T20:10',
    status: 'submitted',
    score: undefined,
    teacherFeedback: ''
  }
];

export const INITIAL_GAMES: QuizGame[] = [
  {
    id: 'game-201',
    title: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    subject: 'Sinh học',
    grade: '10',
    targetClasses: ['10A', '10B'],
    topic: 'Cấu trúc tế bào nhân thực & màng sinh chất',
    description: 'Trò chơi củng cố kiến thức cuối tiết học giúp học sinh khắc sâu cấu trúc bào quan và màng sinh chất.',
    timeLimitPerQuestion: 25,
    totalPoints: 100,
    createdAt: '2026-09-21T10:00',
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'Bào quan nào sau đây được ví như "nhà máy sản xuất năng lượng ATP" của tế bào?',
        points: 20,
        options: [
          'A. Ti thể',
          'B. Ribosome',
          'C. Bộ máy Golgi',
          'D. Không bào'
        ],
        correctAnswer: 'A. Ti thể',
        explanation: 'Ti thể có màng kép với màng trong gấp nếp chứa chuỗi truyền electron hô hấp và enzym tổng hợp ATP.'
      },
      {
        id: 'q2',
        type: 'true_false',
        prompt: 'Ở tế bào thực vật, lục lạp là bào quan thực hiện chức năng quang hợp chuyển hóa quang năng thành hóa năng.',
        points: 20,
        correctBoolean: true,
        explanation: 'Đúng! Lục lạp chứa diệp lục hấp thu ánh sáng mặt trời để tổng hợp chất hữu cơ.'
      },
      {
        id: 'q3',
        type: 'drag_fill',
        prompt: 'Màng sinh chất được cấu tạo chủ yếu từ lớp kép [blank] và các phân tử protein khảm xen kẽ.',
        points: 20,
        fillChoices: ['phospholipid', 'peptidoglycan', 'cellulose', 'chitin'],
        correctFill: 'phospholipid',
        explanation: 'Mô hình khảm động của Singer và Nicolson xác định màng gồm khung phospholipid kép và protein.'
      },
      {
        id: 'q4',
        type: 'matching',
        prompt: 'Hãy ghép đúng mỗi bào quan với chức năng tương ứng:',
        points: 20,
        matchingPairs: [
          { left: 'Ribosome', right: 'Tổng hợp chuỗi polypeptide (protein)' },
          { left: 'Lưới nội chất hạt', right: 'Gắn ribosome, vận chuyển protein' },
          { left: 'Bộ máy Golgi', right: 'Chế biến, đóng gói và phân phối sản phẩm' }
        ],
        explanation: 'Ribosome dịch mã; Lưới nội chất hạt vận chuyển; Golgi hoàn thiện đóng gói xuất bào.'
      },
      {
        id: 'q5',
        type: 'sequencing',
        prompt: 'Sắp xếp đúng thứ tự các bước trong con đường chế biến và bài tiết protein xuất bào:',
        points: 20,
        sequenceSteps: [
          '1. Tổng hợp chuỗi polypeptide trên Ribosome',
          '2. Đi vào xoang lưới nội chất hạt để cuộn gập tạo hình',
          '3. Đóng gói trong túi tiết di chuyển đến bộ máy Golgi',
          '4. Dung hợp với màng sinh chất xuất protein ra ngoài'
        ],
        explanation: 'Quy trình xuất bào tuân thủ tuần tự từ ribosome -> lưới nội chất -> Golgi -> màng ngoài.'
      }
    ]
  },
  {
    id: 'game-202',
    title: 'Thử Thách Khởi Động: Chuyên Đề Di Truyền & Biến Dị THPT',
    subject: 'Sinh học',
    grade: '12',
    targetClasses: ['12A', '12B'],
    topic: 'Quy luật Men-đen & Đột biến cấu trúc nhiễm sắc thể',
    description: 'Trò chơi rèn phản xạ nhanh dành cho học sinh lớp 12 chuẩn bị cho kỳ kiểm tra định kỳ.',
    timeLimitPerQuestion: 30,
    totalPoints: 100,
    createdAt: '2026-09-20T16:00',
    status: 'active',
    questions: [
      {
        id: 'g2-q1',
        type: 'multiple_choice',
        prompt: 'Phép lai P: AaBb x AaBb (các gen phân li độc lập) tạo ra ở F1 tỉ lệ kiểu hình 9 : 3 : 3 : 1 khi các alen trội là trội hoàn toàn. Số loại kiểu gen ở F1 là bao nhiêu?',
        points: 25,
        options: [
          'A. 4 loại',
          'B. 8 loại',
          'C. 9 loại',
          'D. 16 loại'
        ],
        correctAnswer: 'C. 9 loại',
        explanation: 'Lai Aa x Aa ra 3 KG (1AA:2Aa:1aa); Bb x Bb ra 3 KG. Số loại KG F1 = 3 x 3 = 9 loại.'
      },
      {
        id: 'g2-q2',
        type: 'true_false',
        prompt: 'Đột biến đảo đoạn NST làm thay đổi nhóm gen liên kết nhưng không làm thay đổi số lượng gen trên NST.',
        points: 25,
        correctBoolean: true,
        explanation: 'Đúng! Đảo đoạn chỉ làm thay đổi trật tự sắp xếp của các gen trong một NST.'
      },
      {
        id: 'g2-q3',
        type: 'short_answer',
        prompt: 'Mã di truyền mở đầu cho quá trình dịch mã ở sinh vật nhân thực mã hóa cho axit amin nào (viết tắt tiếng Anh 3 chữ cái, ví dụ: Met)?',
        points: 25,
        acceptedAnswers: ['Met', 'Methionine', 'methionine', 'MET'],
        explanation: 'Bộ ba 5\'AUG3\' mã hóa cho Methionine (viết tắt Met).'
      },
      {
        id: 'g2-q4',
        type: 'multiple_choice',
        prompt: 'Dạng đột biến gen nào sau đây ít gây hậu quả nghiêm trọng nhất lên cấu trúc chuỗi polypeptide?',
        points: 25,
        options: [
          'A. Thay thế một cặp nuclêôtit cùng loại',
          'B. Mất một cặp nuclêôtit ở đầu gen',
          'C. Thêm một cặp nuclêôtit ở giữa gen',
          'D. Mất hai cặp nuclêôtit liên tiếp'
        ],
        correctAnswer: 'A. Thay thế một cặp nuclêôtit cùng loại',
        explanation: 'Thay thế 1 cặp nucleotit chỉ làm biến đổi tối đa 1 axit amin hoặc đột biến đồng nghĩa (không đổi axit amin).'
      }
    ]
  }
];

export const INITIAL_GAME_RESULTS: GameResult[] = [
  {
    id: 'res-01',
    gameId: 'game-201',
    gameTitle: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    studentName: 'Trần Thị Bích',
    classId: '10A',
    score: 100,
    totalScore: 100,
    correctAnswersCount: 5,
    totalQuestionsCount: 5,
    accuracyRate: 100,
    durationSeconds: 48,
    completedAt: '2026-09-21T11:15'
  },
  {
    id: 'res-02',
    gameId: 'game-201',
    gameTitle: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    studentName: 'Nguyễn Văn An',
    classId: '10A',
    score: 100,
    totalScore: 100,
    correctAnswersCount: 5,
    totalQuestionsCount: 5,
    accuracyRate: 100,
    durationSeconds: 54,
    completedAt: '2026-09-21T11:16'
  },
  {
    id: 'res-03',
    gameId: 'game-201',
    gameTitle: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    studentName: 'Lê Hoàng Nam',
    classId: '10A',
    score: 80,
    totalScore: 100,
    correctAnswersCount: 4,
    totalQuestionsCount: 5,
    accuracyRate: 80,
    durationSeconds: 62,
    completedAt: '2026-09-21T11:18'
  },
  {
    id: 'res-04',
    gameId: 'game-201',
    gameTitle: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    studentName: 'Phạm Minh Đức',
    classId: '10B',
    score: 80,
    totalScore: 100,
    correctAnswersCount: 4,
    totalQuestionsCount: 5,
    accuracyRate: 80,
    durationSeconds: 69,
    completedAt: '2026-09-21T11:20'
  },
  {
    id: 'res-05',
    gameId: 'game-201',
    gameTitle: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    studentName: 'Vũ Thùy Dương',
    classId: '10A',
    score: 80,
    totalScore: 100,
    correctAnswersCount: 4,
    totalQuestionsCount: 5,
    accuracyRate: 80,
    durationSeconds: 74,
    completedAt: '2026-09-21T11:22'
  },
  {
    id: 'res-06',
    gameId: 'game-201',
    gameTitle: 'Đấu Trí Sinh Học 10: Ôn Tập Nhanh – Cấu Trúc Tế Bào',
    studentName: 'Bùi Gia Huy',
    classId: '10B',
    score: 60,
    totalScore: 100,
    correctAnswersCount: 3,
    totalQuestionsCount: 5,
    accuracyRate: 60,
    durationSeconds: 85,
    completedAt: '2026-09-21T11:24'
  },
  {
    id: 'res-07',
    gameId: 'game-202',
    gameTitle: 'Thử Thách Khởi Động: Chuyên Đề Di Truyền & Biến Dị THPT',
    studentName: 'Vũ Quốc Huy',
    classId: '12A',
    score: 100,
    totalScore: 100,
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
    accuracyRate: 100,
    durationSeconds: 45,
    completedAt: '2026-09-21T16:30'
  },
  {
    id: 'res-08',
    gameId: 'game-202',
    gameTitle: 'Thử Thách Khởi Động: Chuyên Đề Di Truyền & Biến Dị THPT',
    studentName: 'Hoàng Kim Ngân',
    classId: '12A',
    score: 100,
    totalScore: 100,
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
    accuracyRate: 100,
    durationSeconds: 52,
    completedAt: '2026-09-21T16:31'
  },
  {
    id: 'res-09',
    gameId: 'game-202',
    gameTitle: 'Thử Thách Khởi Động: Chuyên Đề Di Truyền & Biến Dị THPT',
    studentName: 'Đặng Mai Phương',
    classId: '12B',
    score: 75,
    totalScore: 100,
    correctAnswersCount: 3,
    totalQuestionsCount: 4,
    accuracyRate: 75,
    durationSeconds: 60,
    completedAt: '2026-09-21T16:34'
  }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif-1',
    type: 'submission',
    title: 'Bài nộp mới từ học sinh',
    message: 'Học sinh Nguyễn Văn An (Lớp 10A) vừa nộp bài cho "Nhiệm vụ 01 – Hoạt động khám phá"',
    timestamp: '2026-09-21T14:05',
    classId: '10A',
    taskId: 'task-101',
    read: false
  },
  {
    id: 'notif-2',
    type: 'game_complete',
    title: 'Học sinh hoàn thành trò chơi',
    message: 'Trần Thị Bích (Lớp 10A) đạt điểm tuyệt đối 100/100 trò chơi "Đấu Trí Sinh Học 10"!',
    timestamp: '2026-09-21T11:15',
    classId: '10A',
    gameId: 'game-201',
    read: false
  },
  {
    id: 'notif-3',
    type: 'submission',
    title: 'Bài nộp mới từ học sinh',
    message: 'Đỗ Thảo Linh (Lớp 11A) vừa nộp bài cho "Nhiệm vụ 02 – Phiếu học tập số 2"',
    timestamp: '2026-09-21T17:45',
    classId: '11A',
    taskId: 'task-102',
    read: true
  },
  {
    id: 'notif-4',
    type: 'task_created',
    title: 'Nhiệm vụ đã sẵn sàng',
    message: 'Nhiệm vụ "Tổng hợp chuyên đề: Quy luật Di truyền" đã tạo link & mã QR cho Lớp 12A, 12B',
    timestamp: '2026-09-19T14:15',
    taskId: 'task-103',
    read: true
  }
];
