import { Pressable, Text, View, StyleSheet } from "react-native";
import Colors from "../../constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

export default function QAItem({
  item,
  index,
  selectedQuestion,
  setselectedQuestion,
}) {
  const isOpen = selectedQuestion === index;

  const rotate = useSharedValue(isOpen ? 180 : 0);
  const maxHeight = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    rotate.value = withTiming(isOpen ? 180 : 0, { duration: 200 });
    maxHeight.value = withTiming(isOpen ? contentHeight : 0, { duration: 250 });
  }, [isOpen, contentHeight]);

  const animatedIcon = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const animatedAnswer = useAnimatedStyle(() => ({
    maxHeight: maxHeight.value,
    opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
  }));

  return (
    <Pressable
      style={styles.card}
      onPress={() => setselectedQuestion(isOpen ? null : index)}
    >
      <View style={styles.row}>
        <Text style={styles.question}>❓ {item.question}</Text>

        <Animated.View style={animatedIcon}>
          <Ionicons
            name="chevron-down-sharp"
            size={20}
            color={Colors.PRIMARY}
          />
        </Animated.View>
      </View>

      {/* hidden measure */}
      <View
        style={styles.hiddenMeasureBox}
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.answerInner}>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      </View>

      {/* animated answer */}
      <Animated.View style={[styles.answerBox, animatedAnswer]}>
        <View style={styles.answerInner}>
          <Text style={styles.answer}>💡 {item.answer}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    marginBottom: 15,
    borderRadius: 15,
    marginLeft: 15,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  question: {
    fontFamily: "outfit-bold",
    fontSize: 15,
    flexShrink: 1,
  },

  /* animation wrapper */
  answerBox: {
    overflow: "hidden",
    marginTop: 12, // ⭐ khoảng cách giữa question & answer → KHÔNG gây giật
    borderTopWidth: 0.3,
    borderColor: "#ccc",
  },

  /* phần đo height — KHÔNG để margin/padding */
  hiddenMeasureBox: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
  },

  /* phần content thật — padding đặt ở đây → animation mượt */
  answerInner: {
    paddingTop: 10,
    paddingBottom: 10,
  },

  answer: {
    fontFamily: "outfit",
    fontSize: 15,
    color: Colors.GREEN,
  },
});
