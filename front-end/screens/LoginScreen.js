import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const LoginScreen = ({route,navigation}) => {
  const { handleLoginSuccess } = route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    axios.post(`http://192.168.0.35:3000/users/login`, {
      username: username,
      password: password,
    })
      .then(async res =>   {
        console.log('login thanh cong')
        await AsyncStorage.setItem('token', res.data.token);
        handleLoginSuccess();
      } )
      .catch(error => Alert.alert(
        'Login Failed',
        error.response.data.message,
        [{ text: 'OK', onPress: () => console.log('OK pressed') }]
      ));
  };

  return (
    <View style={styles.container}>
      <Image source={require('../image/pic2.jpeg')} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="green"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="green"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.button}>
        <Button
          title="Login"
          color="white"
          onPress={handleLogin}
        />
      </View>
      <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    marginBottom: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    width: '85%',
  },
  input: {
    width: '85%',
    height: 40,
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
});

export default LoginScreen;
