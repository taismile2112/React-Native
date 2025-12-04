import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // 1. Import Auth Listener
import { db, auth } from './firebase'; 

// Import Components & Pages
import Login from './pages/Login'; // Import trang Login
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CourseManagement from './pages/CourseManagement';
import UserManagement from './pages/UserManagement';
import AISettings from './pages/AISettings';

const App = () => {
  // --- STATE AUTH ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Trạng thái đang kiểm tra đăng nhập

  // --- STATE DATA ---
  const [activePage, setActivePage] = useState('dashboard');
  const [dataLoading, setDataLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({ quizzes: 0, qna: 0 });

  // 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setAuthLoading(false); // Đã kiểm tra xong
      });
      return () => unsubscribe();
  }, []);

  // 2. LẤY DỮ LIỆU (Chỉ chạy khi đã có user)
  useEffect(() => {
    if (!currentUser) return; // Nếu chưa đăng nhập thì không lấy dữ liệu

    // 2a. Lấy Users
    const usersRef = collection(db, 'users'); 
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
        const fetchedUsers = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: data.uid,
                name: data.name || "No Name",
                email: data.email || "No Email",
                role: data.member ? "Member" : "User",
                last_login: "N/A",
            };
        });
        setUsersList(fetchedUsers);
    }, (error) => console.error("Lỗi lấy users:", error));

    // 2b. Lấy Courses
    const coursesRef = collection(db, 'courses');
    const unsubscribeCourses = onSnapshot(coursesRef, (snapshot) => {
        const fetchedCourses = [];
        let totalQuizzes = 0;
        let totalQnA = 0;

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const courseObj = {
                id: data.docId || doc.id,
                docId: doc.id,
                title: data.courseTitle || "Không tiêu đề",
                creator: data.createdBy || "Ẩn danh",
                category: data.category || "Uncategorized",
                description: data.description || "",
                createdOn: data.createdOn,
                banner_image: data.banner_image,
                chapters: data.chapters || [],
                quiz: data.quiz || [],           
                flashcards: data.flashcards || [],
                qa: data.qa || [],
                duration: `${data.chapters?.length || 0} chương`,
                status: data.status || "Active",
                ai_usage: Math.floor(Math.random() * 500),
            };
            totalQuizzes += (data.quiz?.length || 0);
            totalQnA += (data.qa?.length || 0);
            fetchedCourses.push(courseObj);
        });

        setCourses(fetchedCourses);
        setStats({ quizzes: totalQuizzes, qna: totalQnA });
        setDataLoading(false);

    }, (error) => console.error("Lỗi lấy courses:", error));

    return () => {
        unsubscribeUsers();
        unsubscribeCourses();
    };
  }, [currentUser]); // Dependencies: Chạy lại khi currentUser thay đổi

  // --- RENDER LOGIC ---

  // 1. Màn hình chờ khi đang kiểm tra Auth
  if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      );
  }

  // 2. Nếu chưa đăng nhập -> Hiện trang Login
  if (!currentUser) {
      return <Login />;
  }

  // 3. Nếu đã đăng nhập -> Hiện Dashboard (Logic cũ)
  const renderContent = () => {
     if (dataLoading) return (
        <div className="flex h-full items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
     );
     
     switch (activePage) {
        case 'dashboard': 
            return <Dashboard 
                courses={courses} 
                users={usersList} 
                quizzes={new Array(stats.quizzes).fill({})} 
                qna={new Array(stats.qna).fill({status: 'Pending'})} 
            />;
        case 'courses': return <CourseManagement courses={courses} />;
        case 'users': return <UserManagement users={usersList} />;
        case 'ai-settings': return <AISettings />;
        default: return <Dashboard courses={courses} users={usersList} quizzes={new Array(stats.quizzes).fill({})} qna={new Array(stats.qna).fill({status: 'Pending'})} />;
     }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex antialiased">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header mobile */}
        <header className="bg-white shadow-md p-4 lg:hidden sticky top-0 z-10">
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
                {/* Mobile Menu Logic Here if needed */}
            </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;