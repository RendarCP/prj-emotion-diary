import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Emotion } from "../types";

interface EmotionGridProps {
  onSelectEmotion: (emotion: Emotion) => void;
}

// 감정 데이터 (3x3 그리드)
const emotions: Emotion[] = [
  { id: 1, name: "행복", color: "#FFD700", icon: "😊" },
  { id: 2, name: "사랑", color: "#FF69B4", icon: "❤️" },
  { id: 3, name: "평온", color: "#87CEEB", icon: "😌" },
  { id: 4, name: "슬픔", color: "#6495ED", icon: "😢" },
  { id: 5, name: "화남", color: "#FF6347", icon: "😠" },
  { id: 6, name: "불안", color: "#9370DB", icon: "😰" },
  { id: 7, name: "지루함", color: "#A9A9A9", icon: "😴" },
  { id: 8, name: "놀람", color: "#00BFFF", icon: "😲" },
  { id: 9, name: "기대", color: "#32CD32", icon: "🤩" },
];

const EmotionGrid: React.FC<EmotionGridProps> = ({ onSelectEmotion }) => {
  const screenWidth = Dimensions.get("window").width;
  const itemSize = (screenWidth - 64) / 3; // 화면 너비에서 여백을 빼고 3등분

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[
              styles.emotionItem,
              {
                backgroundColor: emotion.color,
                width: itemSize,
                height: itemSize,
              },
            ]}
            onPress={() => onSelectEmotion(emotion)}
          >
            <Text style={styles.emotionIcon}>{emotion.icon}</Text>
            <Text style={styles.emotionName}>{emotion.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emotionItem: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
  },
  emotionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  emotionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default EmotionGrid;
