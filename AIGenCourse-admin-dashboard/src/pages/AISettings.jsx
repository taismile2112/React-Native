// src/pages/AISettings.jsx
import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const AISettings = () => {
    const [model, setModel] = useState('Gemini 2.5 Flash');
    const [template, setTemplate] = useState('Tạo khóa học 5 chương dựa trên chủ đề...');
    const [limit, setLimit] = useState(500);

    const handleSave = () => {
        // Logic lưu cấu hình AI
        alert(`Đã lưu cấu hình AI! Mô hình: ${model}, Giới hạn: ${limit}. (Giả lập)`);
    };

    return (
        <div className="p-6 space-y-8 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Zap className="mr-3 text-red-600" size={30} />
                Cấu Hình Hệ Thống AI
            </h1>
            <p className="text-gray-600">Quản lý mô hình, template prompt và giới hạn sử dụng cho tính năng tạo khóa học AI.</p>
            
            <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100">
                {/* Lựa chọn Mô hình */}
                <div>
                    <label className="block text-lg font-bold text-gray-800 mb-2">Mô hình AI sử dụng</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Tốc độ cao, chi phí tối ưu)</option>
                        <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Nâng cao, chất lượng nội dung tốt nhất)</option>
                    </select>
                </div>

                {/* Template Prompt */}
                <div>
                    <label className="block text-lg font-bold text-gray-800 mb-2">Template Prompt mặc định</label>
                    <textarea
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        rows="5"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 font-mono text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>

                {/* Giới hạn sử dụng */}
                <div>
                    <label className="block text-lg font-bold text-gray-800 mb-2">Giới hạn sử dụng AI (lượt/tháng)</label>
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                    >
                        Lưu Cấu Hình
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AISettings;