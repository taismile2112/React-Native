import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import * as Progress from "react-native-progress";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function CourseProgressCard({ item, width = 280 }) {
  const GetCompletedChapters = (course) => {
    const completedChapter = course?.completedChapter?.length;
    const perc = completedChapter / course?.chapters?.length;
    return perc;
  };
  return (
    <View
      style={{
        margin: 7,
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        width: width,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Image
          source={imageAssets[item?.banner_image]}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flexShrink: 1,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontFamily: "outfit-bold",
              fontSize: 16,
              flexWrap: "wrap",
            }}
          >
            {item?.courseTitle}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 13,
            }}
          >
            {item?.chapters?.length} Chapters
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <Progress.Bar
          progress={GetCompletedChapters(item)}
          width={width - 30}
          height={7}
        />

        <View
          style={{
            marginTop: 5,
            paddingVertical: 4,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AntDesign name="play-circle" size={28} color={Colors.PRIMARY} />
          <Text
            style={{
              fontFamily: "outfit",
              marginTop: 3,
            }}
          >
            {item?.completedChapter?.length ?? 0} / {item.chapters?.length}{" "}
            Completed Chapter
          </Text>
        </View>
      </View>
    </View>
  );
}
