import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PraticeOption } from "../../../constant/Option";
import Colors from "../../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { UserDetailContext } from "../../../context/UserDetailContext";
import CourseListGrid from "../../../components/PracticeScreen/CourseListGrid";

export default function PracticeTypeHomeScreen() {
  const { type } = useLocalSearchParams();
  const option = PraticeOption.find((item) => item.name == type);
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    try {
      const q = query(
        collection(db, "courses"),
        where("createdBy", "==", userDetail?.email), orderBy('createdOn', 'desc')
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          console.log(doc.data());
        setCourseList((prev) => [...prev, doc.data()]);
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <View>
      <Image
        source={option.image}
        style={{
          width: '100%',
          height: 240,
        }}
      />

      <View
        style={{
          position: "absolute",
          padding: 10,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={27}
            color="black"
            style={{
              backgroundColor: Colors.WHITE,
              padding: 8,
              borderRadius: 10,
            }}
          />
        </Pressable>

        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 28,
            color: Colors.WHITE,
          }}
        >
          {type}
        </Text>
      </View>

      {loading && (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={{
            marginTop: 150,
          }}
        />
      )}

      <CourseListGrid courseList={courseList} option={option}/>
    </View>
  );
}
