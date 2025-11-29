import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constant/Colors";
import * as Progress from "react-native-progress";
import Button from "./../../components/Shared/Button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function Quiz() {
  const router = useRouter();

  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const quiz = course?.quiz;

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

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
      await updateDoc(doc(db, "courses", course.docId), {
        quizResult: result,
      });
      setLoading(false);

      router.replace({
        pathname: "/quiz/summery",
        params: {
          quizResultParam: JSON.stringify(result),
        },
      });
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
    // Redirect to summary page...
  };

  return (
    <View>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{ height: 800, width: "100%" }}
      />

      <View style={{ position: "absolute", padding: 25, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={45} color="white" />
          </Pressable>

          <Text style={{ fontSize: 25, color: Colors.WHITE }}>
            {currentPage + 1} of {quiz.length}
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Progress.Bar
            progress={GetProgress()}
            width={Dimensions.get("window").width * 0.85}
            color={Colors.WHITE}
            height={10}
          />
        </View>

        <View
          style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            marginTop: 30,
            height: Dimensions.get("screen").height * 0.7,
            elevation: 1,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: "outfit-bold",
              textAlign: "justify",
            }}
          >
            {currentPage + 1}. {quiz[currentPage]?.question}
          </Text>

          {quiz[currentPage]?.options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedOption(index);
                onOptionSelect(item);
              }}
              style={{
                padding: 17,
                borderWidth: 1,
                borderRadius: 25,
                marginTop: 20,
                backgroundColor:
                  selectedOption === index ? Colors.LIGHT_GREEN : null,
                borderColor: selectedOption === index ? Colors.GREEN : null,
              }}
            >
              <Text style={{ fontSize: 17 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NEXT button (not last question) */}
        {selectedOption != null && currentPage < quiz.length - 1 && (
          <Button
            text="Next"
            onPress={() => {
              setCurrentPage(currentPage + 1);
              setSelectedOption(null);
            }}
          />
        )}

        {/* FINISH button (last question) */}
        {selectedOption != null && currentPage === quiz.length - 1 && (
          <Button
            text="Finish"
            loading={loading}
            onPress={() => onQuizFinish()}
          />
        )}
      </View>
    </View>
  );
}
