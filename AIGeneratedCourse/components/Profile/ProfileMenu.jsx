import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { ProfileMenu as MenuData } from "../../constant/Option";
import Colors from '../../constant/Colors';

export default function ProfileMenu({ onMenuPress }) {
  
  const MenuItem = ({ item }) => {
    const isLogout = item.name === "Log Out";
    return (
        <TouchableOpacity onPress={() => onMenuPress(item)} style={styles.menuItem}>
            <Ionicons name={item.icon} size={26} color={isLogout ? "#FF3B30" : "#0A6CFF"} />
            <Text style={styles.menuItemText}>{item.name}</Text>
        </TouchableOpacity>
    );
  };

  return (
    <View style={styles.menuWrapper}>
        <FlatList
            data={MenuData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <MenuItem item={item} />}
            contentContainerStyle={{ paddingBottom: 50 }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    menuWrapper: { flex: 1, paddingHorizontal: 25, marginTop: -10, backgroundColor: Colors.LIGHT_GRAY, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 20, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 16, marginBottom: 25, elevation: 2 },
    menuItemText: { fontFamily: "outfit", fontSize: 16, marginLeft: 15, color: "#333" },
});