import { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import Button from "../../components/Shared/Button";
import {
  GenerateTopicsAIModel,
  GenerateCourseAIModel,
} from "../../config/AIModel";
import Colors from "../../constant/Colors";
import Prompt from "../../constant/Prompt";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useRouter } from "expo-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const router = useRouter();
  const [hasGeneratedTopics, setHasGeneratedTopics] = useState(false);

  const onGeneratedTopic = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setTopics([]);
    setSelectedTopics([]);
    try {
      const PROMPT = userInput + Prompt.IDEA;
      const topicsResponse = await GenerateTopicsAIModel(PROMPT);

      if (!topicsResponse || topicsResponse.error) {
        setTopics([]);
        console.warn(
          "⚠️ Không lấy được topics từ AI. Raw data:",
          topicsResponse.raw
        );
      } else {
        setTopics(topicsResponse.course_titles || []);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy topics:", err);
      setTopics([]);
    } finally {
      setLoading(false);
      setHasGeneratedTopics(true);
    }
  };

  const onTopicSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const isTopicSelected = (topic) => selectedTopics.includes(topic);

  const onGenerateCourse = async () => {
    if (selectedTopics.length === 0) return;
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(selectedTopics) + "\n\n" + Prompt.COURSE;
      const coursesResponse = await GenerateCourseAIModel(PROMPT);
      const coursesArray = coursesResponse?.courses;

      if (coursesResponse.error || !Array.isArray(coursesArray)) {
        console.warn(
          "⚠️ Không lấy được courses từ AI hoặc cấu trúc JSON không đúng."
        );
        return;
      }

      for (const course of coursesArray) {
        const docId = Date.now().toString();
        await setDoc(doc(db, "courses", docId), {
          ...course,
          createdOn: serverTimestamp(),
          createdBy: userDetail?.email || null,
          docId,
        });
      }

      router.push("/(tabs)/home");
    } catch (err) {
      console.error("❌ Lỗi generate course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Create New Course</Text>
        <Text style={styles.subtitle}>What do you want to learn today?</Text>

        <Text style={styles.description}>
          Write what course you want to create (Ex. Learn React Js, Digital
          Marketing Guide, 10th Science Chapter, etc ...)
        </Text>

        <TextInput
          placeholder="(Ex. Learn React Native, Learn Python, ... )"
          style={styles.textInput}
          multiline
          numberOfLines={3}
          onChangeText={setUserInput}
          value={userInput}
          editable={!loading}
        />

        <Button
          text="Generate Topic"
          type="outline"
          onPress={onGeneratedTopic}
          loading={loading}
          disabled={loading}
        />

        {hasGeneratedTopics && (
          <View style={styles.topicsSection}>
            <Text style={styles.topicsTitle}>
              Select topics to add in the course
            </Text>

            {topics.length === 0 ? (
              <Text style={styles.noTopicsText}>
                ⚠️ Không tìm thấy topics nào. Vui lòng thử lại với nội dung khác.
              </Text>
            ) : (
              <View style={styles.topicList}>
                {topics.map((topic, index) => (
                  <Pressable
                    key={index}
                    onPress={() => onTopicSelect(topic)}
                    disabled={loading}
                  >
                    <View
                      style={[
                        styles.topicTag,
                        isTopicSelected(topic)
                          ? styles.topicSelected
                          : styles.topicUnselected,
                      ]}
                    >
                      <Text
                        style={{
                          color: isTopicSelected(topic)
                            ? Colors.WHITE
                            : Colors.PRIMARY,
                        }}
                      >
                        {topic}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {selectedTopics.length > 0 && (
          <Button
            text="Generate Course"
            onPress={onGenerateCourse}
            loading={loading}
            disabled={loading}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    minHeight: "100%",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    paddingTop: 30,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 25,
  },
  description: {
    fontFamily: "outfit",
    fontSize: 20,
    marginTop: 8,
    color: Colors.GRAY,
  },
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    fontSize: 18,
    textAlignVertical: "top",
  },
  topicsSection: {
    marginTop: 15,
    marginBottom: 10,
  },
  topicsTitle: {
    fontFamily: "outfit",
    fontSize: 20,
  },
  topicList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  topicTag: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderWidth: 0.4,
    borderRadius: 99,
    maxWidth: "100%",
  },
  topicSelected: {
    backgroundColor: Colors.PRIMARY,
  },
  topicUnselected: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY,
  },
  noTopicsText: {
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginTop: 10,
    fontStyle: "italic",
  },
});
