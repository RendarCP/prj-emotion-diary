import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiaryEntry } from "../types";

const DIARY_STORAGE_KEY = "@emotion_diary_entries";

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
