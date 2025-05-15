import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, DiaryEntry, Emotion } from "../types";
import { getDiaryEntryById, updateDiaryEntry } from "../utils/storage";
import { formatDateToKorean } from "../utils/date";
import EmotionSelector from "../components/EmotionSelector";
import DiaryTextInput from "../components/DiaryTextInput";

type EditScreenRouteProp = RouteProp<RootStackParamList, "Edit">;
type EditScreenNavigationProp = StackNavigationProp<RootStackParamList, "Edit">;

const EditScreen: React.FC = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<EditScreenNavigationProp>();
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [content, setContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const { id } = route.params;

  useEffect(() => {
    loadDiaryEntry();
  }, [id]);

  const loadDiaryEntry = async () => {
    setLoading(true);
    try {
      const entry = await getDiaryEntryById(id);
      if (entry) {
        setDiaryEntry(entry);
        setContent(entry.content);
        setSelectedEmotion(entry.emotion);
      }
    } catch (error) {
      console.error("일기 불러오기 오류:", error);
      Alert.alert("오류", "일기를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleSave = async () => {
    if (!diaryEntry || !selectedEmotion) return;

    // 입력 검증
    if (content.trim().length < 5) {
      Alert.alert("알림", "일기 내용은 최소 5자 이상 입력해주세요.");
      return;
    }

    try {
      const updatedEntry: DiaryEntry = {
        ...diaryEntry,
        emotion: selectedEmotion,
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };

      await updateDiaryEntry(updatedEntry);
      Alert.alert("성공", "일기가 수정되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("일기 수정 오류:", error);
      Alert.alert("오류", "일기 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#228be6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!diaryEntry) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>일기를 찾을 수 없습니다.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>일기 수정</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateText}>
          {formatDateToKorean(diaryEntry.date)}
        </Text>

        <EmotionSelector
          onEmotionSelect={handleEmotionSelect}
          selectedEmotion={selectedEmotion}
        />

        <DiaryTextInput value={content} onChangeText={handleContentChange} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#228be6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
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
});

export default EditScreen;
