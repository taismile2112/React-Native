// src/pages/CourseManagement.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ArrowLeft,
  Book,
  HelpCircle,
  Flashlight,
  Layers,
  MessageCircle,
} from "lucide-react";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// --- HÀM TIỆN ÍCH ---
const formatDate = (dateVal) => {
  if (!dateVal) return "N/A";
  if (typeof dateVal === "object" && dateVal.seconds) {
    return new Date(dateVal.seconds * 1000).toLocaleDateString("vi-VN");
  }
  return typeof dateVal === "string" ? dateVal : "Invalid Date";
};

// --- COMPONENT: MODAL XÁC NHẬN ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <h3 className="text-xl font-bold text-red-700">{title}</h3>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: MODAL EDITOR ---
const ItemEditorModal = ({ isOpen, type, data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({});
  // State riêng cho JSON string để tránh lỗi không gõ được
  const [jsonString, setJsonString] = useState("");
  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setFormData(data);
        // Nếu là chapters, set jsonString từ data
        if (type === "chapters") {
          setJsonString(JSON.stringify(data.content || [], null, 2));
        }
      } else {
        // Reset form
        if (type === "flashcards") setFormData({ front: "", back: "" });
        if (type === "quiz")
          setFormData({
            question: "",
            options: ["", "", "", ""],
            correctAns: "",
          });
        if (type === "qa") setFormData({ question: "", answer: "" });
        if (type === "chapters") {
          setFormData({ chapterName: "", content: [] });
          setJsonString("[]");
        }
      }
      setJsonError(null);
    }
  }, [isOpen, data, type]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || ["", "", "", ""])];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  // Xử lý riêng cho JSON editor
  const handleJsonChange = (e) => {
    const val = e.target.value;
    setJsonString(val);
    try {
      const parsed = JSON.parse(val);
      setFormData((prev) => ({ ...prev, content: parsed }));
      setJsonError(null);
    } catch (err) {
      setJsonError("JSON không hợp lệ: " + err.message);
    }
  };

  const handleSave = () => {
    if (type === "chapters" && jsonError) {
      alert("Vui lòng sửa lỗi JSON trước khi lưu!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-indigo-700 uppercase">
            {data ? `Edit ${type}` : `Add ${type}`}
          </h3>
          <button onClick={onCancel}>
            <X className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {type === "flashcards" && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Front
                </label>
                <input
                  className="w-full border p-2 rounded"
                  name="front"
                  value={formData.front || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Back
                </label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  name="back"
                  value={formData.back || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {type === "quiz" && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Question</label>
                <input
                  className="w-full border p-2 rounded"
                  name="question"
                  value={formData.question || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Options
                </label>
                {(formData.options || ["", "", "", ""]).map((opt, idx) => (
                  <input
                    key={idx}
                    className="w-full border p-2 rounded mb-2"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Correct Answer
                </label>
                <input
                  className="w-full border p-2 rounded"
                  name="correctAns"
                  value={formData.correctAns || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* --- FORM Q&A --- */}
          {type === "qa" && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Question
                </label>
                <input
                  className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                  name="question"
                  value={formData.question || ""}
                  onChange={handleChange}
                  placeholder="Nhập câu hỏi..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Answer
                </label>
                <textarea
                  className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                  rows={4}
                  name="answer"
                  value={formData.answer || ""}
                  onChange={handleChange}
                  placeholder="Nhập câu trả lời..."
                />
              </div>
            </>
          )}

          {type === "chapters" && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Chapter Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  name="chapterName"
                  value={formData.chapterName || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Content (JSON Raw)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Input Validate JSON
                </p>
                <textarea
                  className={`w-full border p-2 rounded font-mono text-sm ${
                    jsonError ? "border-red-500 bg-red-50" : "bg-gray-50"
                  }`}
                  rows={10}
                  value={jsonString}
                  onChange={handleJsonChange}
                />
                {jsonError && (
                  <p className="text-red-500 text-xs mt-1">{jsonError}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const CourseManagement = ({ courses: initialCourses }) => {
  // Rename prop để quản lý state nội bộ
  // Dùng state nội bộ để danh sách cập nhật ngay khi sửa mà không cần fetch lại từ cha
  const [courses, setCourses] = useState(initialCourses);

  // Cập nhật state nội bộ khi prop thay đổi (vd: cha fetch xong)
  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeTab, setActiveTab] = useState("chapters");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descText, setDescText] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorType, setEditorType] = useState("");
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editingItemData, setEditingItemData] = useState(null);

  const categories = useMemo(() => {
    const cats = new Set(
      courses.map((c) => c.category || "Uncategorized").filter(Boolean)
    );
    return ["All", ...Array.from(cats)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        (course.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleDeleteCourse = async () => {
    if (deleteContext?.id) {
      try {
        await deleteDoc(doc(db, "courses", deleteContext.id));
        // Cập nhật state danh sách
        setCourses((prev) => prev.filter((c) => c.docId !== deleteContext.id));
        alert("Đã xóa khóa học!");
        if (selectedCourse?.docId === deleteContext.id) setSelectedCourse(null);
      } catch (e) {
        alert("Lỗi: " + e.message);
      }
    }
    setIsConfirmOpen(false);
  };

  const handleUpdateTitle = async (courseId, newTitle) => {
    const title = prompt("Enter a new name for the course:", newTitle);
    if (title && title !== newTitle) {
      try {
        await updateDoc(doc(db, "courses", courseId), { courseTitle: title });
        // Cập nhật state danh sách ngay lập tức
        setCourses((prev) =>
          prev.map((c) => (c.docId === courseId ? { ...c, title: title } : c))
        );
        if (selectedCourse?.docId === courseId) {
          setSelectedCourse((prev) => ({ ...prev, title: title }));
        }
      } catch (e) {
        alert("Lỗi update title: " + e.message);
      }
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setDescText(course.description || "");
    setEditingDesc(false);
    setActiveTab("chapters");
  };

  const saveDescription = async () => {
    try {
      await updateDoc(doc(db, "courses", selectedCourse.docId), {
        description: descText,
      });
      setEditingDesc(false);
      setSelectedCourse((prev) => ({ ...prev, description: descText }));
      // Cập nhật cả danh sách bên ngoài
      setCourses((prev) =>
        prev.map((c) =>
          c.docId === selectedCourse.docId ? { ...c, description: descText } : c
        )
      );
    } catch (e) {
      alert("Lỗi lưu mô tả: " + e.message);
    }
  };

  const openAddModal = (type) => {
    setEditorType(type);
    setEditingItemIndex(null);
    setEditingItemData(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (type, item, index) => {
    setEditorType(type);
    setEditingItemIndex(index);
    setEditingItemData(item);
    setIsEditorOpen(true);
  };

  const handleEditorSave = async (formData) => {
    if (!selectedCourse) return;

    const courseRef = doc(db, "courses", selectedCourse.docId);
    const snap = await getDoc(courseRef);
    if (!snap.exists()) return;

    const courseData = snap.data();
    let currentArray = courseData[editorType] || [];

    if (editingItemIndex !== null) {
      currentArray[editingItemIndex] = formData;
    } else {
      currentArray.push(formData);
    }

    await updateDoc(courseRef, { [editorType]: currentArray });

    const updatedCourse = { ...selectedCourse, [editorType]: currentArray };
    setSelectedCourse(updatedCourse);

    // Cập nhật list bên ngoài để đồng bộ
    setCourses((prev) =>
      prev.map((c) => (c.docId === selectedCourse.docId ? updatedCourse : c))
    );

    setIsEditorOpen(false);
  };

  const handleDeleteItem = async () => {
    const { id, type, index } = deleteContext;
    const courseRef = doc(db, "courses", id);
    const snap = await getDoc(courseRef);

    if (snap.exists()) {
      const courseData = snap.data();
      let currentArray = courseData[type] || [];
      const newArray = currentArray.filter((_, i) => i !== index);

      await updateDoc(courseRef, { [type]: newArray });

      const updatedCourse = { ...selectedCourse, [type]: newArray };
      setSelectedCourse(updatedCourse);
      setCourses((prev) =>
        prev.map((c) => (c.docId === id ? updatedCourse : c))
      );
    }
    setIsConfirmOpen(false);
  };

  // --- RENDER CHI TIẾT ---
  if (selectedCourse) {
    const currentItems = selectedCourse[activeTab] || [];

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCourse.title}
            </h1>
            <span className="text-sm text-gray-500 bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              {selectedCourse.category || "Uncategorized"}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Created By:</strong>{" "}
              {selectedCourse.creator}
            </p>
            <p>
              <strong className="text-gray-900">Created On:</strong>{" "}
              {formatDate(selectedCourse.createdOn)}
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <strong className="text-gray-900">Description</strong>
              {!editingDesc ? (
                <button
                  onClick={() => setEditingDesc(true)}
                  className="text-indigo-600 hover:underline text-sm flex items-center"
                >
                  <Edit size={14} className="mr-1" /> Edit Description
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingDesc(false)}
                    className="text-gray-500 text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveDescription}
                    className="text-green-600 font-bold text-sm"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>

            {!editingDesc ? (
              <p className="text-gray-700 leading-relaxed">
                {selectedCourse.description}
              </p>
            ) : (
              <textarea
                className="w-full border p-3 rounded-lg focus:ring-2 ring-indigo-500 outline-none"
                rows={4}
                value={descText}
                onChange={(e) => setDescText(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6 w-fit">
          {[
            { id: "chapters", label: "Chapters", icon: Book },
            { id: "quiz", label: "Quiz", icon: HelpCircle },
            { id: "flashcards", label: "Flashcards", icon: Flashlight },
            { id: "qa", label: "Q&A", icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-300"
              }`}
            >
              <tab.icon size={18} className="mr-2" />
              {tab.label} ({selectedCourse[tab.id]?.length || 0})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-700 uppercase">
            {activeTab} Lists
            </h3>
            <button
              onClick={() => openAddModal(activeTab)}
              className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              <Plus size={16} className="mr-2" /> Add New
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {currentItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500 italic">
                Chưa có dữ liệu nào. Hãy thêm mới!
              </div>
            ) : (
              currentItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 flex justify-between items-start group"
                >
                  <div className="flex-1 pr-4">
                    {activeTab === "chapters" && (
                      <div>
                        <p className="font-bold text-gray-900">
                          Chapter {index + 1}: {item.chapterName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.content?.length || 0} Content items
                        </p>
                      </div>
                    )}
                    {activeTab === "quiz" && (
                      <div>
                        <p className="font-medium text-gray-900">
                          <span className="font-bold text-indigo-600">
                            Q{index + 1}:
                          </span>{" "}
                          {item.question}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Correct answer: {item.correctAns}
                        </p>
                      </div>
                    )}
                    {activeTab === "flashcards" && (
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-50 p-2 rounded text-sm w-1/3">
                          <strong>Front:</strong> {item.front}
                        </div>
                        <div className="text-gray-400">➔</div>
                        <div className="bg-green-50 p-2 rounded text-sm w-1/3">
                          <strong>Back:</strong> {item.back}
                        </div>
                      </div>
                    )}
                    {activeTab === "qa" && (
                      <div>
                        <div className="flex items-start mb-2">
                          <span className="font-bold text-indigo-600 mr-2 bg-indigo-50 px-2 rounded">
                            Q:
                          </span>
                          <p className="font-medium text-gray-900">
                            {item.question}
                          </p>
                        </div>
                        <div className="flex items-start">
                          <span className="font-bold text-green-600 mr-2 bg-green-50 px-2 rounded">
                            A:
                          </span>
                          <p className="text-gray-600 whitespace-pre-wrap">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(activeTab, item, index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Sửa chi tiết"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteContext({
                          type: activeTab,
                          id: selectedCourse.docId,
                          index,
                        });
                        setIsConfirmOpen(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <ItemEditorModal
          isOpen={isEditorOpen}
          type={editorType}
          data={editingItemData}
          onSave={handleEditorSave}
          onCancel={() => setIsEditorOpen(false)}
        />

        <ConfirmationModal
          isOpen={isConfirmOpen}
          title="Xóa Mục"
          message="Bạn có chắc chắn muốn xóa mục này khỏi khóa học không?"
          onConfirm={handleDeleteItem}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    );
  }

  // --- RENDER DANH SÁCH ---
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Course Management
        </h1>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Find course by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <div
              // SỬA LỖI KEY Ở ĐÂY: Dùng kết hợp docId và index
              key={`${course.docId || "temp"}-${index}`}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              <div
                className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 relative cursor-pointer"
                onClick={() => handleSelectCourse(course)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all" />
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                    {course.category || "General"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="font-bold text-gray-900 text-lg leading-tight cursor-pointer hover:text-indigo-600"
                    onClick={() => handleSelectCourse(course)}
                  >
                    {course.title}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        handleUpdateTitle(course.docId, course.title)
                      }
                      className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                      title="Sửa tên nhanh"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteContext({ type: "course", id: course.docId });
                        setIsConfirmOpen(true);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Xóa khóa học"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {course.description || "Chưa có mô tả."}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t">
                  <div className="flex items-center">
                    <Layers size={14} className="mr-1" />
                    {course.chapters?.length || 0} chapters
                  </div>
                  <span>{formatDate(course.createdOn)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            Không tìm thấy khóa học nào phù hợp.
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={deleteContext?.type === "course" ? "Xóa Khóa Học" : "Xóa Mục"}
        message={
          deleteContext?.type === "course"
            ? "Bạn có chắc chắn muốn xóa toàn bộ khóa học này không? Hành động này không thể hoàn tác."
            : "Bạn có chắc chắn muốn xóa mục này khỏi khóa học không?"
        }
        onConfirm={
          deleteContext?.type === "course"
            ? handleDeleteCourse
            : handleDeleteItem
        }
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default CourseManagement;
