import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Search, Check, X, Shield, User } from 'lucide-react';
import { doc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore'; 
import { initializeApp, getApps, getApp } from 'firebase/app';

// --- CẤU HÌNH CHO MÔI TRƯỜNG PREVIEW (WEB) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CẤU HÌNH CHO MÁY LOCAL CỦA BẠN ---
// Khi copy về VS Code, hãy:
// 1. XÓA đoạn "CẤU HÌNH CHO MÔI TRƯỜNG PREVIEW" ở trên.
// 2. BỎ CHÚ THÍCH (Uncomment) dòng import dưới đây:
// import { db } from '../firebase';
// ----------------------------------------

const UserManagement = ({ users }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null); 
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        member: false
    });

    const filteredUsers = useMemo(() => {
      return users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [users, searchTerm]);
  
    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng "${name}"?`)) {
            try {
                await deleteDoc(doc(db, "users", email)); 
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Xóa thất bại: " + error.message);
            }
        }
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'user',
            member: user.member || false
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'member') {
            setEditFormData(prev => ({ ...prev, member: value === 'true' }));
        } else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const saveEdit = async (id) => {
        try {
            const userRef = doc(db, "users", id);
            await updateDoc(userRef, {
                name: editFormData.name,
                email: editFormData.email,
                role: editFormData.role,
                member: editFormData.member
            });
            setEditingId(null);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại: " + error.message);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-end">
            <h1 className="text-3xl font-extrabold text-gray-900">Quản Lý Người Dùng</h1>
        </div>
        
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
  
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg mt-6 border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên Hiển Thị</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò (Role)</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Hội viên</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {editingId === user.id ? (
                        <input type="text" name="name" value={editFormData.name} onChange={handleFormChange} className="w-full border border-indigo-300 rounded p-1 focus:ring-2 ring-indigo-500 outline-none" />
                    ) : (
                        <div className="flex items-center"><div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3"><User size={16} /></div>{user.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {editingId === user.id ? (
                        <input type="text" name="email" value={editFormData.email} onChange={handleFormChange} className="w-full border border-indigo-300 rounded p-1 focus:ring-2 ring-indigo-500 outline-none" />
                    ) : ( user.email )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user.id ? (
                        <select name="role" value={editFormData.role} onChange={handleFormChange} className="p-1 border border-indigo-300 rounded text-sm focus:ring-indigo-500 bg-white">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    ) : (
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role === 'admin' && <Shield size={12} className="mr-1"/>}{user.role || 'user'}
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingId === user.id ? (
                        <select name="member" value={editFormData.member} onChange={handleFormChange} className="p-1 border border-indigo-300 rounded text-sm focus:ring-indigo-500 bg-white">
                            <option value="true">Là Hội viên</option>
                            <option value="false">Thường</option>
                        </select>
                    ) : (
                        user.member ? <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600"><Check size={20} strokeWidth={3} /></span> : <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-50 text-red-400"><X size={20} /></span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === user.id ? (
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => saveEdit(user.id)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><Check size={18} /></button>
                            <button onClick={cancelEdit} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"><X size={18} /></button>
                        </div>
                    ) : (
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => startEdit(user)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition duration-150"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-150"><Trash2 size={18} /></button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
export default UserManagement;