import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function FadeInView({ children, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Giá trị độ mờ ban đầu = 0
  const isFocused = useIsFocused(); // Kiểm tra xem người dùng có đang ở Tab này không

  useEffect(() => {
    if (isFocused) {
      // Khi tab được chọn -> Fade từ 0 lên 1
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // 👈 Chỉnh tốc độ hiện ở đây (500ms là vừa đẹp)
        useNativeDriver: true,
      }).start();
    } else {
        // Khi rời tab -> Reset về 0 (để lần sau quay lại lại fade tiếp)
        fadeAnim.setValue(0);
    }
  }, [isFocused]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim, // Gắn giá trị animation vào độ mờ
          flex: 1,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}