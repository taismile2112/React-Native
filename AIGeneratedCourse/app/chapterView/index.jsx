import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function ChapterView() {
  const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
  const chapters = JSON.parse(chapterParams);

  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const GetProgress = () => {
    return currentPage / chapters?.content?.length;
  };

  const onChapterComplete = async () => {
    setLoader(true);

    await updateDoc(doc(db, 'courses', docId), {
      completedChapter: arrayUnion(chapterIndex),
    });

    setLoader(false);
    router.replace('/courseView/' + docId);
  };

  return (
    <View style={styles.container}>
        
      {/* STICKY PROGRESS BAR */}
      <View style={styles.stickyProgress}>
        <Progress.Bar
          progress={GetProgress()}
          width={Dimensions.get('screen').width * 0.9 }
          height={23}
        />
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 120 }}  
      >
        <Text style={styles.topic}>
          {chapters?.content[currentPage]?.topic}
        </Text>

        <Text style={styles.explain}>
          {chapters?.content[currentPage]?.explain}
        </Text>

        {chapters?.content[currentPage]?.code && (
          <Text style={[styles.codeExampleText, styles.codeDark]}>
            {chapters?.content[currentPage]?.code}
          </Text>
        )}

        {chapters?.content[currentPage]?.example && (
          <Text style={styles.codeExampleText}>
            {chapters?.content[currentPage]?.example}
          </Text>
        )}
      </ScrollView>

      {/* BOTTOM NEXT / FINISH BUTTON */}
      <View style={styles.bottomButton}>
        {chapters?.content?.length - 1 !== currentPage ? (
          <Button text={'Next'} onPress={() => setCurrentPage(currentPage + 1)} />
        ) : (
          <Button text={'Finish'} onPress={onChapterComplete} loading={loader} />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  stickyProgress: {
    position: 'absolute',
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
  },

  topic: {
    fontFamily: 'outfit-bold',
    fontSize: 25,
    paddingHorizontal: 25,
    marginBottom: 10,
  },

  explain: {
    fontFamily: 'outfit',
    fontSize: 15,
    paddingHorizontal: 25,
    textAlign: 'justify',
  },

  codeExampleText: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    fontFamily: 'outfit',
    fontSize: 13,
    marginTop: 15,
    marginHorizontal: 25,
  },

  codeDark: {
    backgroundColor: Colors.BLACK,
    color: Colors.WHITE,
  },

  bottomButton: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    width: '100%',
    paddingHorizontal: 25,
  },
});
