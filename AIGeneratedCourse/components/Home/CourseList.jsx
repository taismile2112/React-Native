import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { imageAssets } from '../../constant/Option'
import Colors from '../../constant/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
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
                <Image source={imageAssets[item.banner_image]}
                    style = {{
                        width: '100%',
                        height: 150,
                        borderRadius: 15,

                    }}
                />
                <Text 
                numberOfLines={2}
                style = {{
                    fontFamily: 'outfit-bold',
                    fontSize: 18,
                    marginTop: 10,
                }}>{item?.courseTitle}</Text>
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
    width: 270,
  }
})
