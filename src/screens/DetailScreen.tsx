import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, DiaryEntry } from "../types";
import { getDiaryEntryById, deleteDiaryEntry } from "../utils/storage";
import { formatDateToKorean } from "../utils/date";

type DetailScreenRouteProp = RouteProp<RootStackParamList, "Detail">;
type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Detail"
>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = route.params;

  useEffect(() => {
    loadDiaryEntry();
  }, [id]);

  const loadDiaryEntry = async () => {
    setLoading(true);
    try {
      const entry = await getDiaryEntryById(id);
      setDiaryEntry(entry);
    } catch (error) {
      console.error("일기 불러오기 오류:", error);
      Alert.alert("오류", "일기를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    navigation.navigate("Edit", { id });
  };

  const handleDeletePress = () => {
    Alert.alert("일기 삭제", "정말로 이 일기를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDiaryEntry(id);
            Alert.alert("성공", "일기가 삭제되었습니다.", [
              { text: "확인", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("일기 삭제 오류:", error);
            Alert.alert("오류", "일기 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
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
          <Text style={styles.headerButton}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일기 상세</Text>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            style={styles.headerButtonContainer}
            onPress={handleEditPress}
          >
            <Text style={styles.headerButton}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButtonContainer}
            onPress={handleDeletePress}
          >
            <Text style={[styles.headerButton, styles.deleteButton]}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.date}>{formatDateToKorean(diaryEntry.date)}</Text>

        <View
          style={[
            styles.emotionContainer,
            { borderColor: diaryEntry.emotion.color },
          ]}
        >
          <Text style={styles.emotionIcon}>{diaryEntry.emotion.icon}</Text>
          <Text
            style={[styles.emotionText, { color: diaryEntry.emotion.color }]}
          >
            {diaryEntry.emotion.name}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{diaryEntry.content}</Text>
        </View>
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
  headerRightButtons: {
    flexDirection: "row",
  },
  headerButtonContainer: {
    marginLeft: 16,
  },
  deleteButton: {
    color: "#e03131",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  date: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 16,
    textAlign: "center",
  },
  emotionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 20,
  },
  emotionIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  emotionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default DetailScreen;
