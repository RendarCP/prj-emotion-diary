import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen: React.FC = () => {
  const settingsOptions = [
    { id: "1", title: "알림 설정", subtitle: "알림 시간 및 빈도 설정" },
    { id: "2", title: "테마 설정", subtitle: "앱 테마 변경" },
    { id: "3", title: "계정 관리", subtitle: "로그인 및 계정 정보" },
    { id: "4", title: "앱 정보", subtitle: "버전 및 개발자 정보" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      <ScrollView style={styles.content}>
        {settingsOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.optionItem}>
            <View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
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
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default SettingsScreen;
