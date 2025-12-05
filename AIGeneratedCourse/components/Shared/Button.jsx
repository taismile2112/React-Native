import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors';

export default function Button({ text, type = 'fill', onPress, loading, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8} // Hiệu ứng mờ nhẹ khi nhấn
      style={[
        styles.buttonBase,
        type === 'fill' ? styles.buttonFill : styles.buttonOutline,
        style // Cho phép override style từ bên ngoài nếu cần
      ]}
    >
      {!loading ? (
        <Text
          style={[
            styles.textBase,
            type === 'fill' ? styles.textFill : styles.textOutline
          ]}
        >
          {text}
        </Text>
      ) : (
        <ActivityIndicator
          size="small"
          color={type === 'fill' ? Colors.WHITE : Colors.PRIMARY}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    padding: 16, // Tăng padding một chút cho nút cao hơn
    width: '100%',
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFill: {
    backgroundColor: Colors.PRIMARY,
    // Shadow cho iOS
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Shadow cho Android
    elevation: 5, 
    borderWidth: 0, // Nút fill thường không cần border
  },
  buttonOutline: {
    backgroundColor: Colors.WHITE,
    // Outline không cần shadow hoặc shadow rất nhẹ
  },
  textBase: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'outfit-bold', // Dùng font bold cho nút bấm rõ ràng hơn
  },
  textFill: {
    color: Colors.WHITE,
  },
  textOutline: {
    color: Colors.PRIMARY,
  }
});