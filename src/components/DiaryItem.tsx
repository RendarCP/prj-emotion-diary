import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DiaryEntry } from "../types";
import { formatDateToKorean } from "../utils/date";

interface DiaryItemProps {
  entry: DiaryEntry;
  onPress: (id: string) => void;
}

const DiaryItem: React.FC<DiaryItemProps> = ({ entry, onPress }) => {
  const { id, date, emotion, content } = entry;

  // 일기 내용 미리보기 (최대 40자)
  const previewContent =
    content.length > 40 ? `${content.substring(0, 40)}...` : content;

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: emotion.color }]}
      onPress={() => onPress(id)}
    >
      <Text style={styles.date}>{formatDateToKorean(date)}</Text>
      <View style={styles.emotionContainer}>
        <Text style={styles.emotion}>{emotion.icon}</Text>
        <Text style={[styles.emotionName, { color: emotion.color }]}>
          {emotion.name}
        </Text>
      </View>
      <Text style={styles.content}>{previewContent}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 15,
    backgroundColor: "white",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  emotionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emotion: {
    fontSize: 24,
    marginRight: 8,
  },
  emotionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});

export default DiaryItem;
