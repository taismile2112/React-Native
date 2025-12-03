import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Image } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "../../constant/Colors";
import { ProfileMenu as MenuData } from "../../constant/Option"; // Đổi tên để tránh xung đột

// --- Sub-Component 1: Profile Header ---
const ProfileHeader = ({ userDetail, handleChooseAvatar, handleEditProfile }) => (
    <View style={styles.headerWrapper}>
        <View style={styles.avatarWrapper}>
            <Image
                source={{
                    uri: userDetail?.photoURL || "https://www.gravatar.com/avatar/?d=mp&s=300",
                }}
                style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChooseAvatar}>
                <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
        </View>

        <Text style={styles.name}>{userDetail?.name || "Users"}</Text>
        <Text style={styles.email}>{userDetail?.email}</Text>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>
                Edit Profile <Ionicons name="create-outline" size={18} color={Colors.GRAY}/>
            </Text>
        </TouchableOpacity>
    </View>
);

// --- Sub-Component 2: Profile Menu Item ---
const MenuItem = ({ item, handlePress }) => {
    const isLogout = item.name === "Log Out";
    const iconColor = isLogout ? "#FF3B30" : "#0A6CFF";

    return (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.menuItem}>
            <Ionicons
                name={item.icon}
                size={26}
                color={iconColor}
            />
            <Text style={styles.menuItemText}>{item.name}</Text>
        </TouchableOpacity>
    );
};


// --- Component Chính: ProfileScreen ---
export default function ProfileScreen() {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    // Animation Setup
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]).start();
    }, []);

    // Handlers
    const handleChooseAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
        });

        if (!result.canceled) {
            const newPhoto = result.assets[0].uri;
            setUserDetail({ ...userDetail, photoURL: newPhoto });
            // TODO: Bổ sung logic upload ảnh lên Firebase Storage và cập nhật Firestore/Auth
        }
    };

    const handlePress = async (item) => {
        if (item.name === "Log Out") {
            await signOut(auth);
            setUserDetail(null);
            router.replace("/");
        } else {
            router.push(item.path);
        }
    };

    const handleEditProfile = () => {
        router.push("profile/edit-profile");
    };

    return (
        <ImageBackground
            source={require("../../assets/images/wave.png")}
            resizeMode="cover"
            style={styles.background}
        >
            <Animated.View
                style={[
                    styles.container,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <ProfileHeader
                    userDetail={userDetail}
                    handleChooseAvatar={handleChooseAvatar}
                    handleEditProfile={handleEditProfile}
                />

                {/* Tận dụng FlatList hiện có. Nếu menu RẤT ngắn, có thể dùng ScrollView hoặc View thường */}
                <View style={styles.menuWrapper}>
                    <Animated.FlatList // Sử dụng Animated.FlatList
                        data={MenuData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <MenuItem item={item} handlePress={handlePress} />
                        )}
                        // Thêm paddingBottom để tránh mục cuối bị cắt
                        contentContainerStyle={{ paddingBottom: 50 }} 
                    />
                </View>
            </Animated.View>
        </ImageBackground>
    );
}

// --- Styles (Không đổi nhiều so với bản gốc) ---
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        // Bỏ height: "75%" ở đây vì nó có thể gây ra lỗi layout
    },
    container: {
        flex: 1, // Quan trọng: Cho phép Animated.View chiếm toàn bộ không gian
        backgroundColor: "transparent",
    },
    headerWrapper: {
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 40,
    },
    avatarWrapper: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#fff",
    },
    cameraButton: {
        position: "absolute",
        bottom: 0,
        right: -4,
        backgroundColor: "#0A6CFF",
        width: 38,
        height: 38,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    name: {
        color: "#fff",
        fontSize: 22,
        fontFamily: "outfit-bold",
        marginTop: 12,
    },
    email: {
        color: "#E2E9FF",
        marginTop: 5,
        fontSize: 14,
    },
    editButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        elevation:5,
    },
    editButtonText: {
        color: "#0A6CFF",
        fontFamily: "outfit-bold",
    },
    menuWrapper: {
        // Cần flex: 1 để FlatList bên trong nó hoạt động đúng cách
        flex: 1, 
        paddingHorizontal: 25,
        marginTop: -10,
        backgroundColor: Colors.LIGHT_GRAY, // Có thể thêm màu nền để che sóng
        borderTopLeftRadius: 30, // Thêm bo góc để có hiệu ứng chuyển tiếp đẹp
        borderTopRightRadius: 30,
        // Dùng padding cho FlatList thay vì margin/padding cho menuWrapper
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 25, // Giảm marginBottom để tiết kiệm không gian
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    menuItemText: {
        fontFamily: "outfit",
        fontSize: 16,
        marginLeft: 15,
        color: "#333",
    },
});