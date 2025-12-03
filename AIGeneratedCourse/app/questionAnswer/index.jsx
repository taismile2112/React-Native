import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QAItem from "../../components/QuestionAnswer/QAItem";
import Colors from "../../constant/Colors";

export default function QuestionAnswer() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);

  const qaList = course?.qa;
  const router = useRouter();

  const [selectedQuestion, setselectedQuestion] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../assets/images/wave.png")}
        style={styles.bg}
      />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={45} color="white" />
          </Pressable>

          <Text style={styles.headerText}>Question & Answer</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.courseTitle}>{course?.courseTitle}</Text>

        {/* LIST */}
        <FlatList
          data={qaList}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <QAItem
              item={item}
              index={index}
              selectedQuestion={selectedQuestion}
              setselectedQuestion={setselectedQuestion}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    height: 800,
    width: "100%",
    position: "absolute",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 25,
    color: Colors.WHITE,
  },
  courseTitle: {
    fontFamily: "outfit",
    color: Colors.WHITE,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
});
