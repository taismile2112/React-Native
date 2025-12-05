import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button"; // Import Button xịn của bạn
import { Ionicons } from "@expo/vector-icons";

export default function QuizSummary() {
  // 1. Lấy thêm courseParams để nếu làm lại thì gửi dữ liệu này qua màn hình Quiz
  const { quizResultParam, courseParams } = useLocalSearchParams();
  
  const quizResult = quizResultParam ? JSON.parse(quizResultParam) : {};
  const resultList = Object.values(quizResult); 
  const [correctAnsCount, setCorrectAnsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (resultList.length > 0) {
      calculateResult();
    }
  }, []);

  const calculateResult = () => {
    const count = resultList.filter((item) => item?.isCorrect === true).length;
    setCorrectAnsCount(count);
  };

  const GetPercMark = () => {
    return resultList.length > 0
      ? ((correctAnsCount / resultList.length) * 100).toFixed(0)
      : 0;
  };

  // --- HEADER ---
  const renderHeader = () => {
    const percentage = GetPercMark();
    const isPass = percentage >= 60; // Logic đậu rớt

    return (
      <View>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text style={styles.titleText}>📝 Quiz Summary</Text>
        </View>

        <View style={styles.scoreCard}>
          <Image
            source={require("./../../assets/images/trophy.png")}
            style={styles.trophyImage}
          />
          <Text style={styles.congratsText}>
            {isPass ? "🎉 Congratulations!" : "🔄 Don't Give Up!"}
          </Text>
          <Text style={styles.percentageText}>
            You scored {percentage}%
          </Text>

          {/* Grid Thống kê */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Q</Text>
              <Text style={styles.statValue}>{resultList.length}</Text>
            </View>
            <View
              style={[
                styles.statItem,
                { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#eee" },
              ]}
            >
              <Text style={styles.statLabel}>Correct</Text>
              <Text style={[styles.statValue, { color: Colors.GREEN }]}>
                {correctAnsCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Wrong</Text>
              <Text style={[styles.statValue, { color: Colors.RED }]}>
                {resultList.length - correctAnsCount}
              </Text>
            </View>
          </View>
        </View>

        {/* --- KHU VỰC BUTTONS (Đã cập nhật) --- */}
        <View style={{ marginVertical: 20 }}>
          
          {/* NÚT 1: TRY AGAIN (Chỉ hiện khi rớt) */}
          {!isPass && (
             <Button
                text="🔄 Try Again"
                type="fill" // Nút chính màu Primary
                onPress={() => 
                  // Reset lại Quiz bằng cách replace trang hiện tại
                  router.replace({
                    pathname: '/quiz', 
                    params: { courseParams: courseParams } // Gửi lại dữ liệu khóa học
                  })
                }
             />
          )}

          {/* NÚT 2: BACK TO HOME */}
          {/* Nếu rớt (có nút Try Again rồi) thì nút Home thành outline (phụ) */}
          {/* Nếu đậu (không có nút Try Again) thì nút Home thành fill (chính) */}
          <Button
            text="Back To Home"
            type={!isPass ? "outline" : "fill"} 
            onPress={() => router.replace("/(tabs)/home")}
            style={{marginTop: 10}} // Thêm chút khoảng cách nếu có 2 nút
          />
        </View>

        <Text style={styles.summaryTitle}>📘 Detailed Review</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require("./../../assets/images/wave.png")}
        style={styles.backgroundImage}
      />

      <FlatList
        data={resultList}
        keyExtractor={(item, index) => index.toString()} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => {
          const isCorrect = item?.isCorrect;
          
          return (
            <View
              style={[
                styles.questionItem,
                {
                  borderColor: isCorrect ? Colors.GREEN : Colors.RED,
                  backgroundColor: Colors.WHITE,
                },
              ]}
            >
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: 16,
                    color: isCorrect ? Colors.GREEN : Colors.RED,
                  }}
                >
                  Q{index + 1}.
                </Text>
                <Text style={{ fontFamily: "outfit", fontSize: 16, flex: 1 }}>
                  {item.question}
                </Text>
              </View>

              <View style={styles.answerBlock}>
                {isCorrect ? (
                  <View style={{flexDirection:'row', alignItems:'center', gap: 5}}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.GREEN} />
                      <Text style={{ fontFamily: "outfit", color: Colors.GRAY }}>Answer: </Text>
                      <Text style={{ fontFamily: "outfit-bold", color: Colors.GREEN, flex: 1 }}>
                        {item.userChoice}
                      </Text>
                  </View>
                ) : (
                  <View>
                    <View style={{flexDirection:'row', alignItems:'center', gap: 5, marginBottom: 5}}>
                        <Ionicons name="close-circle" size={20} color={Colors.RED} />
                        <Text style={{ fontFamily: "outfit", color: Colors.GRAY }}>You selected: </Text>
                        <Text style={{ fontFamily: "outfit", color: Colors.RED, textDecorationLine:'line-through', flex: 1 }}>
                          {item.userChoice}
                        </Text>
                    </View>

                    <View style={{flexDirection:'row', alignItems:'center', gap: 5}}>
                        <Ionicons name="checkmark-circle" size={20} color={Colors.GREEN} />
                        <Text style={{ fontFamily: "outfit", color: Colors.GRAY }}>Correct: </Text>
                        <Text style={{ fontFamily: "outfit-bold", color: Colors.GREEN, flex: 1 }}>
                          {item.correctAns}
                        </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_GRAY || "#f5f5f5",
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 550,
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  titleText: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.WHITE,
    marginTop: 10,
  },
  scoreCard: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trophyImage: {
    width: 100,
    height: 100,
    marginTop: -50,
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  percentageText: {
    fontFamily: "outfit",
    color: Colors.GRAY,
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "outfit",
    fontSize: 12,
    color: Colors.GRAY,
  },
  statValue: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    marginTop: 2,
  },
  summaryTitle: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    marginBottom: 10,
    color: Colors.BLACK,
  },
  questionItem: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  answerBlock: {
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 10,
  },
});