import { View, Text, FlatList, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Home/Header";
import Colors from "../../constant/Colors";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import NoCourse from "../../components/Home/NoCourse";
import CourseList from "../../components/Home/CourseList";
import { PraticeOption } from "../../constant/Option";
import PracticeSection from "../../components/Home/PracticeSection";
import CourseProgress from "../../components/Home/CourseProgress";

export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);

    const q = query(
      collection(db, "courses"),
      where("createdBy", "==", userDetail?.email)
    );

    const querySnapshot = await getDocs(q);

    // gom toàn bộ course vào 1 mảng
    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCourseList(courses); // 👉 chỉ set 1 lần

    setLoading(false);
  };

  return (
    <FlatList
      data={[]}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      ListHeaderComponent={
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE,
          }}
        >
          <Image
            source={require("./../../assets/images/wave.png")}
            style={{
              position: "absolute",
              width: "100%",
              height: 850,
            }}
          />
          <View
            style={{
              padding: 25,
            }}
          >
            <Header />
            {courseList?.length == 0 ? (
              <NoCourse />
            ) : (
              <View>
                <CourseProgress courseList={courseList} />
                <PracticeSection />
                <CourseList courseList={courseList} />
                {/* <CourseList courseList={courseList}/> */}
              </View>
            )}
          </View>
        </View>
      }
    />
  );
}
