import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Colors from '../../constant/Colors';

export default function TopicSelector({ topics, selectedTopics, onTopicSelect }) {
  
  const isTopicSelected = (topic) => selectedTopics.includes(topic);

  return (
    <View style={styles.topicsSection}>
      <Text style={styles.topicsTitle}>Select topics to include:</Text>
      
      {topics.length === 0 ? (
          <Text style={styles.noTopicsText}>
             ⚠️ No topics found. Please try again with a different idea.
          </Text>
      ) : (
          <View style={styles.topicList}>
            {topics.map((topic, index) => {
              const isSelected = isTopicSelected(topic);
              return (
                <Pressable
                  key={index}
                  onPress={() => onTopicSelect(topic)}
                  style={[
                    styles.topicTag,
                    isSelected ? styles.topicSelected : styles.topicUnselected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.WHITE} style={{ marginRight: 6 }} />
                  )}
                  <Text style={{ fontFamily: 'outfit', color: isSelected ? Colors.WHITE : Colors.PRIMARY }}>
                    {topic}
                  </Text>
                </Pressable>
              );
            })}
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topicsSection: { marginTop: 25 },
  topicsTitle: { fontFamily: "outfit-bold", fontSize: 18, marginBottom: 12 },
  topicList: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  topicTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderRadius: 12 
  },
  topicSelected: { 
    backgroundColor: Colors.PRIMARY, 
    borderColor: Colors.PRIMARY,
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  topicUnselected: { 
    backgroundColor: Colors.WHITE, 
    borderColor: '#E0E0E0' 
  },
  noTopicsText: {
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginTop: 10,
    fontStyle: "italic",
  },
});