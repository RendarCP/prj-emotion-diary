import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import {
  getWeatherUpdateInterval,
  saveWeatherUpdateInterval,
  DEFAULT_WEATHER_UPDATE_INTERVAL,
} from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";

// 날씨 갱신 간격 옵션 (밀리초 단위)
const weatherUpdateOptions = [
  { label: "수동 갱신만", value: 0 },
  { label: "10분마다", value: 10 * 60 * 1000 },
  { label: "30분마다", value: 30 * 60 * 1000 },
  { label: "1시간마다", value: 60 * 60 * 1000 },
  { label: "3시간마다", value: 3 * 60 * 60 * 1000 },
  { label: "6시간마다", value: 6 * 60 * 60 * 1000 },
];

const SettingsScreen: React.FC = () => {
  const [weatherInterval, setWeatherInterval] = useState<number>(
    DEFAULT_WEATHER_UPDATE_INTERVAL
  );
  const [showWeatherOptions, setShowWeatherOptions] = useState<boolean>(false);

  useEffect(() => {
    // 저장된 날씨 갱신 간격 불러오기
    const loadWeatherInterval = async () => {
      const interval = await getWeatherUpdateInterval();
      setWeatherInterval(interval);
    };

    loadWeatherInterval();
  }, []);

  const getCurrentWeatherIntervalLabel = () => {
    const option = weatherUpdateOptions.find(
      (opt) => opt.value === weatherInterval
    );
    return option ? option.label : "알 수 없음";
  };

  const handleWeatherIntervalChange = async (interval: number) => {
    try {
      await saveWeatherUpdateInterval(interval);
      setWeatherInterval(interval);
      setShowWeatherOptions(false);
    } catch (error) {
      Alert.alert("오류", "설정을 저장하는 중 오류가 발생했습니다.");
    }
  };

  const settingsOptions = [
    {
      id: "weather",
      title: "날씨 갱신 간격",
      subtitle: getCurrentWeatherIntervalLabel(),
      onPress: () => setShowWeatherOptions(true),
    },
    {
      id: "notification",
      title: "알림 설정",
      subtitle: "알림 시간 및 빈도 설정",
    },
    { id: "theme", title: "테마 설정", subtitle: "앱 테마 변경" },
    { id: "account", title: "계정 관리", subtitle: "로그인 및 계정 정보" },
    { id: "about", title: "앱 정보", subtitle: "버전 및 개발자 정보" },
  ];

  return (
    <SafeAreaWrapper excludeEdges={["bottom"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      <ScrollView style={styles.content}>
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              {option.onPress && (
                <Ionicons name="chevron-forward" size={20} color="#aaa" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 날씨 갱신 간격 선택 모달 */}
      <Modal
        visible={showWeatherOptions}
        transparent={true}
        // animationType="slide"
        onRequestClose={() => setShowWeatherOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>날씨 갱신 간격 설정</Text>
              <TouchableOpacity onPress={() => setShowWeatherOptions(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {weatherUpdateOptions.map((option) => (
                <TouchableOpacity
                  key={option.value.toString()}
                  style={[
                    styles.optionButton,
                    weatherInterval === option.value && styles.selectedOption,
                  ]}
                  onPress={() => handleWeatherIntervalChange(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      weatherInterval === option.value &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {weatherInterval === option.value && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsList: {
    paddingBottom: 16,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  selectedOption: {
    backgroundColor: "#6200ee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default SettingsScreen;
