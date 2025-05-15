import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 날씨 타입
export type WeatherType =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "stormy";

interface WeatherCardProps {
  onSelectWeather: (weather: WeatherType) => void;
  selectedWeather?: WeatherType;
}

interface WeatherOption {
  type: WeatherType;
  icon: string;
  label: string;
  color: string;
}

// 날씨 옵션
const weatherOptions: WeatherOption[] = [
  { type: "sunny", icon: "sunny", label: "맑음", color: "#FFD700" },
  {
    type: "partly-cloudy",
    icon: "partly-sunny",
    label: "구름조금",
    color: "#87CEEB",
  },
  { type: "cloudy", icon: "cloud", label: "흐림", color: "#A9A9A9" },
  { type: "rainy", icon: "rainy", label: "비", color: "#6495ED" },
  { type: "snowy", icon: "snow", label: "눈", color: "#E0FFFF" },
  { type: "stormy", icon: "thunderstorm", label: "폭풍", color: "#4682B4" },
];

const WeatherCard: React.FC<WeatherCardProps> = ({
  onSelectWeather,
  selectedWeather,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 날씨</Text>
      <View style={styles.weatherGrid}>
        {weatherOptions.map((weather) => (
          <TouchableOpacity
            key={weather.type}
            style={[
              styles.weatherItem,
              selectedWeather === weather.type && styles.selectedWeather,
              { backgroundColor: weather.color },
            ]}
            onPress={() => onSelectWeather(weather.type)}
          >
            <Ionicons name={weather.icon as any} size={24} color="#fff" />
            <Text style={styles.weatherLabel}>{weather.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  weatherGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  weatherItem: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedWeather: {
    borderWidth: 2,
    borderColor: "#000",
  },
  weatherLabel: {
    color: "#fff",
    marginTop: 4,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default WeatherCard;
