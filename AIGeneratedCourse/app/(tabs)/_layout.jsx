import { Tabs, useSegments } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";

function AnimatedIcon({ name, color, focused }) {
  const scale = useRef(new Animated.Value(focused ? 1.2 : 1)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: focused ? 1.4 : 1,
      duration: 2000, // 👈 thời gian phóng to / thu nhỏ (ms)
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={28} color={color} />
    </Animated.View>
  );
}


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",

        // Floating tab bar
        tabBarStyle: {
          // position: "absolute",
          left: 20,
          right: 20,
          height: 65,
          borderRadius: 18,
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 5,
        },

        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarLabelStyle: { marginTop: 8,
        fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name="search-outline"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          tabBarLabel: "Progress",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name="stats-chart-outline"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name="person-circle-outline"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
