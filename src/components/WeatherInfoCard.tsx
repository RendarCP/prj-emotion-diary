import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WeatherData } from "../utils/weatherApi";
import { WeatherType } from "./WeatherCard";

interface WeatherInfoCardProps {
  weatherData?: WeatherData;
  isLoading: boolean;
  error?: string;
  onRefresh?: () => void;
}

// 날씨 타입에 따른 아이콘 이름 매핑
const getWeatherIcon = (weatherType: WeatherType): string => {
  switch (weatherType) {
    case "sunny":
      return "sunny";
    case "partly-cloudy":
      return "partly-sunny";
    case "cloudy":
      return "cloud";
    case "rainy":
      return "rainy";
    case "snowy":
      return "snow";
    case "stormy":
      return "thunderstorm";
    default:
      return "help-circle";
  }
};

// 날씨 타입에 따른 배경색 매핑
const getWeatherColor = (weatherType: WeatherType): string => {
  switch (weatherType) {
    case "sunny":
      return "#FFD700";
    case "partly-cloudy":
      return "#87CEEB";
    case "cloudy":
      return "#A9A9A9";
    case "rainy":
      return "#6495ED";
    case "snowy":
      return "#E0FFFF";
    case "stormy":
      return "#4682B4";
    default:
      return "#f5f5f5";
  }
};

const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({
  weatherData,
  isLoading,
  error,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>현재 날씨</Text>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} disabled={isLoading}>
              <Ionicons name="refresh" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>날씨 정보를 가져오는 중...</Text>
        </View>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>현재 날씨</Text>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6347" />
          <Text style={styles.errorText}>
            {error || "날씨 정보를 가져올 수 없습니다"}
          </Text>
          {error && error.includes("API 키") && (
            <Text style={styles.errorHint}>
              OpenWeatherMap API 키를 weatherApi.ts 파일에 추가해주세요.
            </Text>
          )}
          {onRefresh && (
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const {
    location,
    temperature,
    description,
    weatherType,
    humidity,
    windSpeed,
  } = weatherData;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>현재 날씨</Text>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.weatherContainer,
          { backgroundColor: getWeatherColor(weatherType) },
        ]}
      >
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        <View style={styles.weatherContent}>
          <View style={styles.leftContent}>
            <Ionicons
              name={getWeatherIcon(weatherType) as any}
              size={60}
              color="#fff"
            />
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.rightContent}>
            <Text style={styles.temperatureText}>{temperature}°C</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="water" size={16} color="#fff" />
                <Text style={styles.detailText}>{humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="speedometer" size={16} color="#fff" />
                <Text style={styles.detailText}>{windSpeed}m/s</Text>
              </View>
            </View>
          </View>
        </View>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherContainer: {
    borderRadius: 12,
    padding: 16,
    overflow: "hidden",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 6,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    alignItems: "center",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  temperatureText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
  errorHint: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default WeatherInfoCard;
