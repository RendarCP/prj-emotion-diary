import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Emotion } from "../types";
import { emotions } from "../utils/emotions";
import EmotionItem from "./EmotionItem";

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: Emotion) => void;
  selectedEmotion?: Emotion;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  onEmotionSelect,
  selectedEmotion,
}) => {
  // 화면 너비에 맞게 조정
  const screenWidth = Dimensions.get("window").width;
  const compactMode = screenWidth < 360; // 작은 화면 대응

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 감정을 선택하세요</Text>
      <View style={styles.emotionContainer}>
        {emotions.map((emotion) => (
          <EmotionItem
            key={emotion.id}
            emotion={emotion}
            isSelected={selectedEmotion?.id === emotion.id}
            onSelect={onEmotionSelect}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emotionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
});

export default EmotionSelector;
