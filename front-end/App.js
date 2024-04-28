import React, { useState, useEffect } from "react";
import { Text, View, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MessagesScreem from "./screens/MessagesScreen";
import ChatScreen from "./screens/ChatScreen";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import SettingsScreen from "./screens/Settings/SettingsScreen";
import EditProfileScreen from "./screens/Settings/EditProfileScreen";
import AccountBalanceScreen from "./screens/Settings/AccountBalanceScreen";
import AddBookScreen from "./screens/MyBooks/AddBookScreen";
import EditBookScreen from "./screens/MyBooks/EditBookScreen";
import NotificationsScreen from "./screens/NotificationsScreen";

// import { MaterialIcons } from '@expo/vector-icons';

import { LogBox } from "react-native";
import MyBooksScreen from "./screens/MyBooks/MyBookScreen";
import HomeScreen from "./screens/HomeScreen";
import BookReviewScreen from "./screens/BookReviewScreen";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  `Sending \`onAnimatedValueUpdate\` with no listeners registered.`,
]);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MessageStack = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Messages">
    <Stack.Screen
      name="Messages"
      component={MessagesScreem}
      options={{
        headerShown: true,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold", // Change the font size to 30
        },
      }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({
        headerShown: true,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold", // Change the font size to 30
        },
        title: route.params.receiverName,
      })}
    />
  </Stack.Navigator>
);
function Settings({ route }) {
  const { handleLogoutSuccess } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold", // Change the font size to 30
          },
        }}
        component={SettingsScreen}
        initialParams={{ handleLogoutSuccess }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: "Edit Profile",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold", // Change the font size to 30
          },
        }}
      />

      <Stack.Screen
        name="AccountBalance"
        component={AccountBalanceScreen}
        options={{
          headerTitle: "Account Balance",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold", // Change the font size to 30
          },
        }}
      />
    </Stack.Navigator>
  );
}

function MyBook({ route }) {
  // const { handleLogoutSuccess } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyBooks"
        options={{
          headerTitle: "My Books",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold", // Change the font size to 30
          },
        }}
        component={MyBooksScreen}
      />
      <Stack.Screen
        name="AddBook"
        options={{
          headerTitle: "Add New Book ",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold", // Change the font size to 30
          },
        }}
        component={AddBookScreen}
      />
      <Stack.Screen
        name="EditBook"
        options={{
          headerTitle: "Edit Book ",
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold", // Change the font size to 30
          },
        }}
        component={EditBookScreen}
      />
    </Stack.Navigator>
  );
}

function HomeStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Home",
          headerTitleStyle: {
            fontSize: 20, // Changed font size to 30
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Review"
        component={BookReviewScreen}
        options={{
          headerTitle: "Book Review",
          headerTitleStyle: {
            fontSize: 20, // Changed font size to 30
            fontWeight: "bold",
          }, }}
      />
    </Stack.Navigator>
  );
}
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("checkAuthentication");
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("token", token);
    if (token) {
      setIsAuthenticated(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update isAuthenticated to true after successful login
    console.log("setIsAuthenticated(true);");
  };
  const handleLogoutSuccess = () => {
    setIsLoading(true);
    setIsAuthenticated(false); // Update isAuthenticated to true after successful login
    console.log("setIsAuthenticated(false);");
    setTimeout(async () => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Simulating loading time
    checkAuthentication();
    setTimeout(async () => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : isAuthenticated ? (
        <Tab.Navigator
          initialRouteName="HomeStack"
          screenOptions={{
            tabBarActiveTintColor: "#e91e63",
          }}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              headerShown: false,
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="MyBook"
            component={MyBook}
            options={{
              headerShown: false,
              tabBarLabel: "My Books",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="book" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="NotificationsTab"
            component={NotificationsScreen}
            options={{
              headerTitle: "Requests",
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: "bold", // Change the font size to 30
              },
              tabBarLabel: "Requests",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="handshake-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          {/* tab screen for message */}
          <Tab.Screen
            name="Message"
            component={MessageStack}
            options={{
              lazy: true,
              headerShown: false,
              tabBarLabel: "Messages",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="message"
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          <Tab.Screen
            name="SettingsTab"
            component={Settings}
            initialParams={{ handleLogoutSuccess }}
            options={{
              headerShown: false,
              tabBarLabel: "Settings",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false, title: "" }}
          />
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              gestureEnabled: false,
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{ setIsAuthenticated }}
              options={{ headerShown: true, title: "Login" }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: true, title: "Register" }}
            />
          </Stack.Group>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default App;
