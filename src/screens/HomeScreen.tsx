import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, DiaryEntry, Emotion } from "../types";
import { getDiaryEntries } from "../utils/storage";
import DiaryItem from "../components/DiaryItem";
import WeatherCard, { WeatherType } from "../components/WeatherCard";
import WeatherInfoCard from "../components/WeatherInfoCard";
import EmotionCard from "../components/EmotionCard";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import {
  getCurrentLocationWeather,
  getWeatherByCity,
  getMockWeatherData,
  WeatherData,
} from "../utils/weatherApi";
import * as Location from "expo-location";
import { getWeatherUpdateInterval } from "../utils/storage";

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");

  // 날씨 정보 상태
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(
    undefined
  );
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | undefined>(
    undefined
  );
  // 날씨 데이터 마지막 업데이트 시간 추적
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState<number>(0);
  // 날씨 업데이트 주기 (기본값: 30분)
  const [weatherUpdateInterval, setWeatherUpdateInterval] = useState<number>(
    30 * 60 * 1000
  );

  useEffect(() => {
    // 저장된 날씨 갱신 간격 불러오기
    const loadWeatherInterval = async () => {
      const interval = await getWeatherUpdateInterval();
      setWeatherUpdateInterval(interval);
    };

    loadWeatherInterval();

    // 화면이 첫 로딩될 때만 날씨 데이터 가져오기
    if (!weatherData && lastWeatherUpdate === 0) {
      fetchWeatherData();
    }

    // 처음 렌더링 시 시간 설정
    updateGreeting();

    // 1분마다 시간 업데이트
    const interval = setInterval(() => {
      updateGreeting();
    }, 60000);

    // 일기 항목만 화면 포커스시 매번 업데이트
    const unsubscribe = navigation.addListener("focus", () => {
      loadDiaryEntries();

      // 마지막 날씨 업데이트 후 지정된 시간이 지났고, 자동 갱신이 활성화된 경우(간격 > 0)에만 자동 업데이트
      const currentTime = Date.now();
      if (
        weatherUpdateInterval > 0 &&
        currentTime - lastWeatherUpdate > weatherUpdateInterval
      ) {
        fetchWeatherData();
      }
    });

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation, weatherData, lastWeatherUpdate, weatherUpdateInterval]);

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

  // 시간 및 인사말 업데이트 함수
  const updateGreeting = () => {
    const now = new Date();
    setCurrentTime(now);

    // 시간대별 인사말
    const hours = now.getHours();
    let timeOfDay = "";
    let message = "";

    if (hours >= 5 && hours < 12) {
      timeOfDay = "아침";
      message = "오늘 하루도 활기차게 시작해볼까요?";
    } else if (hours >= 12 && hours < 17) {
      timeOfDay = "점심";
      message = "오늘 하루는 어떻게 보내고 계신가요?";
    } else if (hours >= 17 && hours < 22) {
      timeOfDay = "저녁";
      message = "오늘 하루는 어땠나요?";
    } else {
      timeOfDay = "밤";
      message = "오늘 하루를 마무리해볼까요?";
    }

    setGreeting(`좋은 ${timeOfDay}입니다`);
    setGreetingMessage(message);
  };

  // 날씨 데이터 가져오기
  const fetchWeatherData = async () => {
    setIsLoadingWeather(true);
    setWeatherError(undefined);

    try {
      // 위치 권한 확인 및 날씨 가져오기
      const weatherInfo = await getCurrentLocationWeather();
      setWeatherData(weatherInfo);
      setLastWeatherUpdate(Date.now());

      // 가져온 날씨 타입을 선택된 날씨로 설정 (자동 선택)
      if (weatherInfo.weatherType) {
        setSelectedWeather(weatherInfo.weatherType);
      }
    } catch (error) {
      console.error("날씨 데이터 가져오기 오류:", error);

      // 오류 발생 시 모의 데이터 사용
      const mockData = getMockWeatherData();
      setWeatherData(mockData);
      setSelectedWeather(mockData.weatherType);

      // 오류 메시지 설정
      if (error instanceof Error) {
        if (error.message.includes("위치 권한")) {
          setWeatherError(
            "위치 권한이 거부되었습니다. 위치 권한을 허용하면 현재 위치의 날씨를 볼 수 있습니다."
          );
        } else if (error.message.includes("401")) {
          setWeatherError(
            "날씨 API 인증 키가 유효하지 않습니다. OpenWeatherMap API 키를 확인해주세요."
          );
        } else if (error.message.includes("404")) {
          setWeatherError(
            "현재 위치의 날씨 정보를 찾을 수 없습니다. 다른 위치로 시도해보세요."
          );
        } else {
          setWeatherError(
            "날씨 정보를 가져오는데 실패했습니다. 기본 날씨 정보를 표시합니다."
          );
        }
      } else {
        setWeatherError(
          "날씨 정보를 가져오는데 실패했습니다. 기본 날씨 정보를 표시합니다."
        );
      }
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // 날씨 선택 핸들러
  const handleWeatherSelect = (weather: WeatherType) => {
    setSelectedWeather(weather);
  };

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  // 날씨 새로고침
  const handleRefreshWeather = () => {
    fetchWeatherData();
  };

  return (
    <SafeAreaWrapper excludeEdges={["bottom"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>감정 일기장</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.greetingMessage}>{greetingMessage}</Text>
            <Text style={styles.dateText}>
              {currentTime.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </Text>
          </View>

          {/* 현재 날씨 정보 표시 */}
          <WeatherInfoCard
            weatherData={weatherData}
            isLoading={isLoadingWeather}
            error={weatherError}
            onRefresh={handleRefreshWeather}
          />

          {/* 감정 카드 */}
          {/* <EmotionCard
            onSelectEmotion={handleEmotionSelect}
            selectedEmotion={selectedEmotion}
          /> */}

          {/* 최근 일기 섹션 */}
          <View style={styles.recentDiariesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>최근 일기</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("BottomTabs", { screen: "DiaryList" })
                }
              >
                <Text style={styles.seeAllButton}>전체보기</Text>
              </TouchableOpacity>
            </View>

            {diaryEntries.length === 0 ? (
              <View style={styles.emptyDiaryContainer}>
                <Text style={styles.emptyText}>
                  아직 작성된 일기가 없습니다.{"\n"}첫 번째 일기를 작성해보세요!
                </Text>
              </View>
            ) : (
              <View style={styles.diaryListContainer}>
                {diaryEntries.slice(0, 3).map((entry) => (
                  <DiaryItem
                    key={entry.id}
                    entry={entry}
                    onPress={handleDiaryItemPress}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 하단에 떠 있는 플로팅 버튼 추가 - ScrollView 밖으로 이동 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCreatePress}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaWrapper>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  greetingContainer: {
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
  },
  greetingMessage: {
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2, // 시각적으로 중앙 정렬되도록 미세 조정
  },
  recentDiariesSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    color: "#6200ee",
    fontWeight: "600",
  },
  diaryListContainer: {
    marginTop: 8,
  },
  emptyDiaryContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eeeeee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default HomeScreen;
