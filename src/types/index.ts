export interface Emotion {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  emotion: Emotion;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Create: undefined;
  Detail: { id: string };
  Edit: { id: string };
  BottomTabs: { screen?: keyof BottomTabParamList };
};

export type BottomTabParamList = {
  Home: undefined;
  DiaryList: undefined;
  Statistics: undefined;
  Settings: undefined;
};
