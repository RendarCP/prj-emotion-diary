import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../types";
import HomeScreen from "../screens/HomeScreen";
import DiaryListScreen from "../screens/DiaryListScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { StyleSheet, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const { width, height } = Dimensions.get("window");

const BottomTabNavigator: React.FC = () => {
  const bottomInset = Platform.OS === "ios" && height >= 812 ? 34 : 0;

  return (
    <Tab.Navigator
      screenOptions={{
        // animation: "shift",
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          height: 60 + bottomInset,
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          paddingTop: 5,
          paddingBottom: bottomInset,
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DiaryList"
        component={DiaryListScreen}
        options={{
          tabBarLabel: "목록",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: "통계",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "설정",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
