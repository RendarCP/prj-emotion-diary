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
  Platform,
} from "react-native";
import {
  useRoute,
  useNavigation,
  RouteProp,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, DiaryEntry, BottomTabParamList } from "../types";
import { getDiaryEntryById, deleteDiaryEntry } from "../utils/storage";
import { formatDateToKorean } from "../utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

type DetailScreenRouteProp = RouteProp<RootStackParamList, "Detail">;
type DetailScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "Detail">,
  BottomTabNavigationProp<BottomTabParamList>
>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = route.params;
  const insets = useSafeAreaInsets();

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

  const handleBackPress = () => {
    navigation.goBack();
  };

  // 감정에 따른 배경색 설정
  const getBackgroundColor = () => {
    if (!diaryEntry) return "#ffffff";

    switch (diaryEntry.emotion.id) {
      case 1: // 행복
        return "#e8f5e9";
      case 2: // 좋음
        return "#ebfbee";
      case 3: // 보통
        return "#e7f5ff";
      case 4: // 나쁨
        return "#f8f9fa";
      case 5: // 슬픔
        return "#f3f0ff";
      case 6: // 화남
        return "#fff5f5";
      default:
        return "#ffffff";
    }
  };

  // 날짜 포맷팅 (YYYY년 MM월 DD일 요일 형식)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${weekday}요일`;
  };

  if (loading) {
    return (
      <SafeAreaWrapper style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#228be6" />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!diaryEntry) {
    return (
      <SafeAreaWrapper style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>일기를 찾을 수 없습니다.</Text>
          <TouchableOpacity
            style={styles.backToListButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backToListButtonText}>목록으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>

        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            style={styles.headerButtonFilled}
            onPress={handleEditPress}
          >
            <Text style={styles.headerButtonFilledText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButtonOutline}
            onPress={handleDeletePress}
          >
            <Text style={styles.headerButtonOutlineText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View
            style={[
              styles.contentContainer,
              { backgroundColor: getBackgroundColor() },
            ]}
          >
            <Text style={styles.title}>{diaryEntry.emotion.name}</Text>
            <Text style={styles.date}>
              {formatDate(diaryEntry.date).split(" ")[0]}{" "}
              {formatDate(diaryEntry.date).split(" ")[1]}{" "}
              {formatDate(diaryEntry.date).split(" ")[2]}
            </Text>

            <Text style={styles.contentText}>{diaryEntry.content}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  backToListButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerRightButtons: {
    flexDirection: "row",
  },
  headerButtonFilled: {
    marginLeft: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerButtonFilledText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  headerButtonOutline: {
    marginLeft: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerButtonOutlineText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  contentContainer: {
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});

export default DetailScreen;
