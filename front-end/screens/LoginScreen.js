import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Input, Button } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const LoginScreen = ({ route, navigation }) => {
  const { setIsAuthenticated } = route.params;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    console.log("handle login");
    axios
      .post(`http://localhost:3000/login`, {
        username: username,
        password: password,
      })
      .then(async (res) => {
        setErrorMessage("");
        console.log("login thanh cong");
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("userId", res.data.userId);

        setIsAuthenticated(true);
        // navigation.navigate('Home',{ username: 'exampleUser' });
      })
      .catch(
        (error) => {
          setErrorMessage("Username or Password does not match"),
            console.log(error);
        }
        //   Alert.alert(
        //   'Login Failed',
        //   error.response.data.message,
        //   [{ text: 'OK', onPress: () => console.log('OK pressed') }]
        // )
      );
  };

  return (
    <View style={styles.container}>
      <Image source={require("../image/pic2.jpeg")} style={styles.image} />
      <Input
        placeholder="Enter username"
        inputContainerStyle={styles.input}
        value={username}
        onChangeText={setUsername}
        label="Username"
        labelStyle={{ color: "green" }}
        leftIcon={<Icon name="account-outline" size={20} />}
      />
      <Input
        placeholder="Enter password"
        inputContainerStyle={styles.input}
        value={password}
        errorMessage={errorMessage}
        onChangeText={setPassword}
        label="Password"
        labelStyle={{ color: "green" }}
        leftIcon={<Icon name="lock-outline" size={20} />}
        secureTextEntry={true}
      />
      <Button
        buttonStyle={{ width: 150, backgroundColor: "green", padding: 10 }}
        containerStyle={{
          margin: 1,
          borderRadius: 50,
          backgroundColor: "green",
        }}
        disabledTitleStyle={{ color: "#gray" }}
        icon={<Icon name="login" size={15} color="white" />}
        iconRight
        disabled={false}
        loading={false}
        loadingProps={{ animating: true }}
        loadingStyle={{}}
        onPress={handleLogin}
        title="Login"
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5, fontSize: 20 }}
      />
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    width: "95%",
    alignSelf: "center",
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  registerText: {
    marginTop: 20,
    color: "blue",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
});

export default LoginScreen;
