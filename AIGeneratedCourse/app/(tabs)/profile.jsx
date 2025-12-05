import React, { useContext } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";

// Import Components đã tách
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import FadeInView from "../../components/Common/FadeInView"; // Import FadeInView

export default function ProfileScreen() {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    // Xử lý sự kiện Menu
    const handleMenuPress = async (item) => {
        if (item.name === "Log Out") {
            await signOut(auth);
            setUserDetail(null);
            router.replace("/");
        } else {
            router.push(item.path);
        }
    };

    return (
        // 👇 Bọc toàn bộ bằng FadeInView để có hiệu ứng chuyển trang mượt
        <FadeInView style={{ flex: 1 }}> 
            <ImageBackground
                source={require("../../assets/images/wave.png")}
                resizeMode="cover"
                style={styles.background}
            >
                {/* 1. Header Component */}
                <ProfileHeader 
                    userDetail={userDetail} 
                    setUserDetail={setUserDetail}
                    onEditPress={() => router.push("profile/edit-profile")}
                />

                {/* 2. Menu Component */}
                <ProfileMenu onMenuPress={handleMenuPress} />
                
            </ImageBackground>
        </FadeInView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
    },
});