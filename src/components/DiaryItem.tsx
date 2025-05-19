import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DiaryEntry } from "../types";
import { formatDateToKorean } from "../utils/date";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

interface DiaryItemProps {
  entry: DiaryEntry;
  onPress: (id: string) => void;
}

const DiaryItem: React.FC<DiaryItemProps> = ({ entry, onPress }) => {
  const { id, date, emotion, content } = entry;

  // 일기 내용 미리보기 (최대 60자)
  const previewContent =
    content.length > 60 ? `${content.substring(0, 60)}...` : content;

  // 감정에 따른 배경색 설정
  const getBackgroundColor = () => {
    switch (emotion.id) {
      case 1: // 행복
        return "#fff9db";
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
        return "#f5f5f5";
    }
  };

  // 감정에 따른 아이콘 설정
  const renderEmotionIcon = () => {
    switch (emotion.id) {
      case 1: // 행복
        return <Ionicons name="sunny" size={20} color="#fdce17" />;
      case 2: // 좋음
        return <FontAwesome5 name="seedling" size={18} color="#9dd772" />;
      case 3: // 보통
        return <Ionicons name="cloudy" size={20} color="#74c0fc" />;
      case 4: // 나쁨
        return <Ionicons name="cloud" size={20} color="#a5a1a1" />;
      case 5: // 슬픔
        return <Ionicons name="rainy" size={20} color="#6741d9" />;
      case 6: // 화남
        return <Ionicons name="flame" size={20} color="#fa5252" />;
      default:
        return null;
    }
  };

  // 날짜 포맷팅 (YYYY. MM. DD. 형식)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}. ${month}. ${day}.`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      onPress={() => onPress(id)}
    >
      <Text style={styles.title}>{emotion.name}</Text>
      <Text style={styles.date}>{formatDate(date)}</Text>
      <Text style={styles.content}>{previewContent}</Text>

      <View style={styles.iconContainer}>
        {renderEmotionIcon()}
        {emotion.id === 5 && (
          <Ionicons
            name="umbrella"
            size={18}
            color="#6741d9"
            style={styles.secondIcon}
          />
        )}
        {emotion.id === 1 && (
          <MaterialCommunityIcons
            name="weather-sunset"
            size={18}
            color="#fdce17"
            style={styles.secondIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },
  secondIcon: {
    marginLeft: 8,
  },
});

export default DiaryItem;
