import React from 'react';
import { 
    LayoutDashboard, BookOpen, Users, Settings,
    LogOut 
} from 'lucide-react';
import { signOut } from 'firebase/auth';

// Lấy auth từ file cấu hình Firebase của bạn
import { auth } from '../firebase';

const Sidebar = ({ activePage, setActivePage }) => {

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'courses', label: 'Quản Lý Khóa Học', icon: BookOpen },
    { id: 'users', label: 'Quản Lý Người Dùng', icon: Users },
    { id: 'ai-settings', label: 'Cấu Hình AI', icon: Settings },
  ];

  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
      }
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-64 bg-gray-900 text-white p-4 shadow-2xl fixed h-full z-10">
      
      <div className="flex items-center justify-center h-20 border-b border-gray-800 mb-6">
        <div className="text-center">
          <span className="block text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            ADMIN AI
          </span>
          <span className="text-xs text-gray-500 tracking-widest uppercase">Course Manager</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center w-full p-3 rounded-xl transition duration-200 group ${
              activePage === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon 
              size={20} 
              className={`mr-3 ${activePage === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} 
            />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Đăng Xuất</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
