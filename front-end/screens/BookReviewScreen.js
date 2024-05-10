import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Input } from "@rneui/base";

import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from "../styles/MessageStyles";
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
import { ListItem } from "@rneui/themed";
const BookReviewScreen = ({ route, nagivation }) => {
  const commenterId = route.params.commenterId || "";
  const bookId = route.params.bookId;
  const [comments, setComments] = useState([]);
  const [book, setBook] = useState("");
  const [comment, setComment] = useState("");

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
        // console.log("fetchBookData thanh cong");
        // console.log("res.data", res.data);
        setBook(res.data);
      })
      .catch((error) =>
        Alert.alert("fetchUserData fail 1", error.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ])
      );
    await axios
      .get(`http://localhost:3000/books/${bookId}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        console.log("fetch comment thanh cong");
        console.log("res.data", res.data);
        setComments(res.data);
      })
      .catch((error) =>
        Alert.alert("fetch comment fail 1", error.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ])
      );
  };
  useEffect(() => {
    console.log("commenterId", commenterId);
    console.log("bookId", bookId);
    fetchBookData();
  }, []);
  const handleAddNewComment = async (comment) => {
    const token = await AsyncStorage.getItem("token");
    await axios
      .post(
        `http://localhost:3000/books/${bookId}/comment`,
        {
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        console.log("add new comment thanh congthanh cong");
        console.log("res.data", res.data);
        setComment("")
        fetchBookData();
      })
      .catch((error) =>
        Alert.alert("add comment fail", error.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ])
      );
  };
  const showDescription = (desc) => {
    Alert.alert(
      "Book Description",
      desc,
      { text: "Got it!" },
      { cancelable: true }
    );
  };

  const showGenreDescription = (genre) => {
    Alert.alert(
      genre.name,
      genre.description,
      { text: "Got it!" },
      { cancelable: true }
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.bookContainer}>
        <View style={styles.bookContainerLeft}>
          <Image
            source={{ uri: book.viewLink }}
            style={styles.bookImage}
            defaultSource={require("../image/logo.png")}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 10,
              alignItems: "start",
            }}
          >
            <Icon
              style={{ alignSelf: "center" }}
              name={book.status == "Available" ? "check-bold" : "close-thick"}
              size={25}
              color={book.status == "Available" ? "green" : "red"}
            />
            <Text
              style={{
                alignSelf: "center",
                fontSize: 15,
                maxWidth: 90,
                flexWrap: "wrap",
                color: book.status == "Available" ? "green" : "red",
              }}
            >
              {book.status}
            </Text>
          </View>
        </View>
        <View style={styles.bookContainerRight}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {book.genres &&
              book.genres.map((genre, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.genreButton}
                  onPress={() => showGenreDescription(genre)}
                >
                  <Text style={styles.bookGenre}>{genre.name}</Text>
                </TouchableOpacity>
              ))}
          </View>
          <TouchableOpacity onPress={() => showDescription(book.desc)}>
            <Text style={[styles.bookAuthor]} numberOfLines={3}>
              {book.desc}
            </Text>
          </TouchableOpacity>

          {/* {book.depositFee !== undefined && (
            <Text style={styles.bookDepositFee}>
              {book.depositFee.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              ₫
            </Text>
          )} */}
        </View>
      </View>
      <Text style={styles.heading}>Comments</Text>
      <Container>
        <ScrollView style={{ marginVertical: 20 }}>
          {comments.map((item, index) => (
            <Card key={index}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg
                    source={
                      item.viewLink
                        ? { uri: item.viewLink }
                        : require("../image/gray-profile.png")
                    }
                  />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.username}</UserName>
                    <PostTime>{item.createdAt}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.comment}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          ))}
        </ScrollView>
      </Container>
      {commenterId !== "" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginVer: 10,
          }}
        >
          <TextInput
            placeholder="Enter your review/comment"
            style={styles.input}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={() => handleAddNewComment(comment)}>
            <Icon name="arrow-up-box" size={40} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  bookContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 10,
    //Shadow
    shadowColor: "#BBBBBB",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 7,
  },
  bookContainerLeft: {
    flexDirection: "column",
  },
  bookContainerRight: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: "cover",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    marginTop: 5,
    fontSize: 14,
  },
  genreButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ff5e5c",
    borderWidth: "2",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    alignSelf: "flex-start", // To ensure the container does not stretch
    marginTop: 4, // To give a little space from the title
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: "2",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    alignSelf: "flex-start", // To ensure the container does not stretch
    marginTop: 4, // To give a little space from the title
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  bookGenre: {
    color: "#ff5e5c", // A darker text color for contrast
    fontSize: 12,
    fontWeight: "bold", // If the genre label is bold
  },
  bookDepositFee: {
    fontSize: 14,
    //color suitable for price
    fontWeight: "bold",
    color: "green",
    marginTop: 10, // Spacing from the genre to the rating
  },
  borrowButton: {
    backgroundColor: "#063970", // A vivid blue color, for example
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, // Rounded corners
    alignSelf: "flex-end", // Align to the left
    marginTop: 10, // Space from the rating to the button
  },
  borrowButtonText: {
    color: "white", // White text on the blue button
    fontSize: 16,
    fontWeight: "bold", // If the text is bold
    textAlign: "center", // Center the text inside the button
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

export default BookReviewScreen;
