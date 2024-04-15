// RegisterScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const usernameInputRef = useRef(null);
  const [borderColor, setBorderColor] = useState("green"); // Initial border color
  const isButtonDisabled =
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    confirmPassword != password;
  const [isConfirmPasswordMatch, setIsConfirmPasswordMatch] = useState(true);

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);

    // Check if confirmPassword matches password
    if (text !== password) {
      // If not match, set border color to red
      setIsConfirmPasswordMatch(false);
      setBorderColor("red");
    } else {
      // If match, set border color back to default
      setIsConfirmPasswordMatch(true);
      setBorderColor("green");
    }
  };

  useEffect(() => {
    // Focus on the username input when the component mounts
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  const handleRegister = async () => {
    console.log(email);
    console.log(username);
    console.log(password);

    axios
      .post(`http://localhost:3000/register`, {
        username: username,
        email: email,
        password: password,
      })
      .then((res) =>
        Alert.alert("Registration Successful ", res.data.message, [
          { text: "Login", onPress: () => navigation.navigate("Login") },
        ])
      )
      .catch((error) =>
        Alert.alert("Registration Failed", error.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ])
      );
  };

  return (
    <View style={styles.container}>
      <Image source={require("../image/pic3.jpeg")} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="green"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="green"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="green"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: borderColor }]}
        placeholder="Re-enter Password"
        placeholderTextColor={borderColor}
        secureTextEntry
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
      />
      <Text style={styles.inputRequirements}>
        {!isConfirmPasswordMatch ? "Passwords do not match.\n" : null}
        {/* Username must contain at least 5 characters. */}
      </Text>
      <View
        style={styles.button}
        disabled={isButtonDisabled}
        backgroundColor={isButtonDisabled ? "gray" : "green"}
      >
        <Button
          title="Register"
          color={"white"}
          onPress={handleRegister}
          disabled={isButtonDisabled} // Disable the button if any field is empty
        />
      </View>
      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login here
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
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    fontSize: 24,
    marginBottom: 20,
    backgroundColor: "green",
    borderRadius: 50,
    width: "85%",
  },
  inputRequirements: {
    fontSize: 14,
    color: "red",
    marginTop: 20,
    width: "85%",
    height: 60,
    paddingHorizontal: 10,
  },
  input: {
    width: "85%",
    height: 40,
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
    textDecorationColor: "green",
  },
  loginText: {
    marginTop: 20,
    color: "blue",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
});

export default RegisterScreen;
