import axios from "axios";
import { WeatherType } from "../components/WeatherCard";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";

// OpenWeatherMap API 설정
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  weatherType: WeatherType;
  icon: string;
  humidity: number;
  windSpeed: number;
}

// OpenWeatherMap 날씨 코드에 따른 WeatherType 매핑
const mapWeatherCodeToType = (weatherCode: number): WeatherType => {
  // 2xx: Thunderstorm
  if (weatherCode >= 200 && weatherCode < 300) {
    return "stormy";
  }
  // 3xx: Drizzle, 5xx: Rain
  else if (
    (weatherCode >= 300 && weatherCode < 400) ||
    (weatherCode >= 500 && weatherCode < 600)
  ) {
    return "rainy";
  }
  // 6xx: Snow
  else if (weatherCode >= 600 && weatherCode < 700) {
    return "snowy";
  }
  // 7xx: Atmosphere (mist, fog, etc.)
  // 80x: Clouds
  else if (
    (weatherCode >= 700 && weatherCode < 800) ||
    (weatherCode > 800 && weatherCode < 900)
  ) {
    return "cloudy";
  }
  // 801-802: Few clouds
  else if (weatherCode === 801 || weatherCode === 802) {
    return "partly-cloudy";
  }
  // 800: Clear sky
  else {
    return "sunny";
  }
};

// 현재 위치 기반 날씨 가져오기
export const getCurrentLocationWeather = async (): Promise<WeatherData> => {
  try {
    // 위치 권한 요청
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      throw new Error("위치 권한이 거부되었습니다");
    }

    // 현재 위치 가져오기
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;
    return await getWeatherByCoords(latitude, longitude);
  } catch (error) {
    console.error("위치 정보 가져오기 오류:", error);
    // 오류 발생 시 서울 날씨로 대체
    return await getWeatherByCity("Seoul");
  }
};

// 도시 이름으로 날씨 가져오기
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}&lang=kr`;
    const response = await axios.get(url);
    return processWeatherData(response.data);
  } catch (error) {
    console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 좌표로 날씨 가져오기
export const getWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}&lang=kr`;
    const response = await axios.get(url);
    return processWeatherData(response.data);
  } catch (error) {
    console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// API 응답 데이터 처리 함수
const processWeatherData = (data: any): WeatherData => {
  const weatherType = mapWeatherCodeToType(data.weather[0].id);

  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    weatherType,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
};

// 모의 날씨 데이터 (API가 동작하지 않을 경우 대비)
export const getMockWeatherData = (): WeatherData => {
  return {
    location: "서울",
    temperature: 22,
    description: "맑음",
    weatherType: "sunny",
    icon: "01d",
    humidity: 60,
    windSpeed: 5.1,
  };
};
