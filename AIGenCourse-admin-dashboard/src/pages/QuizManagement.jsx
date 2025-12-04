// // src/pages/QuizManagement.jsx
// import React, { useState, useMemo } from 'react';
// import { Plus, Edit, Trash2, Search, ClipboardList, X } from 'lucide-react';
// // 1. Import Firestore
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';

// // Component Modal Xác Nhận (Tái sử dụng)
// const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-[60]">
//       <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4">
//         <div className="flex justify-between items-start">
//             <h3 className="text-xl font-bold text-red-700">{title}</h3>
//             <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
//                 <X size={20} />
//             </button>
//         </div>
//         <p className="text-gray-600">{message}</p>
//         <div className="flex justify-end space-x-3 pt-4 border-t">
//           <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150">Hủy</button>
//           <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150">Xác Nhận</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const QuizManagement = ({ quizzes }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//     const [quizToDelete, setQuizToDelete] = useState(null);
    
//     const filteredQuizzes = useMemo(() => {
//         return quizzes.filter(quiz =>
//           quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }, [quizzes, searchTerm]);

//     // Hàm mở modal xác nhận xóa
//     const initiateDelete = (quiz) => {
//         setQuizToDelete(quiz);
//         setIsConfirmModalOpen(true);
//     };

//     // 2. Logic XÓA Quiz khỏi mảng trong Firestore
//     const handleConfirmDelete = async () => {
//         if (!quizToDelete) return;

//         try {
//             // ID của quiz trong App.jsx được tạo theo format: `${courseId}_quiz_${index}`
//             // Chúng ta cần tách chuỗi này ra để lấy courseId và vị trí (index) của quiz
//             const parts = quizToDelete.id.split('_quiz_');
//             const courseId = parts[0];
//             const quizIndex = parseInt(parts[1], 10);

//             if (!courseId || isNaN(quizIndex)) {
//                 throw new Error("Không thể xác định ID khóa học gốc.");
//             }

//             const courseRef = doc(db, "courses", courseId);
//             const courseSnap = await getDoc(courseRef);

//             if (courseSnap.exists()) {
//                 const courseData = courseSnap.data();
//                 const currentQuizzes = courseData.quiz || [];

//                 // Tạo mảng mới bằng cách loại bỏ phần tử tại index cần xóa
//                 // Lưu ý: Cách này dựa vào index, nếu dữ liệu realtime thay đổi nhanh có thể bị lệch,
//                 // nhưng với Admin Dashboard đơn giản thì chấp nhận được.
//                 const newQuizzes = currentQuizzes.filter((_, index) => index !== quizIndex);

//                 // Cập nhật lại mảng quiz vào Firestore
//                 await updateDoc(courseRef, {
//                     quiz: newQuizzes
//                 });

//                 alert("Đã xóa câu hỏi thành công!");
//             } else {
//                 alert("Không tìm thấy khóa học gốc.");
//             }

//         } catch (error) {
//             console.error("Lỗi xóa quiz:", error);
//             alert("Xóa thất bại: " + error.message);
//         } finally {
//             setIsConfirmModalOpen(false);
//             setQuizToDelete(null);
//         }
//     };

//     const handleEdit = (quiz) => {
//         // Chức năng sửa chi tiết mảng lồng nhau khá phức tạp
//         // Cần modal form riêng, tạm thời thông báo
//         alert(`Tính năng chỉnh sửa Quiz ID: ${quiz.id} đang phát triển. Bạn cần sửa trực tiếp trong Khóa học.`);
//     };

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
//                 <ClipboardList className="mr-3 text-yellow-600" size={30} />
//                 Quản Lý Quiz (Bài Kiểm Tra)
//             </h1>
            
//             <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//                 <div className="relative w-full md:w-80">
//                     <input
//                         type="text"
//                         placeholder="Tìm kiếm theo tiêu đề Quiz hoặc Khóa học..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                     />
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
                
//                 <button
//                     onClick={() => alert("Để thêm Quiz, vui lòng vào phần 'Quản Lý Khóa Học' -> Chỉnh sửa khóa học tương ứng.")}
//                     className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
//                 >
//                     <Plus size={20} className="mr-2" />
//                     Tạo Quiz Mới
//                 </button>
//             </div>

//             <div className="overflow-x-auto bg-white rounded-xl shadow-lg mt-6">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Câu hỏi</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thuộc Khóa học</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đáp án đúng</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredQuizzes.map((quiz) => (
//                             <tr key={quiz.id} className="hover:bg-gray-50 transition duration-150">
//                                 <td className="px-6 py-4 text-sm text-gray-900 font-semibold max-w-xs truncate" title={quiz.title}>
//                                     {quiz.title}
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{quiz.courseTitle}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-bold">{quiz.correctAns}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                         quiz.status === 'Published' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
//                                     }`}>
//                                         {quiz.status}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                     <button 
//                                         onClick={() => handleEdit(quiz)}
//                                         className="text-indigo-600 hover:text-indigo-900 mr-4 p-1 rounded-full hover:bg-indigo-50 transition duration-150"
//                                         title="Chỉnh Sửa"
//                                     >
//                                         <Edit size={18} />
//                                     </button>
//                                     <button 
//                                         onClick={() => initiateDelete(quiz)}
//                                         className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150"
//                                         title="Xóa"
//                                     >
//                                         <Trash2 size={18} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <ConfirmationModal 
//                 isOpen={isConfirmModalOpen}
//                 title="Xác nhận Xóa Quiz"
//                 message="Bạn có chắc chắn muốn xóa câu hỏi này khỏi khóa học không? Hành động này sẽ cập nhật dữ liệu khóa học gốc."
//                 onConfirm={handleConfirmDelete}
//                 onCancel={() => setIsConfirmModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default QuizManagement;