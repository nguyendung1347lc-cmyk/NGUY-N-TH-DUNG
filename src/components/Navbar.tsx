import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  Smartphone, 
  UserCheck, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ActivityNotification } from '../types';

interface NavbarProps {
  currentView: 'teacher' | 'student';
  onToggleView: (view: 'teacher' | 'student') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: ActivityNotification[];
  onMarkNotificationsRead: () => void;
  onResetData: () => void;
  onOpenNotificationTarget?: (notif: ActivityNotification) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onToggleView,
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationsRead,
  onResetData,
  onOpenNotificationTarget
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Teacher info */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                LỚP HỌC SỐ
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                THPT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Cô giáo Nguyễn Thị Dung • Giao nhiệm vụ & Tương tác
            </p>
          </div>
        </div>

        {/* Global Search (Teacher mode) */}
        {currentView === 'teacher' && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm học sinh, nhiệm vụ, bài nộp, lớp (10A-12B)..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Perspective Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onToggleView('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chế độ quản lý dành cho Cô Dung"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Giáo viên</span>
            </button>
            <button
              onClick={() => onToggleView('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Góc nhìn Học sinh (Không cần đăng nhập)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Góc nhìn Học sinh</span>
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-amber-950 rounded font-black">
                QR
              </span>
            </button>
          </div>

          {/* Notifications Dropdown (Teacher mode) */}
          {currentView === 'teacher' && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu && unreadCount > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
                title="Thông báo hoạt động"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-semibold text-slate-900 text-sm">Hoạt động mới của lớp</h3>
                    </div>
                    <span className="text-xs text-slate-500">{notifications.length} thông báo</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">Chưa có thông báo mới</p>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setShowNotifMenu(false);
                            if (onOpenNotificationTarget) onOpenNotificationTarget(notif);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer ${
                            !notif.read ? 'bg-indigo-50/50 font-medium' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-800">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(notif.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-snug">{notif.message}</p>
                          {notif.classId && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-700">
                              Lớp {notif.classId}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Đặt lại dữ liệu mẫu về mặc định cho các lớp 10A - 12B?')) {
                onResetData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Khôi phục dữ liệu mẫu ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
