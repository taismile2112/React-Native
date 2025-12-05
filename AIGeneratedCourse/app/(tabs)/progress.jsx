import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import CourseProgressCard from "../../components/Shared/CourseProgressCard";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import FadeInView from "../../components/Common/FadeInView";
import { Ionicons } from "@expo/vector-icons";

export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    // Lưu ý: Không xóa list ngay lập tức để tránh giao diện bị nháy khi refresh
    // setCourseList([]); 
    try {
        const q = query(
        collection(db, "courses"),
        where("createdBy", "==", userDetail?.email)
        );

        const querySnapshot = await getDocs(q);
        const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        setCourseList(courses);
    } catch (error) {
        console.error("Error getting courses:", error);
    } finally {
        setLoading(false);
    }
  };

  // Header Component
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>📈 Course Progress</Text>
      <Text style={styles.subHeaderText}>
        Keep going, {userDetail?.firstName || 'Learner'}!
      </Text>
    </View>
  );

  // Empty State Component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
        <Ionicons name="school-outline" size={130} style={{ opacity: 0.7 }} />
        <Text style={styles.emptyText}>You haven't joined any courses yet.</Text>
        <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)/home')}
        >
            <Text style={styles.exploreButtonText}>Explore Courses</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <FadeInView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Background Full Screen */}
        <Image
          source={require("./../../assets/images/wave.png")}
          style={styles.backgroundImage}
        />
        
        <View style={styles.listWrapper}>
          <FlatList
            data={courseList}
            showsVerticalScrollIndicator={false}
            
            // Pull to Refresh
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={GetCourseList} tintColor={Colors.WHITE} />
            }

            // --- THAY ĐỔI Ở ĐÂY ---
            // Chỉ hiển thị Header khi danh sách CÓ khóa học
            ListHeaderComponent={courseList.length > 0 ? ListHeader : null}
            
            // Xử lý khi danh sách trống
            ListEmptyComponent={!loading && courseList.length === 0 ? EmptyState : null}
            
            contentContainerStyle={styles.listContent}
            
            // Tạo khoảng cách giữa các item
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}

            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
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
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
  listWrapper: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.WHITE,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  subHeaderText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.WHITE,
    opacity: 0.9,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1, // Quan trọng: Giúp EmptyState căn giữa màn hình
  },
  // Style cho Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70, // Điều chỉnh nhẹ để nó nằm cân đối
  },
  emptyText: {
    fontFamily: 'outfit',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
  exploreButton: {
    marginTop: 30,
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 50,
    elevation: 5,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  exploreButtonText: {
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
    fontSize: 18
  }
});