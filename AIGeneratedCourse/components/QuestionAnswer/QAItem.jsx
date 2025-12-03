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
    maxHeight: maxHeight.value, // ⭐ chỉ cái này là đủ
    opacity: isOpen ? 1 : 0,
  }));

  return (
    <Pressable
      style={styles.card}
      onPress={() => setselectedQuestion(isOpen ? null : index)}
    >
      <View style={styles.row}>
        <Text style={styles.question}>{item.question}</Text>

        <Animated.View style={animatedIcon}>
          <Ionicons
            name="chevron-down-sharp"
            size={20}
            color={Colors.PRIMARY}
          />
        </Animated.View>
      </View>

      {/* hidden measure box */}
      <View
        style={styles.hiddenMeasureBox}
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
      >
        <Text style={styles.answer}>{item.answer}</Text>
      </View>

      {/* actual animated answer */}
      <Animated.View style={[styles.answerBox, animatedAnswer]}>
        <Text style={styles.answer}>💡 {item.answer}</Text>
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
    gap: 5,
  },
  question: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    flexShrink: 1,
  },

  answerBox: {
    overflow: "hidden", // ⭐ BẮT BUỘC
    marginTop: 10,
    borderTopWidth: 0.3,
  },

  hiddenMeasureBox: {
    position: "absolute",

    left: 0,
    opacity: 0,
  },

  answer: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GREEN,
    marginTop: 10,
  },
});
