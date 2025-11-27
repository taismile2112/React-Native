import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView} from 'react-native';
import Button from '../../components/Shared/Button';
import { GenerateTopicsAIModel, GenerateCourseAIModel } from '../../config/AIModel'; //.
import Colors from '../../constant/Colors';
import Prompt from '../../constant/Prompt';
import { dismissBrowser } from 'expo-web-browser';
import {db} from '../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useRouter } from 'expo-router';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const {userDetail, setUserDetail} = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState('');//. 
  const [topics, setTopics] = useState([]);//.
  const [selectedTopics, setSelectedTopics] = useState([]);//.
  const router = useRouter();


  const onGeneratedTopic = async () => {
    setLoading(true);

    try {
      const PROMPT = userInput + Prompt.IDEA;

      // Gọi API
      const aiResp = await GenerateTopicsAIModel(PROMPT);
      console.log("👉 RAW AI RESPONSE:", aiResp);

      // Chuẩn hóa về string
      const raw = typeof aiResp === "string" ? aiResp : JSON.stringify(aiResp);

      // Parse JSON
      const parsed = JSON.parse(raw);

      // Lấy đúng mảng course_titles
      const topics = parsed.course_titles ?? [];

      console.log("👉 PARSED TOPICS:", JSON.stringify(topics, null, 2));

      // Cập nhật UI
      setTopics(topics);

    } catch (err) {
      console.error("❌ Lỗi khi xử lý AI:", err);
      setTopics([]); // fallback nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  const onTopicSelect = (topic) => {
    const isAlreadyExist=selectedTopics.find((item) => item==topic);
    if(!isAlreadyExist){
      setSelectedTopics(prev =>[...prev, topic]);

    }else {
      const topics=selectedTopics.filter(item => item!==topic);
      setSelectedTopics(topics);
    }
  }

  const isTopicSelected = (topic) => {
    const selection=selectedTopics.find(item => item==topic);
    return selection?true:false;
  }

  /*
  * Used to Generate Course Using AI Model
  */
const onGenerateCourse = async () => {
  setLoading(true);

  try {
    const PROMPT =
    JSON.stringify(selectedTopics) + "\n\n" + Prompt.COURSE;

    const aiResp = await GenerateCourseAIModel(PROMPT);

    if (aiResp.error) {
    console.log("❌ JSON ERROR - RAW AI:", aiResp.rawText);
    return;
    }

    const courses = aiResp.courses;
    // console.log("COURSES:", JSON.stringify(courses, null, 2));
    console.log("👉 COURSES:", courses);

    // Lưu Firestore
    courses.forEach(async (course) => {
      const docId = Date.now().toString();
      await setDoc(
      doc(db, "courses", docId), 
      {
        ...course,
        createdOn: serverTimestamp(),
        createdBy: userDetail?.email || null,
        docId: docId,
      }
    );
  });


    router.push("/(tabs)/home");
  } catch (err) {
    console.error("❌ Error Generate Course:", err);
  } finally {
    setLoading(false);
  }
};







  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    // contentContainerStyle={{ paddingBottom: 50 }}
    >


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
        numberOfLines={3}
        multiline={true}
        onChangeText={(value) => setUserInput(value)}//.
      />

      <Button
        text="Generate Topic"
        type="outline"
        onPress={onGeneratedTopic}
        loading={loading}
      />

      <View style = {{
        marginTop: 15,
        marginBottom: 10,
      }}>
        <Text style = {{
          fontFamily: 'outfit',
          fontSize: 20,
        }}>Select all topics which you want to add in the course</Text>

        <View style = {{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 6,
          
        }}>
          {topics.map((item, index ) => (
            <Pressable
              key={index}
              onPress={() => onTopicSelect(item)}
              style={{
                flexShrink: 1,
              }}
            >
              <View
                style={{
                  flexShrink: 1,
                  paddingVertical: 7,
                  paddingHorizontal: 15,
                  borderWidth: 0.4,
                  borderRadius: 99,
                  backgroundColor: isTopicSelected(item) ? Colors.PRIMARY : Colors.WHITE,
                  alignSelf: "flex-start",
                  maxWidth: "100%", // 🟢 ngăn tràn ra ngoài màn hình
                }}
              >
                <Text
                  style={{
                    color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY,
                  }}
                >
                  {item}
                </Text>
              </View>
            </Pressable>
          ))
          }
        </View>
      </View>

      
      {selectedTopics.length > 0 && <Button text="Generate Course" 
        onPress={() => onGenerateCourse()}
        loading={loading}
      ></Button> }
    </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    minHeight: '100%',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    paddingTop: 30,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 25,
  },
  description: {
    fontFamily: 'outfit',
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
    alignItems: 'flex-start',
    fontSize: 18,
  },
});
