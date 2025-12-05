import { useContext, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// UI Components
import HeaderProgress from "../../components/AddCourse/HeaderProgress";
import CourseInput from "../../components/AddCourse/CourseInput";
import TopicSelector from "../../components/AddCourse/TopicSelector";
import Button from "../../components/Shared/Button";

// Configs & Context
import { GenerateTopicsAIModel, GenerateCourseAIModel } from "../../config/AIModel";
import Colors from "../../constant/Colors";
import Prompt from "../../constant/Prompt";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const router = useRouter();

  // Step logic: 0 if no topics, 1 if topics generated
  const currentStep = topics.length > 0 ? 1 : 0;

  // --- HANDLER: GENERATE TOPICS ---
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
        console.warn("⚠️ AI Error:", topicsResponse.raw);
      } else {
        setTopics(topicsResponse.course_titles || []);
      }
    } catch (err) {
      console.error("❌ Topics Error:", err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: SELECT TOPIC ---
  const onTopicSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // --- HANDLER: GENERATE COURSE ---
  const onGenerateCourse = async () => {
    if (selectedTopics.length === 0) return;
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(selectedTopics) + "\n\n" + Prompt.COURSE;
      const coursesResponse = await GenerateCourseAIModel(PROMPT);
      const coursesArray = coursesResponse?.courses;

      if (coursesResponse.error || !Array.isArray(coursesArray)) {
        console.warn("⚠️ Course AI Error or Invalid JSON");
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
      console.error("❌ Generate Course Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: Colors.WHITE }}>
      <View style={styles.container}>
        
        {/* 1. Header & Progress */}
        <HeaderProgress step={currentStep} />

        {/* 2. Input Section */}
        <CourseInput 
            userInput={userInput}
            setUserInput={setUserInput}
            loading={loading}
            onGenerateTopic={onGeneratedTopic}
        />

        {/* 3. Topic Selection (Only show if topics exist) */}
        {topics.length > 0 && (
            <TopicSelector 
                topics={topics}
                selectedTopics={selectedTopics}
                onTopicSelect={onTopicSelect}
            />
        )}

        {/* 4. Final Submit Button */}
        {selectedTopics.length > 0 && (
          <View style={{ marginTop: 20, marginBottom: 50 }}>
             <Button
                text="Generate Course"
                onPress={onGenerateCourse}
                loading={loading}
                disabled={loading}
             />
          </View>
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
});