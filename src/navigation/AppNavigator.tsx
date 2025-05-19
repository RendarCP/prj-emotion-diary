import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import HomeScreen from "../screens/HomeScreen";
import CreateScreen from "../screens/CreateScreen";
import DetailScreen from "../screens/DetailScreen";
import EditScreen from "../screens/EditScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Create" component={CreateScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Edit" component={EditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
