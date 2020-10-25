import React from "react";
import { SafeAreaView } from "react-navigation";
import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import TransactionHistory from "./src/screens/TransactionHistory";
import MeterScreen from "./src/screens/MeterScreen";
import SmartAssistant from "./src/screens/SmartAssistant";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ManageMeterScreen from "./src/screens/ManageMeterScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ManageComplaintScreen from "./src/screens/ManageComplaintScreen";

const HomeStack = createStackNavigator();
const AuthStack = createStackNavigator();
const HistoryStack = createStackNavigator();
const MeterStack = createStackNavigator();
const SmartStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ManageMeterStack = createStackNavigator();
const PaymentStack = createStackNavigator();
const ComplaintStack = createStackNavigator();
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const option = {
  headerStyle: {
    backgroundColor: "#771144",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 24,
  },
};

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "LOGIN", ...option }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "REGISTER", ...option }}
      />
    </AuthStack.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Account" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

const HistoryStackScreen = () => {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="History" component={TransactionHistory} />
    </HistoryStack.Navigator>
  );
};

const MeterStackScreen = () => {
  return (
    <MeterStack.Navigator>
      <MeterStack.Screen name="Meter" component={MeterScreen} />
    </MeterStack.Navigator>
  );
};

const SmartAssistantStackScreen = () => {
  return (
    <SmartStack.Navigator>
      <SmartStack.Screen name="Smart Assistant" component={SmartAssistant} />
    </SmartStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="PROFILE" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

const ManageMeterStackScreen = () => {
  return (
    <ManageMeterStack.Navigator>
      <ManageMeterStack.Screen
        name="MANAGE METERS"
        component={ManageMeterScreen}
      />
    </ManageMeterStack.Navigator>
  );
};

const PaymentStackScreen = () => {
  return (
    <PaymentStack.Navigator>
      <PaymentStack.Screen name="PAYMENT FLOW" component={PaymentScreen} />
    </PaymentStack.Navigator>
  );
};

const ManageComplaintStackScreen = () => {
  return (
    <ComplaintStack.Navigator>
      <ComplaintStack.Screen
        name="MANAGE COMPLAINTS"
        component={ManageComplaintScreen}
      />
    </ComplaintStack.Navigator>
  );
};

const MainScreenStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Account") {
            iconName = focused ? "md-person" : "md-person";
          } else if (route.name === "History") {
            iconName = focused ? "ios-list-box" : "ios-list";
          } else if (route.name === "Meter") {
            iconName = focused ? "md-speedometer" : "md-speedometer";
          } else if (route.name === "Smart Assistant") {
            iconName = focused ? "robot" : "robot";
          }

          return route.name === "Smart Assistant" ? (
            <FontAwesome5 name="robot" size={20} color={color} />
          ) : (
            <Ionicons name={iconName} size={size} color={color} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#771144",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Account" component={HomeStackScreen} />
      <Tab.Screen name="Meter" component={MeterStackScreen} />
      <Tab.Screen name="History" component={HistoryStackScreen} />
      <Tab.Screen
        name="Smart Assistant"
        component={SmartAssistantStackScreen}
      />
    </Tab.Navigator>
  );
};

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);

  switch (routeName) {
    case "Account":
      return "ACCOUNT";
    case "Meter":
      return "METER";
    case "History":
      return "TRANSACTION HISTORY";
    case "Smart Assistant":
      return "SMART ASSISTANT";
    case "Login":
      return "LOGIN";
    case "Register":
      return "REGISTER";
  }
};

export const AppNavigator = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="LOGIN"
            component={AuthStackScreen}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              ...option,
            })}
          />
          <RootStack.Screen
            name="ACCOUNT"
            component={MainScreenStack}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              ...option,
            })}
          />
          <RootStack.Screen
            name="PROFILE"
            component={ProfileStackScreen}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              ...option,
            })}
          />
          <RootStack.Screen
            name="MANAGE METERS"
            component={ManageMeterStackScreen}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              ...option,
            })}
          />
          <RootStack.Screen
            name="PAYMENT FLOW"
            component={PaymentStackScreen}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              ...option,
            })}
          />
          <RootStack.Screen
            name="MANAGE COMPLAINTS"
            component={ManageComplaintStackScreen}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              ...option,
            })}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F8F9",
  },
});
