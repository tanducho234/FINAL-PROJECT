import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Alert,
  FlatList,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
const BookReviewScreen = ({ route, nagivation }) => {
  const commenterId = route.params.commenterId || "";
  const bookId = route.params.bookId;
  const [book, setBook] = useState("");
  const fetchBookData = async () => {
    console.log("fetchBookData", bookId);
    const token = await AsyncStorage.getItem("token");
    await axios

      .get(`http://localhost:3000/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        console.log("fetchBookData thanh cong");
        console.log(res.data);
        setBook(res.data);
      })
      .catch((error) =>
        Alert.alert("fetchUserData fail 1", error.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ])
      );
  };
  useEffect(() => {
    console.log("commenterId", commenterId);
    console.log("bookId", bookId);
    fetchBookData();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {commenterId ? (
          <Text>Commenter ID: {commenterId}</Text>
        ) : (
          <Text>No commenter ID found in route params{bookId}</Text>
        )}
      </View>
    </View>
  );
};



export default BookReviewScreen;
