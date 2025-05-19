import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

const StatisticsScreen: React.FC = () => {
  return (
    <SafeAreaWrapper excludeEdges={["bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>통계</Text>
        <Text style={styles.subtitle}>
          감정 통계 기능이 곧 추가될 예정입니다.
        </Text>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default StatisticsScreen;
