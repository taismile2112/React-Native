import React from 'react';
import { BookOpen, Users, Zap, ClipboardList, HelpCircle } from 'lucide-react';

// Component: Thống kê cơ bản
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 ease-in-out hover:shadow-xl bg-white`}>
    <div className="flex items-center justify-between">
      <div className={`text-4xl ${color}`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Dashboard nhận quizzes và qna từ props thay vì import mock data
const Dashboard = ({ courses, users, quizzes = [], qna = [] }) => {
  const totalCourses = courses.length;
  const totalAIUsage = courses.reduce((sum, course) => sum + course.ai_usage, 0);
  const totalQuizzes = quizzes.length;
  // Kiểm tra cả 'Pending Review' (mock cũ) và 'Pending' (dữ liệu mới từ App.jsx)
  const totalPendingQnA = qna.filter(q => q.status === 'Pending Review' || q.status === 'Pending').length;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">OverView</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Courses" value={totalCourses} icon={BookOpen} color="text-indigo-600" />
        <StatCard title="Total Users" value={users.length} icon={Users} color="text-green-600" />
        <StatCard title="AI Content Generation" value={`${totalAIUsage} Times`} icon={Zap} color="text-red-600" />
        <StatCard title="Created Quiz" value={totalQuizzes} icon={ClipboardList} color="text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Course Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active</span>
              <div className="w-3/4 bg-green-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: `${(courses.filter(c => c.status === 'Active').length / (totalCourses || 1)) * 100}%` }}></div>
              </div>
              <span className="text-sm font-medium">{courses.filter(c => c.status === 'Active').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Review</span>
              <div className="w-3/4 bg-yellow-200 rounded-full h-3">
                <div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(courses.filter(c => c.status === 'Pending Review').length / (totalCourses || 1)) * 100}%` }}></div>
              </div>
              <span className="text-sm font-medium">{courses.filter(c => c.status === 'Pending Review').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Note</h2>
          <div className="text-center py-6">
            <HelpCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="text-4xl font-bold text-gray-900">{totalPendingQnA}</p>
            <p className="text-lg text-gray-600">Q&A questions are pending approval/answering</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;