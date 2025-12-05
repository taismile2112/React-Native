// (tabs)\explore.jsx
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import { CourseCategory } from "../../constant/Option";
import CourseListByCatogery from "../../components/Explore/CourseListByCategory";
import SearchCourseList from "../../components/Explore/SearchCourseList"; // <--- Import file mới
import { Ionicons } from "@expo/vector-icons"; // <--- Import icon
import FadeInView from "../../components/Common/FadeInView";

export default function Explore() {
  const [searchInput, setSearchInput] = useState(''); // State lưu từ khóa tìm kiếm

  return (
    <FadeInView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
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

          {/* --- Search Bar --- */}
          <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 0,
              borderRadius: 8,
              marginTop: 20,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              elevation: 2
          }}>
              <Ionicons name="search" size={24} color={Colors.GRAY} style={{marginRight: 10}} />
              <TextInput 
                  placeholder="Tìm kiếm khóa học..." 
                  style={{fontFamily: 'outfit', fontSize: 16, flex: 1}}
                  onChangeText={(text) => setSearchInput(text)}
                  value={searchInput}
              />
              {searchInput.length > 0 && (
                <TouchableOpacity onPress={() => setSearchInput('')}>
                    <Ionicons name="close-circle" size={24} color={Colors.GRAY} />
                </TouchableOpacity>
              )}
          </View>
          {/* ------------------------------- */}

          {/* --- LOGIC HIỂN THỊ --- */}
          {searchInput.length > 0 ? (
            // Nếu CÓ nhập tìm kiếm -> Hiện Component Tìm Kiếm Mới
            <SearchCourseList searchQuery={searchInput} />
          ) : (
            // Nếu KHÔNG nhập gì -> Hiện danh sách danh mục Cũ
            <View>
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
          )}
          {/* ---------------------- */}

        </View>
      }
    />
    </FadeInView>
  );
}