import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { imageAssets } from "../../../constant/Option";

import Intro from "../../../components/CourseView/intro";
import Colors from "../../../constant/Colors";
import Chapters from "../../../components/CourseView/Chapters";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";


export default function CourseView() {
  const { courseParams, courseId } = useLocalSearchParams();
  const [course, setCourse] = useState([]);
  // const course = JSON.parse(courseParams);
  // console.log(courseId);

  useEffect(() => {
    if(!courseParams){
      GetCourseById();

    } else {
      setCourse(JSON.parse(courseParams));
    }
  }, [courseId]);

  const GetCourseById = async() => {
    const docRef = await getDoc(doc(db, "courses", courseId));
    const courseData = docRef.data();
    setCourse(courseData);
  }
  return course &&(
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE,
          }}
        >
          <Intro course={course} />
          <Chapters course={course} />
        </View>
      }
    />
  );
}
