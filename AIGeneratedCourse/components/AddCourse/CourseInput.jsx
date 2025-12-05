import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Button from '../Shared/Button'; 
import Colors from '../../constant/Colors';

export default function CourseInput({ userInput, setUserInput, loading, onGenerateTopic }) {
  return (
    <View>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Input your Idea here..."
          style={styles.textInput}
          multiline
          numberOfLines={3}
          onChangeText={setUserInput}
          value={userInput}
          editable={!loading}
        />
        {/* Icon trang trí */}
        <View style={styles.inputIcon}>
           <Ionicons name="sparkles" size={24} color={Colors.PRIMARY} />
        </View>
      </View>

      <Button
        text={loading ? "Generating Topics..." : "Generate Topic"}
        type="outline"
        onPress={onGenerateTopic}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { 
    position: 'relative', 
    marginTop: 20, 
    marginBottom: 20 
  },
  textInput: { 
    padding: 20, 
    borderWidth: 1, 
    borderRadius: 20, 
    height: 120, 
    fontSize: 18, 
    textAlignVertical: "top", 
    borderColor: '#E0E0E0', 
    backgroundColor: '#FAFAFA',
    // Shadow styling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2, 
  },
  inputIcon: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    opacity: 0.8 
  },
});