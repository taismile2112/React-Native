// // src/pages/QnAManagement.jsx
// import React, { useState, useMemo } from 'react';
// import { Search, HelpCircle, Trash2, X, MessageCircle } from 'lucide-react';
// // 1. Import Firestore
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';

// // Component Modal Xác Nhận
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

// const QnAManagement = ({ qna }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);
    
//     const filteredQnA = useMemo(() => {
//         return qna.filter(item =>
//           item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }, [qna, searchTerm]);

//     // Mở modal xác nhận xóa
//     const initiateDelete = (item) => {
//         setItemToDelete(item);
//         setIsConfirmModalOpen(true);
//     };

//     // 2. Logic XÓA Q&A khỏi mảng trong Firestore
//     const handleConfirmDelete = async () => {
//         if (!itemToDelete) return;

//         try {
//             // ID format: `${courseId}_qa_${index}`
//             const parts = itemToDelete.id.split('_qa_');
//             const courseId = parts[0];
//             const qaIndex = parseInt(parts[1], 10);

//             if (!courseId || isNaN(qaIndex)) {
//                 throw new Error("Không thể xác định ID dữ liệu.");
//             }

//             const courseRef = doc(db, "courses", courseId);
//             const courseSnap = await getDoc(courseRef);

//             if (courseSnap.exists()) {
//                 const courseData = courseSnap.data();
//                 const currentQA = courseData.qa || [];

//                 // Tạo mảng mới loại bỏ phần tử tại qaIndex
//                 const newQA = currentQA.filter((_, index) => index !== qaIndex);

//                 // Cập nhật lại Firestore
//                 await updateDoc(courseRef, {
//                     qa: newQA
//                 });

//                 alert("Đã xóa câu hỏi/trả lời thành công!");
//             } else {
//                 alert("Không tìm thấy khóa học gốc.");
//             }
//         } catch (error) {
//             console.error("Lỗi xóa Q&A:", error);
//             alert("Xóa thất bại: " + error.message);
//         } finally {
//             setIsConfirmModalOpen(false);
//             setItemToDelete(null);
//         }
//     };

//     const handleViewAnswer = (item) => {
//         // Có thể mở rộng thành modal xem chi tiết sau này
//         alert(`Câu trả lời chi tiết:\n\n${item.answer || "Chưa có câu trả lời"}`);
//     };

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
//                 <HelpCircle className="mr-3 text-red-600" size={30} />
//                 Quản Lý Hỏi Đáp (Q&A)
//             </h1>
//             <p className="text-gray-600">Duyệt các câu hỏi và câu trả lời trong các khóa học.</p>
            
//             <div className="relative w-full md:w-80">
//                 <input
//                     type="text"
//                     placeholder="Tìm kiếm câu hỏi hoặc khóa học..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             </div>

//             <div className="overflow-x-auto bg-white rounded-xl shadow-lg mt-6">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Câu hỏi</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người hỏi</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredQnA.map((item) => (
//                             <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
//                                 <td className="px-6 py-4 text-sm text-gray-900 font-semibold max-w-xs truncate" title={item.question}>
//                                     {item.question}
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.courseTitle}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.asked_by}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                         item.status === 'Pending Review' || item.status === 'Pending' ? 'bg-red-100 text-red-800' : 
//                                         'bg-green-100 text-green-800'
//                                     }`}>
//                                         {item.status === 'Resolved' ? 'Đã trả lời' : 'Chờ duyệt'}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                     <button 
//                                         onClick={() => handleViewAnswer(item)}
//                                         className="text-green-600 hover:text-green-900 mr-4 p-1 rounded-full hover:bg-green-50 transition duration-150"
//                                         title="Xem câu trả lời"
//                                     >
//                                         <MessageCircle size={18} />
//                                     </button>
//                                     <button 
//                                         onClick={() => initiateDelete(item)}
//                                         className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150"
//                                         title="Xóa Q&A này"
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
//                 title="Xác nhận Xóa Q&A"
//                 message="Bạn có chắc chắn muốn xóa câu hỏi/trả lời này không? Hành động này sẽ cập nhật dữ liệu khóa học gốc."
//                 onConfirm={handleConfirmDelete}
//                 onCancel={() => setIsConfirmModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default QnAManagement;