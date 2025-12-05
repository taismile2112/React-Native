import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from '../../constant/Colors';

export default function ProfileHeader({ userDetail, setUserDetail, onEditPress }) {
  
  const handleChooseAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
    });

    if (!result.canceled) {
        const newPhoto = result.assets[0].uri;
        setUserDetail({ ...userDetail, photoURL: newPhoto });
        // Gọi hàm update API ở đây nếu cần
    }
  };

  return (
    <View style={styles.headerWrapper}>
        <View style={styles.avatarWrapper}>
            <Image
                source={{ uri: userDetail?.photoURL || "https://www.gravatar.com/avatar/?d=mp&s=300" }}
                style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChooseAvatar}>
                <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
        </View>

        <Text style={styles.name}>{userDetail?.name || "Users"}</Text>
        <Text style={styles.email}>{userDetail?.email}</Text>

        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
            <Text style={styles.editButtonText}>
                Edit Profile <Ionicons name="create-outline" size={18} color={Colors.GRAY}/>
            </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    headerWrapper: { alignItems: "center", paddingTop: 40, paddingBottom: 40 },
    avatarWrapper: { position: "relative", marginBottom: 12 },
    avatar: { width: 110, height: 110, borderRadius: 50, borderWidth: 3, borderColor: "#fff" },
    cameraButton: { position: "absolute", bottom: 0, right: -4, backgroundColor: "#0A6CFF", width: 38, height: 38, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
    name: { color: "#fff", fontSize: 22, fontFamily: "outfit-bold", marginTop: 12 },
    email: { color: "#E2E9FF", marginTop: 5, fontSize: 14 },
    editButton: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 20, elevation: 5 },
    editButtonText: { color: "#0A6CFF", fontFamily: "outfit-bold" },
});