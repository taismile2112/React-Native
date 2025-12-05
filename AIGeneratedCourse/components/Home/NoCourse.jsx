import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Button from "../Shared/Button";
import { useRouter } from "expo-router";
import Colors from "../../constant/Colors"; // Đảm bảo import Colors

export default function NoCourse() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/book.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>You Don't Have Any Course</Text>

      <Text style={styles.subtitle}>
        Start your learning journey today! Create a new course with AI or
        explore existing ones.
      </Text>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <Button
          text={"+ Create New Course"}
          onPress={() => router.push("/addCourse")}
        />

        <Button
          text={"Explore Existing Courses"}
          onPress={() => router.push("/(tabs)/explore")}
          type="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1, // Chiếm toàn bộ chiều cao màn hình
    alignItems: "center",
    justifyContent: "center", // Căn giữa theo chiều dọc
    paddingVertical: 25,
    paddingHorizontal: 30,
    backgroundColor: Colors.WHITE, // Đặt nền trắng cho sạch
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 10 }, // Đổ bóng xuống dưới nhiều hơn
    shadowOpacity: 0.1, // Giảm độ đậm của bóng (0.1 - 0.2)
    shadowRadius: 15, // Bóng lan rộng ra
    elevation: 10, // Cho Android
    borderRadius: 15,
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 20, // Khoảng cách giữa ảnh và text
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 26,
    textAlign: "center",
    color: Colors.BLACK,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 17,
    textAlign: "center",
    color: Colors.GRAY, // Màu xám nhạt cho text phụ
    marginBottom: 20, // Đẩy nút bấm xuống xa một chút cho thoáng
    lineHeight: 24, // Tăng khoảng cách dòng cho dễ đọc
  },
  buttonContainer: {
    width: "100%",
    gap: 5, // Khoảng cách nhỏ giữa 2 nút nếu Button không có marginTop
  },
});
