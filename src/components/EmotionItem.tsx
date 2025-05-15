import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Emotion } from "../types";

interface EmotionItemProps {
  emotion: Emotion;
  isSelected: boolean;
  onSelect: (emotion: Emotion) => void;
}

const EmotionItem: React.FC<EmotionItemProps> = ({
  emotion,
  isSelected,
  onSelect,
}) => {
  // 화면 너비에 맞게 아이템 크기 계산
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 60) / 6; // 여백을 고려한 너비 계산

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: emotion.color, width: itemWidth },
        isSelected && { backgroundColor: emotion.color },
      ]}
      onPress={() => onSelect(emotion)}
    >
      <Text style={styles.icon}>{emotion.icon}</Text>
      <Text style={[styles.name, isSelected && styles.selectedName]}>
        {emotion.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 3,
    marginBottom: 6,
  },
  icon: {
    fontSize: 24,
    marginBottom: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectedName: {
    color: "white",
  },
});

export default EmotionItem;
