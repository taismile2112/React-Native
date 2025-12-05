import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ScrollView, // Import thêm ScrollView
  StyleSheet,
  ActivityIndicator, // Import icon loading
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constant/Colors";
import * as Progress from "react-native-progress";
import Button from "./../../components/Shared/Button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function Quiz() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const { courseParams } = useLocalSearchParams();
  
  // Parse an toàn để tránh crash
  let course = null;
  let quiz = [];
  try {
     course = courseParams ? JSON.parse(courseParams) : null;
     quiz = course?.quiz || [];
  } catch (e) {
     console.log("Error parsing params:", e);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  // Nếu không có dữ liệu quiz
  if (!quiz || quiz.length === 0) {
     return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
           <Text>No quiz available.</Text>
           <Button text="Go Back" onPress={()=> router.back()}/>
        </View>
     )
  }

  const GetProgress = () => {
    return (currentPage + 1) / quiz.length;
  };

  const onOptionSelect = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage]?.correctAns === selectedChoice,
        question: quiz[currentPage]?.question,
        correctAns: quiz[currentPage]?.correctAns,
      },
    }));
  };

  const onQuizFinish = async () => {
    setLoading(true);
    try {
      // Update kết quả lên Firebase (nếu cần)
      if (course?.docId) {
          await updateDoc(doc(db, "courses", course.docId), {
            quizResult: result,
          });
      }
      
      setLoading(false);

      // CHUYỂN TRANG: Đây là đoạn quan trọng đã được sửa
      router.replace({
        pathname: "/quiz/summery", // Lưu ý: file bạn tên là summery hay summary? Kiểm tra lại nhé
        params: {
          quizResultParam: JSON.stringify(result),
          courseParams: courseParams, // <--- QUAN TRỌNG: Gửi kèm dữ liệu khóa học để làm lại bài
        },
      });
    } catch (e) {
      console.log("Error finishing quiz:", e);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={styles.bgImage}
      />

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={35} color="white" />
          </Pressable>

          <Text style={styles.counterText}>
            {currentPage + 1} of {quiz.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={GetProgress()}
            width={width * 0.85}
            color={Colors.WHITE}
            unfilledColor={'rgba(255,255,255,0.3)'}
            borderWidth={0}
            height={8}
            borderRadius={10}
          />
        </View>

        {/* Question Card */}
        <View style={styles.cardContainer}>
            {/* Dùng ScrollView để nội dung dài không bị mất */}
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
            >
              <Text style={styles.questionText}>
                {quiz[currentPage]?.question}
              </Text>

              <View style={{marginTop: 20}}>
                  {quiz[currentPage]?.options.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedOption(index);
                        onOptionSelect(item);
                      }}
                      activeOpacity={0.7}
                      style={[
                        styles.optionItem,
                        {
                          backgroundColor: selectedOption === index ? Colors.LIGHT_GREEN : Colors.WHITE,
                          borderColor: selectedOption === index ? Colors.GREEN : Colors.GRAY,
                          borderWidth: selectedOption === index ? 2 : 1, // Viền đậm hơn khi chọn
                        }
                      ]}
                    >
                      <Text style={{ 
                          fontSize: 17, 
                          fontFamily: 'outfit',
                          color: selectedOption === index ? Colors.BLACK : Colors.BLACK 
                      }}>
                          {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
          </ScrollView>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
            {/* Nút NEXT */}
            {selectedOption != null && currentPage < quiz.length - 1 && (
              <Button
                text="Next Question"
                onPress={() => {
                  setCurrentPage(currentPage + 1);
                  setSelectedOption(null);
                }}
              />
            )}

            {/* Nút FINISH */}
            {selectedOption != null && currentPage === quiz.length - 1 && (
              <Button
                text="Finish Quiz"
                loading={loading}
                onPress={() => onQuizFinish()}
              />
            )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_GRAY
    },
    bgImage: {
        height: 800, 
        width: "100%",
        position: 'absolute',
        top: 0
    },
    contentContainer: {
        padding: 25,
        width: "100%",
        flex: 1,
        paddingTop: 50
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    counterText: {
        fontSize: 22,
        color: Colors.WHITE,
        fontFamily: 'outfit-bold'
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    cardContainer: {
        padding: 25,
        backgroundColor: Colors.WHITE,
        marginTop: 30,
        flex: 1, // Cho phép dãn nở hết khoảng trống còn lại
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 20 // Để chừa chỗ cho nút bấm
    },
    questionText: {
        fontSize: 24,
        fontFamily: "outfit-bold",
        textAlign: "center",
        marginBottom: 10
    },
    optionItem: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 15,
    },
    footer: {
        marginBottom: 10
    }
});