import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function Chapters({ course }) {
  const router = useRouter();

  const isChapterCompleted = (index) => {
    const isCompleted = course?.completedChapter?.find((item) => item == index);

    return isCompleted?true:false;
  }
  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Chapters</Text>

      <FlatList
        data={course?.chapters}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chapterView",
                params: {
                  chapterParams: JSON.stringify(item),
                  docId: course?.docId,
                  chapterIndex: index,
                },
              });
            }}
            style={styles.chapterRow}
          >
            {/* LEFT SIDE */}
            <View style={styles.leftContainer}>
              <Text style={styles.chapterIndex}>{index + 1}.</Text>

              <Text style={styles.chapterName} numberOfLines={3}>
                {item.chapterName}
              </Text>
            </View>

            {/* PLAY ICON */}
            <View style={styles.iconContainer}>
              {isChapterCompleted(index)
              ?<Ionicons name="checkmark-circle" size={35} color={Colors.GREEN} />
              :<Ionicons name="play" size={35} color={Colors.PRIMARY} />
              }
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "outfit-bold",
    fontSize: 25,
  },

  chapterRow: {
    padding: 18,
    borderWidth: 0.5,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  leftContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 10,
    alignItems: "flex-start",
  },

  chapterIndex: {
    fontFamily: "outfit",
    fontSize: 20,
  },

  chapterName: {
    fontFamily: "outfit",
    fontSize: 20,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "85%", // đảm bảo không chiếm phần icon
  },

  iconContainer: {
    minWidth: 30, // icon luôn có không gian
    alignItems: "center",
    justifyContent: "center",
  },
});
