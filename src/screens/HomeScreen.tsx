import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, DiaryEntry, Emotion } from "../types";
import { getDiaryEntries } from "../utils/storage";
import DiaryItem from "../components/DiaryItem";
import WeatherCard, { WeatherType } from "../components/WeatherCard";
import EmotionCard from "../components/EmotionCard";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BottomTabs"
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeather, setSelectedWeather] = useState<
    WeatherType | undefined
  >(undefined);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(
    undefined
  );

  useEffect(() => {
    // 화면이 포커스를 받을 때마다 데이터 새로고침
    const unsubscribe = navigation.addListener("focus", () => {
      loadDiaryEntries();
    });

    return unsubscribe;
  }, [navigation]);

  const loadDiaryEntries = async () => {
    setLoading(true);
    try {
      const entries = await getDiaryEntries();
      // 날짜 기준 내림차순 정렬 (최신순)
      const sortedEntries = entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDiaryEntries(sortedEntries);
    } catch (error) {
      console.error("일기 목록 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiaryItemPress = (id: string) => {
    navigation.navigate("Detail", { id });
  };

  const handleCreatePress = () => {
    navigation.navigate("Create");
  };

  // 날씨 선택 핸들러
  const handleWeatherSelect = (weather: WeatherType) => {
    setSelectedWeather(weather);
  };

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>감정 일기장</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePress}
        >
          <Text style={styles.createButtonText}>새 일기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>
            안녕하세요! 오늘 하루는 어떠셨나요?
          </Text>

          {/* 날씨 카드 */}
          <WeatherCard
            onSelectWeather={handleWeatherSelect}
            selectedWeather={selectedWeather}
          />

          {/* 감정 카드 */}
          <EmotionCard
            onSelectEmotion={handleEmotionSelect}
            selectedEmotion={selectedEmotion}
          />

          {/* 일기 작성 버튼 */}
          {selectedWeather && selectedEmotion && (
            <TouchableOpacity
              style={styles.writeButton}
              onPress={handleCreatePress}
            >
              <Text style={styles.writeButtonText}>오늘의 일기 작성하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#228be6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  writeButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
