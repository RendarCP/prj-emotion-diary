import React from "react";
import { StyleSheet, TextInput, View, Text, Dimensions } from "react-native";

interface DiaryTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
}

const DiaryTextInput: React.FC<DiaryTextInputProps> = ({
  value,
  onChangeText,
  maxLength = 500,
}) => {
  // 화면 높이에 맞게 입력 영역 높이 계산
  const screenHeight = Dimensions.get("window").height;
  const dynamicHeight = Math.min(180, screenHeight * 0.2); // 화면 높이의 20%로 제한, 최대 180

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 일기</Text>
      <TextInput
        style={[styles.input, { height: dynamicHeight }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="오늘 하루는 어땠나요?"
        multiline
        maxLength={maxLength}
        textAlignVertical="top"
      />
      <Text style={styles.counter}>
        {value.length} / {maxLength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  counter: {
    alignSelf: "flex-end",
    marginTop: 6,
    color: "#888",
  },
});

export default DiaryTextInput;
