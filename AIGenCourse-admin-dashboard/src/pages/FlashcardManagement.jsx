// // src/pages/FlashcardManagement.jsx
// import React, { useState, useMemo } from 'react';
// import { Plus, Edit, Trash2, Search, Flashlight, X } from 'lucide-react';
// // 1. Import Firestore
// import { doc, updateDoc } from 'firebase/firestore';
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

// const FlashcardManagement = ({ flashcards }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//     const [cardSetToDelete, setCardSetToDelete] = useState(null);
    
//     const filteredFlashcards = useMemo(() => {
//         return flashcards.filter(card =>
//           card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           card.topic.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }, [flashcards, searchTerm]);

//     // Mở modal xóa
//     const initiateDelete = (cardSet) => {
//         setCardSetToDelete(cardSet);
//         setIsConfirmModalOpen(true);
//     };

//     // 2. Logic XÓA Bộ thẻ (Làm rỗng mảng flashcards trong Course)
//     const handleConfirmDelete = async () => {
//         if (!cardSetToDelete) return;

//         try {
//             // cardSet.courseId đã được map sẵn từ App.jsx
//             const courseRef = doc(db, "courses", cardSetToDelete.courseId);

//             // Cập nhật trường flashcards thành mảng rỗng []
//             await updateDoc(courseRef, {
//                 flashcards: [] 
//             });

//             alert("Đã xóa bộ thẻ thành công!");
//         } catch (error) {
//             console.error("Lỗi xóa bộ thẻ:", error);
//             alert("Xóa thất bại: " + error.message);
//         } finally {
//             setIsConfirmModalOpen(false);
//             setCardSetToDelete(null);
//         }
//     };

//     const handleEdit = (card) => {
//         alert(`Tính năng sửa chi tiết từng thẻ đang phát triển. Vui lòng sửa trong phần 'Quản Lý Khóa Học'.`);
//     };

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
//                 <Flashlight className="mr-3 text-yellow-600" size={30} />
//                 Quản Lý Flashcard (Thẻ Ghi Nhớ)
//             </h1>
            
//             <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//                 <div className="relative w-full md:w-80">
//                     <input
//                         type="text"
//                         placeholder="Tìm kiếm theo tiêu đề hoặc chủ đề..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                     />
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
                
//                 <button
//                     onClick={() => alert("Vui lòng tạo Flashcard thông qua tính năng tạo Khóa học AI hoặc chỉnh sửa Khóa học.")}
//                     className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
//                 >
//                     <Plus size={20} className="mr-2" />
//                     Tạo Bộ Flashcard Mới
//                 </button>
//             </div>

//             <div className="overflow-x-auto bg-white rounded-xl shadow-lg mt-6">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề Bộ thẻ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ đề</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số thẻ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredFlashcards.map((card) => (
//                             <tr key={card.id} className="hover:bg-gray-50 transition duration-150">
//                                 <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{card.title}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-600">{card.topic}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-600">{card.courseTitle}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{card.num_cards}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                     <button 
//                                         onClick={() => handleEdit(card)}
//                                         className="text-indigo-600 hover:text-indigo-900 mr-4 p-1 rounded-full hover:bg-indigo-50 transition duration-150"
//                                         title="Chỉnh Sửa"
//                                     >
//                                         <Edit size={18} />
//                                     </button>
//                                     <button 
//                                         onClick={() => initiateDelete(card)}
//                                         className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150"
//                                         title="Xóa Bộ Thẻ"
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
//                 title="Xác nhận Xóa Bộ thẻ"
//                 message="Bạn có chắc chắn muốn xóa toàn bộ Flashcard của khóa học này không? Hành động này không thể hoàn tác."
//                 onConfirm={handleConfirmDelete}
//                 onCancel={() => setIsConfirmModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default FlashcardManagement;