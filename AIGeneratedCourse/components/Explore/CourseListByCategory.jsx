import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import CourseList from "../Home/CourseList";

export default function CourseListByCatogery({ category }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetCourseListByCategory();
  }, [category]);

  const GetCourseListByCategory = async () => {
    setCourseList([]);
    setLoading(true);
    
    try {
        const q = query(
        collection(db, "courses"),
        where("category", "==", category)
        );
        const querySnapshot = await getDocs(q);

        const courses = []; // 1. Tạo mảng tạm để chứa dữ liệu
        querySnapshot.forEach((doc) => {
            // 2. Quan trọng: Thêm docId vào object để router.push hoạt động đúng
            courses.push({ docId: doc.id, ...doc.data() }); 
        });
        
        setCourseList(courses); // 3. Cập nhật state một lần duy nhất (tối ưu hiệu năng)
        setLoading(false);
    } catch (e) {
        console.log(e);
        setLoading(false);
    }
  };

  return (
    <View>
      {/* Nếu có khóa học thì hiển thị Component CourseList dùng chung */}
      {courseList?.length > 0 && (
        <CourseList 
            courseList={courseList} 
            heading={category} 
            enroll={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Style này thực ra không còn dùng ở đây nữa vì đã chuyển sang CourseList
  // nhưng cứ để lại nếu bạn muốn dùng cho wrapper bên ngoài
  courseContainer: {
    padding: 10,
    backgroundColor: Colors.BG_GRAY,
    margin: 6,
    borderRadius: 15,
    width: 270,
  },
});