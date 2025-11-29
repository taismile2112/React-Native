import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";

export default function QuizSummery() {
  const { quizResultParam } = useLocalSearchParams();
  const quizResult = JSON.parse(quizResultParam);
  const [correctAns, setCorrectAns] = useState(0);
  const [totalQuestion, setTotalQues] = useState(0);
  const router = useRouter();

  useEffect(() => {
    quizResult && calculateResult();
  }, [quizResult]);

  const calculateResult = () => {
    if (quizResult !== undefined) {
      const correctAns_ = Object.entries(quizResult)?.filter(
        ([key, value]) => value?.isCorrect == true
      );
      const totalQues_ = Object.keys(quizResult).length;

      setCorrectAns(correctAns_.length);
      setTotalQues(totalQues_);
    }
  };

  const GetPercMark = () => {
    return ((correctAns / totalQuestion) * 100).toFixed(0);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* --------- TOP FIXED PART ---------- */}
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          width: "100%",
          height: 700,
          position: "absolute",
          top: 0,
        }}
      />

      <View style={{ padding: 35 }}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "outfit-bold",
            fontSize: 30,
            color: Colors.WHITE,
          }}
        >
          📝 Quiz Summary
        </Text>

        <View
          style={{
            backgroundColor: Colors.WHITE,
            padding: 20,
            borderRadius: 20,
            marginTop: 60,
            alignItems: "center",
          }}
        >
          <Image
            source={require("./../../assets/images/trophy.png")}
            style={{
              width: 100,
              height: 100,
              marginTop: -60,
            }}
          />

          <Text style={{ fontSize: 26, fontFamily: "outfit-bold" }}>
            {GetPercMark() > 60 ? "🎉 Congratulation!" :  "🔄 Try Again!"}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              color: Colors.GRAY,
              fontSize: 17,
              textAlign: "center",
            }}
          >
            You gave {GetPercMark()}% Correct Choices
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              gap: 15,
            }}
          >
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>Q {totalQuestion}</Text>
            </View>

            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>✅ {correctAns}</Text>
            </View>

            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>
                ❌ {totalQuestion - correctAns}
              </Text>
            </View>
          </View>
        </View>

        <Button
          text={"Back To Home"}
          onPress={() => router.replace("/(tabs)/home")}
        />

        <Text
          style={{
            marginTop: 15,
            marginBottom: -20,
            fontFamily: "outfit-bold",
            fontSize: 23,

          }}
        >
          📘 Summary
        </Text>
      </View>

      {/* ---------- ONLY SUMMARY SCROLLS ---------- */}
      <View style={{ flex: 1, paddingHorizontal: 35 }}>
        <FlatList
          data={Object.entries(quizResult)}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const quizItem = item[1];
            return (
              <View
                style={{
                  padding: 15,
                  borderWidth: 1.5,
                  marginBottom: 8,
                  borderRadius: 15,
                  backgroundColor: quizItem?.isCorrect
                    ? Colors.LIGHT_GREEN
                    : Colors.LIGHT_RED,
                  borderColor: quizItem?.isCorrect
                    ? Colors.GREEN
                    : Colors.RED,
                }}
              >
                <Text style={{ fontFamily: "outfit", fontSize: 14 }}>
                  {quizItem.question}
                </Text>

                <Text style={{ fontSize: 15 }}>
                  <Text style={{ fontFamily: 'outfit-bold' }}>Answer:</Text> 
                  <Text style={{ fontStyle: 'italic'}}>  {quizItem?.correctAns}</Text>
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultTextContainer: {
    padding: 7,
    backgroundColor: Colors.WHITE,
    elevation: 1,
  },
  resultText: {
    fontFamily: "outfit",
    fontSize: 20,
  },
});
