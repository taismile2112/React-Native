import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,

      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 23,
            color: Colors.WHITE,
          }}
     numberOfLines={1}   // 👈 Thêm vào để luôn ở 1 dòng
      ellipsizeMode="tail" // 👈 Nếu dài quá thì hiện ...
        >
          👋 Hello, {userDetail?.name}
        </Text>

        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            color: Colors.WHITE,
          }}
        >
          ---Let's Get started!---
        </Text>
      </View>
      {/* <View>
        <TouchableOpacity>
          <Feather name="settings" size={34} color="#fff" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
