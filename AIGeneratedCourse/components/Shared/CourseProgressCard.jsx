import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";

export default function CourseProgressCard({ item, width = 280 }) {
  const GetCompletedChapters = (course) => {
    // Kiểm tra an toàn dữ liệu
    const completedLength = course?.completedChapter?.length || 0;
    const totalChapters = course?.chapters?.length || 1; // Tránh chia cho 0
    const perc = completedLength / totalChapters;
    return perc;
  };

  const progress = GetCompletedChapters(item);
  const isCompleted = progress >= 1;

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        margin: 10,
        width: width,
        // Hiệu ứng đổ bóng (Shadow)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Bóng cho Android
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12, // Tăng khoảng cách chút cho thoáng
        }}
      >
        <Image
          source={imageAssets[item?.banner_image]}
          style={{
            width: 80,
            height: 80,
            borderRadius: 10, // Bo góc mềm hơn
          }}
        />
        <View
          style={{
            flexShrink: 1,
            justifyContent: "center",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontFamily: "outfit-bold",
              fontSize: 17,
              flexWrap: "wrap",
              color: Colors.BLACK,
            }}
          >
            {item?.courseTitle}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 14,
              color: Colors.GRAY,
              marginTop: 4,
            }}
          >
            {item?.chapters?.length} Chapters
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 15,
        }}
      >
        <Progress.Bar
          progress={progress}
          width={null} // Để tự động scale theo container
          height={8}
          color={Colors.PRIMARY}
          unfilledColor="#E0E0E0"
          borderWidth={0}
          borderRadius={5}
          style={{ width: "100%" }} // Bắt buộc set width 100% nếu dùng width={null}
        />

        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between", // Đẩy text sang 2 bên
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <AntDesign
              name={isCompleted ? "check-circle" : "caret-right"}
              size={20}
              color={isCompleted ? Colors.GREEN : Colors.PRIMARY}
            />
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 13,
                color: Colors.GRAY,
              }}
            >
              {item?.completedChapter?.length ?? 0} / {item.chapters?.length}{" "}
              Completed
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 13,
              color: Colors.PRIMARY,
            }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}
