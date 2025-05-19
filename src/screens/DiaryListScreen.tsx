import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, DiaryEntry } from "../types";
import { getDiaryEntries } from "../utils/storage";
import DiaryItem from "../components/DiaryItem";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { Ionicons } from "@expo/vector-icons";

type DiaryListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BottomTabs"
>;

const DiaryListScreen: React.FC = () => {
  const navigation = useNavigation<DiaryListScreenNavigationProp>();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 화면이 포커스를 받을 때마다 데이터 새로고침
    const unsubscribe = navigation.addListener("focus", () => {
      loadDiaryEntries();
    });

    return unsubscribe;
  }, [navigation]);

  const loadDiaryEntries = async () => {
    setLoading(true);
    try {
      const entries = await getDiaryEntries();
      console.log("불러온 일기 항목:", entries.length, entries);

      // 날짜 기준 내림차순 정렬 (최신순)
      const sortedEntries = entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDiaryEntries(sortedEntries);
    } catch (error) {
      console.error("일기 목록 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiaryItemPress = (id: string) => {
    navigation.navigate("Detail", { id });
  };

  const handleCreatePress = () => {
    navigation.navigate("Create");
  };

  if (loading) {
    return (
      <SafeAreaWrapper excludeEdges={["bottom"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>일기 목록</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper excludeEdges={["bottom"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>일기 목록</Text>
        <TouchableOpacity style={styles.calendarButton} onPress={() => {}}>
          <Ionicons name="calendar-outline" size={22} color="#333" />
          <Text style={styles.calendarText}>달력 보기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <Text style={styles.searchPlaceholder}>일기 검색...</Text>
      </View>

      {diaryEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            아직 작성된 일기가 없습니다.{"\n"}첫 번째 일기를 작성해보세요!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleCreatePress}
          >
            <Text style={styles.emptyButtonText}>일기 작성하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={diaryEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DiaryItem entry={item} onPress={handleDiaryItemPress} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: "#888",
    fontSize: 15,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: "#228be6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DiaryListScreen;
