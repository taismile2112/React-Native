import { View, Text, Image, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { imageAssets } from "../../constant/Option";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import Button from "../Shared/Button";
import { useRouter } from "expo-router";
import { UserDetailContext } from "../../context/UserDetailContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
export default function Intro({ course, enroll }) {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const onEnrollCourse = async () => {
    const docId = Date.now().toString();
    setLoading(true);
    const data = {
      ...course,
      createdBy: userDetail?.email,
      createdOn: new Date(),
      enrolled: true,
    };
    await setDoc(doc(db, "courses", docId), data);
    router.push({
      pathname: "/courseView/" + docId,
      params: {
        courseParams: JSON.stringify(data),
        enroll: false,
      },
    });
    setLoading(false);
  };
  return (
    <View>
      <Image
        style={{
          width: "100%",
          height: 280,
        }}
        source={imageAssets[course?.banner_image]}
      />
      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
          }}
        >
          {course?.courseTitle}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Ionicons name="book-outline" size={24} color="black" />
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
            }}
          >
            {course?.chapters?.length} Chapters
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 18,
            marginTop: 10,
          }}
        >
          Description:{" "}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.GRAY,
            maxHeight: 100,
          }}
        >
          {course.description}
        </Text>
        {enroll == "true" ? (
          <Button
            text={"Enroll Now"}
            loading={loading}
            onPress={() => onEnrollCourse()}
          />
        ) : (
          <Button text={"Start Now"} onPress={() => console.log()} />
        )}
      </View>

      <Pressable
        style={{
          position: "absolute",
          padding: 10,
        }}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-back-circle-outline" size={50} color="black" />
      </Pressable>
    </View>
  );
}
