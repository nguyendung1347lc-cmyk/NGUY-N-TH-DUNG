import React from 'react';
import { 
  LayoutDashboard, 
  School, 
  FileEdit, 
  FolderDown, 
  Gamepad2, 
  Trophy, 
  BarChart3, 
  Bell, 
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingSubmissionsCount: number;
  totalActiveTasks: number;
  totalGames: number;
  onOpenCreateTaskModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingSubmissionsCount,
  totalActiveTasks,
  totalGames,
  onOpenCreateTaskModal
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'classes' as ActiveTab,
      label: 'Lớp học (6 lớp)',
      icon: School,
      badge: '10-12'
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Nhiệm vụ học tập',
      icon: FileEdit,
      badge: totalActiveTasks > 0 ? `${totalActiveTasks} mở` : null
    },
    {
      id: 'submissions' as ActiveTab,
      label: 'Kho bài nộp',
      icon: FolderDown,
      badge: pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} mới` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold'
    },
    {
      id: 'games' as ActiveTab,
      label: 'Trò chơi củng cố',
      icon: Gamepad2,
      badge: totalGames > 0 ? `${totalGames}` : null
    },
    {
      id: 'results' as ActiveTab,
      label: 'Kết quả & TOP 5',
      icon: Trophy,
      badge: 'Vinh danh',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'statistics' as ActiveTab,
      label: 'Thống kê học tập',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'notifications' as ActiveTab,
      label: 'Hoạt động mới',
      icon: Bell,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 hidden lg:flex">
      <div className="space-y-6">
        {/* Quick Teacher CTA */}
        <div>
          <button
            onClick={onOpenCreateTaskModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-semibold shadow-sm shadow-indigo-200 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Tạo Nhiệm Vụ Mới</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Menu Quản Lý
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      item.badgeColor || (isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Classroom Quick Motto / Pedagogical Note */}
      <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/80 rounded-2xl">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nguyên Tắc Lớp Học Số</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Học sinh quét mã QR / mở Link → Nhập Tên + Lớp → Làm bài ngay. Tuyệt đối không cần đăng nhập Google hay nhớ mật khẩu.
        </p>
      </div>
    </aside>
  );
};
