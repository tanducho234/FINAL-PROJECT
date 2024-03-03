import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from './screens/RegisterScreen';
import LandingScreen from './screens/LandingScreen';
import SettingsScreen from './screens/Settings/SettingsScreen'; 
import EditProfileScreen from './screens/Settings/EditProfileScreen';
// import { MaterialIcons } from '@expo/vector-icons';

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


function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Settings({ route }) {
  const { handleLogoutSuccess } = route.params;

  return (
   <Stack.Navigator>
     <Stack.Screen name="Settings" options={{headerShown:false}} component={SettingsScreen} 
     initialParams={{ handleLogoutSuccess }}/>
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerShown:false}}/>
   </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false, title: ' ' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Login" component={LoginScreen} handleLoginSuccess={handleLoginSuccess} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      </Stack.Group>

    </Stack.Navigator>
  );
}


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  console.log('checkAuthentication');
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('token', token);
    if (token) {
      setIsAuthenticated(true);
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update isAuthenticated to true after successful login
    console.log('setIsAuthenticated(true);')
  };
  const handleLogoutSuccess = () => {
    setIsLoading(true)
    setIsAuthenticated(false); // Update isAuthenticated to true after successful login
    console.log('setIsAuthenticated(false);')
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
      {isLoading ? <LoadingScreen /> : (
        isAuthenticated ?
          <Tab.Navigator
            initialRouteName="SettingsTab"
            screenOptions={{
              tabBarActiveTintColor: '#e91e63',
            }}
          >
            <Tab.Screen
              name="FeedTab"
              component={Feed}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="NotificationsTab"
              component={Notifications}
              options={{
                tabBarLabel: 'Updates',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="bell" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="SettingsTab"
              component={Settings}
              initialParams={{ handleLogoutSuccess }}
              options={{
                headerShown:false,
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>

          :
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false, title: '' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' , gestureEnabled: false, headerShown: false}}>
              <Stack.Screen name="Login" component={LoginScreen} initialParams={{ setIsAuthenticated }} options={{ headerShown: true , title: 'Login'}} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true , title: 'Register'}} />
            </Stack.Group>

          </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
export default App;