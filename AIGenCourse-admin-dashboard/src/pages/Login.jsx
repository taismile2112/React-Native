import React, { useState } from 'react';
// 1. Import thêm setPersistence và browserSessionPersistence
import { 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Đường dẫn import từ máy local của bạn
import { Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Loại bỏ khoảng trắng thừa ở đầu/cuối email để tránh lỗi nhập liệu
    const cleanEmail = email.trim();

    try {
      // 2. THIẾT LẬP CHẾ ĐỘ LƯU TRỮ TRƯỚC KHI ĐĂNG NHẬP
      // browserSessionPersistence: Chỉ lưu phiên đăng nhập trong Tab hiện tại. 
      // Đóng tab hoặc tắt trình duyệt sẽ tự động đăng xuất.
      await setPersistence(auth, browserSessionPersistence);

      // 3. Tiến hành đăng nhập như bình thường
      // Sử dụng cleanEmail thay vì email gốc
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 4. Kiểm tra quyền Admin
      const docRef = doc(db, 'users', user.email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await signOut(auth);
        throw new Error('no-data');
      }

      const userData = docSnap.data();
      if (userData.role !== 'admin') {
        await signOut(auth);
        throw new Error('not-admin');
      }

      // Đăng nhập thành công -> App.jsx tự chuyển trang
    } catch (err) {
      console.error(err);
      let msg = 'Đăng nhập thất bại.';
      
      if (err.message === 'not-admin') msg = 'Bạn không có quyền truy cập Admin.';
      if (err.message === 'no-data') msg = 'Dữ liệu tài khoản không tồn tại.';
      
      // Các lỗi từ Firebase
      if (err.code === 'auth/invalid-email') msg = 'Email không hợp lệ.';
      if (err.code === 'auth/user-not-found') msg = 'Không tìm thấy tài khoản.';
      if (err.code === 'auth/wrong-password') msg = 'Sai mật khẩu.';
      
      // Đây là lỗi bạn đang gặp phải:
      if (err.code === 'auth/invalid-credential') msg = 'Email hoặc mật khẩu không chính xác (hoặc tài khoản chưa được tạo).';
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
        <div className="bg-white p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-gray-500">Đăng nhập hệ thống (Session Mode)</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center text-red-700 rounded-r">
                <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Email quản trị viên"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;