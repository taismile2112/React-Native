import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import { collection, getDocs, query, QuerySnapshot, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import CourseProgressCard from "../../components/Shared/CourseProgressCard";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function Progress() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const ListHeader = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>📈 Course Progress</Text>
  </View>
);

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
 <View style={styles.container}>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={styles.backgroundImage}
      />
      
      <View style={styles.listWrapper}>
        <FlatList
          data={courseList}
          showsVerticalScrollIndicator={false}
          onRefresh={() => GetCourseList()}
          refreshing={loading}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id || index}
              onPress={() =>
                router.push({
                  pathname: "/courseView/" + item?.docId,
                  params: { courseParams: JSON.stringify(item) },
                })
              }
            >
              <CourseProgressCard item={item} width={"100%"} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: 850,
  },
  listWrapper: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.WHITE,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});