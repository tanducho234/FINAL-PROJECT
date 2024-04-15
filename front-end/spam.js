import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import Greeting from "./Greeting";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text>a!</Text>
      <Text>Count: {count}</Text>
      <Button
        title="Press me"
        onPress={() => {
          Alert.alert("Message", "Press me !!!");
        }}
      />
      <Button
        title="Increase Count"
        onPress={() => {
          setCount(count + 1);
        }}
      />
      <Text style={styles.text}>Hello Wolrd</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "red",
    fontSize: 30,
  },
});
