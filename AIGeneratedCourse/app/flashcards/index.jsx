import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import FlipCard from "react-native-flip-card";
import * as Progress from "react-native-progress";

const { width } = Dimensions.get("window");
// Tính toán kích thước thẻ để căn giữa đẹp hơn
const CARD_WIDTH = width * 0.85; 
const SPACING = (width - CARD_WIDTH) / 2;

export default function Flashcards() {
  const { courseParams } = useLocalSearchParams();
  const course = courseParams ? JSON.parse(courseParams) : null;
  const flashcard = course?.flashcards || [];
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  // Xử lý sự kiện scroll để tính index chính xác
  const onScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    // Chia cho (CARD_WIDTH + margin) để ra index
    const index = Math.round(scrollOffset / (width * 0.85 + 20)); // 20 là margin ước lượng
    // Đảm bảo index không vượt quá giới hạn
    const safeIndex = Math.min(Math.max(index, 0), flashcard.length - 1);
    setCurrentPage(safeIndex);
  };

  const GetProgress = () => {
    if (flashcard.length === 0) return 0;
    return (currentPage + 1) / flashcard.length;
  };

  // Nếu không có dữ liệu, hiển thị thông báo thay vì crash
  if (!flashcard || flashcard.length === 0) {
    return (
      <View style={styles.container}>
         <Pressable onPress={() => router.back()} style={{marginTop: 50, marginLeft: 20}}>
            <Ionicons name="arrow-back" size={30} color="black" />
         </Pressable>
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No flashcards available for this course.</Text>
         </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Image full màn hình an toàn hơn */}
      <Image
        source={require("./../../assets/images/wave.png")}
        style={styles.backgroundImage}
      />

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </Pressable>

          <Text style={styles.pageCounter}>
            {currentPage + 1} of {flashcard?.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={GetProgress()}
            width={width * 0.85}
            color={Colors.WHITE}
            unfilledColor={"rgba(255,255,255,0.3)"} // Thêm màu nền mờ cho đẹp
            borderWidth={0} // Bỏ viền cho hiện đại
            height={8}
            borderRadius={5}
          />
        </View>

        {/* Flashcard List */}
        <FlatList
          data={flashcard}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          
          // Các props quan trọng để snap (căn giữa)
          snapToInterval={width * 0.85} // Khoảng cách snap bằng đúng width item
          snapToAlignment="center"
          decelerationRate="fast"
          pagingEnabled={false} // Tắt paging mặc định để dùng snapToInterval
          contentContainerStyle={{
            paddingHorizontal: (width - (width * 0.85)) / 2, // Căn giữa item đầu và cuối
          }}
          
          onScroll={onScroll}
          scrollEventThrottle={16} // Giúp sự kiện scroll mượt hơn
          
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                width: width * 0.85, // Kích thước cố định cho mỗi item
                height: 500,
                marginTop: 40,
                paddingHorizontal: 10, // Tạo khoảng cách giữa các thẻ
              }}
            >
              <FlipCard 
                style={styles.flipCard}
                friction={6} // Tinh chỉnh tốc độ lật
                perspective={1000}
                flipHorizontal={true}
                flipVertical={false}
              >
                {/* Mặt trước */}
                <View style={styles.frontCard}>
                   <ScrollView 
                      contentContainerStyle={styles.cardContent}
                      showsVerticalScrollIndicator={false}
                   >
                      <Text style={styles.frontText}>{item?.front}</Text>
                   </ScrollView>
                   
                   {/* Gợi ý icon lật */}
                   <View style={styles.flipIcon}>
                      <Ionicons name="repeat" size={35} color={Colors.PRIMARY} />
                      <Text style={{fontSize: 16, color: Colors.PRIMARY}}>Tap to flip</Text>
                   </View>
                </View>

                {/* Mặt sau */}
                <View style={styles.backCard}>
                  <ScrollView 
                      contentContainerStyle={styles.cardContent}
                      showsVerticalScrollIndicator={false}
                   >
                      <Text style={styles.backText}>{item?.back}</Text>
                  </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: Colors.BG_GRAY,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50, // Tránh status bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  pageCounter: {
    fontSize: 20,
    fontFamily: "outfit-bold", // Giả sử bạn có font này, nếu lỗi font hãy đổi về 'System'
    color: Colors.WHITE,
  },
  progressBarContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  flipCard: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    // Shadow đẹp hơn
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Bóng đổ cho Android
    borderWidth: 0, // Xoá border mặc định của thư viện nếu có
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  frontCard: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backCard: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  frontText: {
    fontFamily: "outfit-bold",
    fontSize: 26,
    textAlign: "center",
    lineHeight: 34,
  },
  backText: {
    fontFamily: "outfit",
    fontSize: 24,
    textAlign: "center",
    color: Colors.WHITE,
    lineHeight: 32,
  },
  flipIcon: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    opacity: 0.6
  }
});