import { View, Text, FlatList } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { CourseCategory } from "../../constant/Option";
import CourseListByCatogery from "../../components/Explore/CourseListByCategory";

export default function Explore() {
  return (
    <FlatList
      style={{
        backgroundColor: Colors.WHITE,
        flex: 1,
      }}
      data={[]}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            backgroundColor: Colors.WHITE,
            flex: 1,
          }}
        >
          <Text
            style={{
              marginTop: 10,
              fontFamily: "outfit-bold",
              fontSize: 24,
              color: Colors.WHITE,
              textAlign: 'center',
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              borderRadius: 10,
              backgroundColor: '#0b76f8ff',
              elevation: 3,
            }}
          >
            📖 More Courses 
          </Text>

          {CourseCategory.map((item, index) => (
            <View
              key={index}
              style={{
                marginTop: 3,
              }}
            >
              <CourseListByCatogery category={item} />
            </View>
          ))}
        </View>
      }
    />
  );
}
