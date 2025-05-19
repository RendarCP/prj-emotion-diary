import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiaryEntry } from "../types";

const DIARY_STORAGE_KEY = "@emotion_diary_entries";
const WEATHER_UPDATE_INTERVAL_KEY = "@weather_update_interval";

// 기본 날씨 갱신 간격: 30분 (밀리초 단위)
export const DEFAULT_WEATHER_UPDATE_INTERVAL = 30 * 60 * 1000;

export const saveDiaryEntry = async (entry: DiaryEntry): Promise<void> => {
  try {
    const existingEntries = await getDiaryEntries();
    const newEntries = [...existingEntries, entry];
    await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(newEntries));
  } catch (error) {
    console.error("저장 오류:", error);
    throw error;
  }
};

export const updateDiaryEntry = async (
  updatedEntry: DiaryEntry
): Promise<void> => {
  try {
    const existingEntries = await getDiaryEntries();
    const newEntries = existingEntries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(newEntries));
  } catch (error) {
    console.error("업데이트 오류:", error);
    throw error;
  }
};

export const deleteDiaryEntry = async (id: string): Promise<void> => {
  try {
    const existingEntries = await getDiaryEntries();
    const newEntries = existingEntries.filter((entry) => entry.id !== id);
    await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(newEntries));
  } catch (error) {
    console.error("삭제 오류:", error);
    throw error;
  }
};

export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  try {
    const entriesJson = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
    if (!entriesJson) return [];
    return JSON.parse(entriesJson) as DiaryEntry[];
  } catch (error) {
    console.error("가져오기 오류:", error);
    return [];
  }
};

export const getDiaryEntryById = async (
  id: string
): Promise<DiaryEntry | null> => {
  try {
    const entries = await getDiaryEntries();
    const entry = entries.find((entry) => entry.id === id);
    return entry || null;
  } catch (error) {
    console.error("ID로 가져오기 오류:", error);
    return null;
  }
};

// 날씨 갱신 간격 저장 (밀리초 단위)
export const saveWeatherUpdateInterval = async (
  interval: number
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      WEATHER_UPDATE_INTERVAL_KEY,
      interval.toString()
    );
  } catch (error) {
    console.error("날씨 갱신 간격 저장 오류:", error);
    throw error;
  }
};

// 저장된 날씨 갱신 간격 불러오기 (밀리초 단위)
export const getWeatherUpdateInterval = async (): Promise<number> => {
  try {
    const intervalStr = await AsyncStorage.getItem(WEATHER_UPDATE_INTERVAL_KEY);
    if (!intervalStr) return DEFAULT_WEATHER_UPDATE_INTERVAL;
    return parseInt(intervalStr);
  } catch (error) {
    console.error("날씨 갱신 간격 불러오기 오류:", error);
    return DEFAULT_WEATHER_UPDATE_INTERVAL;
  }
};

// 디버깅용: 모든 일기 항목 삭제
export const clearAllDiaryEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify([]));
    console.log("모든 일기 항목이 삭제되었습니다.");
  } catch (error) {
    console.error("일기 항목 초기화 오류:", error);
    throw error;
  }
};
