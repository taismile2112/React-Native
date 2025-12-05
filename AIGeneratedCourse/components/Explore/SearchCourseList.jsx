// components/Explore/SearchCourseList.jsx
import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import CourseList from '../Home/CourseList';
import Colors from '../../constant/Colors';

export default function SearchCourseList({ searchQuery }) {
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Tải tất cả khóa học một lần khi component được gọi
        getAllCourses();
    }, []);

    useEffect(() => {
        // Chạy hàm lọc mỗi khi searchQuery thay đổi
        if (allCourses.length > 0) {
            filterCourses();
        }
    }, [searchQuery, allCourses]);

    const getAllCourses = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "courses"));
            const querySnapshot = await getDocs(q);
            const courses = [];
            querySnapshot.forEach((doc) => {
                courses.push(doc.data());
            });
            setAllCourses(courses);
            // Khởi tạo danh sách lọc ban đầu
            setFilteredCourses(courses);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const filterCourses = () => {
        const lowerText = searchQuery.toLowerCase();
        const result = allCourses.filter(item => 
            item.courseTitle?.toLowerCase().includes(lowerText) || 
            item.category?.toLowerCase().includes(lowerText)
        );
        setFilteredCourses(result);
    };

    return (
        <View>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.PRIMARY} style={{marginTop: 50}} />
            ) : filteredCourses.length > 0 ? (
                <CourseList 
                    courseList={filteredCourses} 
                    heading={'Search Result'} 
                    enroll={true} // Hoặc false tùy bạn
                />
            ) : (
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 18,
                    textAlign: 'center',
                    marginTop: 50,
                    color: Colors.GRAY
                }}>
                    Không tìm thấy khóa học nào!
                </Text>
            )}
        </View>
    );
}