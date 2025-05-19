import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Emotion, DiaryEntry } from "../types";
import { getCurrentDate } from "../utils/date";
import { saveDiaryEntry } from "../utils/storage";
import EmotionSelector from "../components/EmotionSelector";
import DiaryTextInput from "../components/DiaryTextInput";

type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Create"
>;

const CreateScreen: React.FC = () => {
  const navigation = useNavigation<CreateScreenNavigationProp>();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(
    undefined
  );
  const [content, setContent] = useState("");

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleSave = async () => {
    // 입력 검증
    if (!selectedEmotion) {
      Alert.alert("알림", "오늘의 감정을 선택해주세요.");
      return;
    }

    if (content.trim().length < 5) {
      Alert.alert("알림", "일기 내용은 최소 5자 이상 입력해주세요.");
      return;
    }

    try {
      const currentDate = getCurrentDate();
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: currentDate,
        emotion: selectedEmotion,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("저장할 일기:", newEntry);
      await saveDiaryEntry(newEntry);
      console.log("일기 저장 완료");

      Alert.alert("성공", "일기가 저장되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("일기 저장 오류:", error);
      Alert.alert("오류", "일기 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 일기 작성</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.dateText}>{getCurrentDate()} 일기</Text>

          <EmotionSelector
            onEmotionSelect={handleEmotionSelect}
            selectedEmotion={selectedEmotion}
          />

          <DiaryTextInput value={content} onChangeText={handleContentChange} />
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    fontSize: 16,
    color: "#228be6",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    textAlign: "center",
  },
  bottomButtonContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateScreen;
