import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { imageAssets } from '../../constant/Option'
import Colors from '../../constant/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function CourseList({courseList, heading="courses", enroll=false}) {
    const router = useRouter();

    return (
    <View style = {{
        marginTop: 15,
    }}>
      <Text style = {{
        fontFamily : 'outfit-bold',
        fontSize: 25,
        marginBottom: 10 // Thêm khoảng cách nhỏ ở đây
      }}>{heading}</Text>

      <FlatList 
        data={courseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem ={({item, index}) => (
            <TouchableOpacity
                onPress={() =>router.push({
                    pathname: '/courseView/'+item?.docId,
                    params: {
                        courseParams: JSON.stringify(item),
                        enroll: enroll,
                    }
                })}
                key={index} style={styles.courseContainer}>
                
                {/* 1. Hình ảnh khóa học */}
                <Image source={imageAssets[item.banner_image]}
                    style = {{
                        width: '100%',
                        height: 150,
                        borderRadius: 15,
                    }}
                />

                <View style={{ padding: 5 }}> 
                    {/* 👇 2. MỚI THÊM: Tên Danh Mục (Category) */}
                    <View style={{
                        marginTop: 8,
                        marginBottom: 2,
                        alignSelf: 'flex-start',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        backgroundColor: '#e6f2ff', // Màu nền xanh nhạt
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 12,
                            color: '#0b76f8ff' // Màu chữ xanh dương (Primary)
                        }}>
                            {item?.category}
                        </Text>
                    </View>
                    {/* 👆 KẾT THÚC PHẦN MỚI THÊM */}

                    {/* 3. Tên khóa học */}
                    <Text 
                    numberOfLines={2}
                    style = {{
                        fontFamily: 'outfit-bold',
                        fontSize: 18,
                        marginTop: 5, // Chỉnh lại margin cho cân đối
                    }}>{item?.courseTitle}</Text>
                    
                    {/* 4. Số chương (Chapters) */}
                    <View style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        marginTop: 5,
                    }}>
                        <Ionicons name="book-outline" size={24} color="black" />
                        <Text style = {{
                        fontFamily: 'outfit',
                        }}>{item?.chapters?.length} Chapters</Text>
                    </View>
                </View>
                
            </TouchableOpacity>
        )} />
    </View>
  )
}

const styles = StyleSheet.create({
  courseContainer: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    margin: 6,
    borderRadius: 15,
    elevation: 2,
    borderWidth: 0.1,
    width: 270, // Chiều rộng thẻ
  }
})