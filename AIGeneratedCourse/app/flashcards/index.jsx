import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import FlipCard from "react-native-flip-card";
import * as Progress from "react-native-progress";
import { useRoute } from "@react-navigation/native";

export default function Flashcards() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const flashcard = course?.flashcards;
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const width = Dimensions.get("screen").width;

  const onScroll = (event) => {
    const index = Math.round(event?.nativeEvent?.contentOffset.x / width);
    console.log(index);
    setCurrentPage(index);
  };


  const GetProgress = () => {
    return (currentPage + 1) / flashcard.length;
  };
  return (
    <View>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{ height: 900, width: "100%", backgroundColor: Colors.BG_GRAY }}
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
            {currentPage + 1} of {flashcard?.length}
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

        <FlatList
          data={flashcard}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                height: 500,
                marginTop: 60,
                // backgroundColor: Colors.WHITE,

                // marginHorizontal: width * 0.05,
              }}
            >
              <FlipCard style={styles.flipCard}>
                <View style={styles.frontCard}>
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: 25,
                      textAlign: "center",
                    }}
                  >
                    {item?.front}
                  </Text>
                </View>
                <View style={styles.backCard}>
                  <Text
                    style={{
                      width: Dimensions.get("screen").width * 0.78,
                      padding: 20,
                      fontFamily: "outfit",
                      fontSize: 25,
                      textAlign: "center",
                      color: Colors.WHITE,
                    }}
                  >
                    {item?.back}
                  </Text>
                </View>
              </FlipCard>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flipCard: {
    width: Dimensions.get("screen").width * 0.78,
    height: 400,
    backgroundColor: Colors.WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    elevation: 0.5,
  },
  frontCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 20,
  },
  backCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
  },
});
