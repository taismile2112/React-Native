import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "../../constant/Colors";
import { db } from "../../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function EditProfile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [name, setName] = useState(userDetail?.name || "");

  const [loading, setLoading] = useState(false);

  // 🔥 Hàm xử lý lưu
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("⚠️ Warning", "Please Enter Your Full Name!");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Cập nhật Firestore
      const userRef = doc(db, "users", userDetail.email);
      await updateDoc(userRef, { name });

      // 🔥 Cập nhật Context -> UI update ngay lập tức
      setUserDetail({ ...userDetail, name });

      setLoading(false);

      Alert.alert("✅ Notification", "Profile is updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
      console.log("Email đang dùng để update:", userDetail.email);
    } catch (error) {
      setLoading(false);
      console.log("Lỗi khi cập nhật Firestore:", error);
      Alert.alert("Lỗi", "Không thể cập nhật. Vui lòng thử lại!");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={35} color={Colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <Text style={styles.label}>Full Name</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.WHITE} />
        ) : (
          <Text style={styles.saveButtonText}>Update Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
  },
  label: {
    marginTop: 20,
    fontFamily: "outfit",
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    fontFamily: "outfit",
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 14,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
});
