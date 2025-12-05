import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constant/Colors';

export default function HeaderProgress({ step = 0 }) {
  // step = 0: Nhập liệu
  // step = 1: Chọn Topic
  
  return (
    <View style={styles.container}>
      {/* Thanh tiến trình */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.activeBar]} />
        <View 
          style={[
            styles.progressBar, 
            step >= 1 ? styles.activeBar : styles.inactiveBar
          ]} 
        />
      </View>

      {/* Nội dung text thay đổi theo bước */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Create New Course</Text>
        
        <Text style={styles.subtitle}>
            {step === 0 ? "What do you want to learn?" : "Select Your Topics"}
        </Text>

        <Text style={styles.description}>
            {step === 0 
              ? "Write what course you want to create (Ex. Learn React Js, Digital Marketing Guide, etc ...)" 
              : "Choose the topics you want to include in your course curriculum."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 7, 
    borderRadius: 10, 
  },
  activeBar: {
    backgroundColor: Colors.PRIMARY,
  },
  inactiveBar: {
    backgroundColor: '#E0E0E0', 
  },
  textContainer: {
    gap: 5,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.BLACK,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 20,
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  description: {
    fontFamily: "outfit",
    fontSize: 16,
    marginTop: 5,
    color: Colors.GRAY,
    lineHeight: 22,
  },
});