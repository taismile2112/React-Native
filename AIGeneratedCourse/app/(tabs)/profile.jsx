import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ProfileMenu } from "../../constant/Option";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { UserDetailContext } from "../../context/UserDetailContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const handlePress =  async(item) => {
    if (item.name === "Log Out") {
      await signOut(auth);
      setUserDetail(null);
      router.replace("/");
    } else {
      router.push(item.path);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 25,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontFamily: "outfit-bold", fontSize: 28 }}>👤 Profile</Text>

      <View
        style={{
          alignItems: "center",
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <Image
          source={require("./../../assets/images/Splash-SignIn_Up.png")}
          style={{
            width: "100%",
            height: 200,
            resizeMode: "contain",
            marginBottom: 15,
          }}
        />

        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          {userDetail?.name}
        </Text>

        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            color: "#928686ff",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          {userDetail?.email}
        </Text>
      </View>

      {/* 👉 FlatList bắt đầu từ đây, đặt trong return luôn! */}
      <FlatList
        data={ProfileMenu}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isLogout = item.name === "Log Out";

          return (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 18,
                backgroundColor: Colors.BG_GRAY,
                borderRadius: 14,
                marginBottom: 12,
              }}
            >
              <Ionicons
                name={item.icon}
                size={26}
                color={isLogout ? Colors.RED : Colors.PRIMARY}
              />

              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 18,
                  marginLeft: 15,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
