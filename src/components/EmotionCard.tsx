import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Emotion } from "../types";
import EmotionGrid from "./EmotionGrid";

interface EmotionCardProps {
  onSelectEmotion: (emotion: Emotion) => void;
  selectedEmotion?: Emotion;
}

const EmotionCard: React.FC<EmotionCardProps> = ({
  onSelectEmotion,
  selectedEmotion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 감정</Text>
      {selectedEmotion ? (
        <View style={styles.selectedEmotionContainer}>
          <View
            style={[
              styles.selectedEmotionBox,
              { backgroundColor: selectedEmotion.color },
            ]}
          >
            <Text style={styles.selectedEmotionIcon}>
              {selectedEmotion.icon}
            </Text>
            <Text style={styles.selectedEmotionName}>
              {selectedEmotion.name}
            </Text>
          </View>
          <Text style={styles.guideText}>
            오늘 당신의 감정은{" "}
            <Text style={styles.highlightText}>{selectedEmotion.name}</Text>
            이군요.
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.subTitle}>오늘 당신의 감정을 선택해주세요</Text>
          <EmotionGrid onSelectEmotion={onSelectEmotion} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  selectedEmotionContainer: {
    alignItems: "center",
    padding: 16,
  },
  selectedEmotionBox: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginBottom: 16,
  },
  selectedEmotionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  selectedEmotionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  guideText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  highlightText: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default EmotionCard;
