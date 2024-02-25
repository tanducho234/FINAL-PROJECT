import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from './screens/RegisterScreen';
import LandingScreen from './screens/LandingScreen';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
function Feed() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed!</Text>
    </View>
  );
}

function Profile({ navigation,route }){
  const { handleLogoutSuccess } = route.params;
  const handleLogout = async () => {
    try {
      // Remove the authentication token from AsyncStorage
      await AsyncStorage.removeItem('token');
      handleLogoutSuccess()
      // Navigate to the login screen
      // navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen}  options={{ headerShown: false ,title:' '}}
 />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen  name="Login" component={LoginScreen} handleLoginSuccess={handleLoginSuccess} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}} />
      </Stack.Group>

    </Stack.Navigator>
  );
}


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  
  console.log('checkAuthentication');
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('token',token);
    if (token) {
      setIsAuthenticated(true);
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update isAuthenticated to true after successful login
    console.log('setIsAuthenticated(true);')
  };
  const handleLogoutSuccess = () => {
    setIsAuthenticated(false); // Update isAuthenticated to true after successful login
    console.log('setIsAuthenticated(false);')
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
      {isLoading ? <LoadingScreen />: (
        isAuthenticated ? 
        <Tab.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ handleLogoutSuccess }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
        
        : 
        <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen}  options={{ headerShown: false ,title:' '}}  />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen  name="Login" component={LoginScreen} initialParams={{ handleLoginSuccess }} options={{headerShown:false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}} />
        </Stack.Group>
  
      </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
export default App;