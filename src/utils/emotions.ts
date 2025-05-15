import { Emotion } from "../types";

export const emotions: Emotion[] = [
  {
    id: 1,
    name: "행복",
    color: "#fdce17",
    icon: "😄",
  },
  {
    id: 2,
    name: "좋음",
    color: "#9dd772",
    icon: "😊",
  },
  {
    id: 3,
    name: "보통",
    color: "#74c0fc",
    icon: "😐",
  },
  {
    id: 4,
    name: "나쁨",
    color: "#a5a1a1",
    icon: "😔",
  },
  {
    id: 5,
    name: "슬픔",
    color: "#6741d9",
    icon: "😢",
  },
  {
    id: 6,
    name: "화남",
    color: "#fa5252",
    icon: "😡",
  },
];

export const getEmotionById = (id: number): Emotion | undefined => {
  return emotions.find((emotion) => emotion.id === id);
};
