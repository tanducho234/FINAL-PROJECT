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
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import axios from "axios"; // Assuming you'll make API requests to add a book
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
const MyBooksScreen = ({ navigation }) => {
  const [userBooks, setUserBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchUserData = async () => {
    console.log("fetchAllBooksData");
    const token = await AsyncStorage.getItem("token");
    axios
      .get(`http://localhost:3000/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        // console.log("fetchAllBooksData thanh cong", res.data);
        const books = res.data;
        setUserBooks(books);

        //get online imagePath for all books
        // fetchImageLinksForBooks(books)
        //   .then((updatedBooks) => {
        //     setUserBooks(updatedBooks);
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching image links for books:", error);
        //   });
      })
      .catch((error) =>
        Alert.alert("fetchAllBooksData fail ", error.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ])
      );
  };
  useEffect(() => {
    // Fetch user's books from the backend API
    fetchUserData();

    // Listen for focus events on the screen
    const focusSubscription = navigation.addListener("focus", () => {
      // Refetch user's books when the screen gains focus
      fetchUserData();
    });

    // Clean up the subscription
    return () => {
      focusSubscription();
    };
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddBook")}>
          <Icon marginRight={20} name="plus" size={30} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleRefresh = () => {
    console.log("refresh");
    setRefreshing(true);
    fetchUserData().then(() => {
      setRefreshing(false);
      console.log("refresh done");
    });
  };
  const handleBookPress = async (bookId, imageLink) => {
    navigation.navigate("EditBook", { bookId: bookId, imageLink: imageLink });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {userBooks.map((book, index) => (
          <View style={styles.bookContainer} key={book._id}>
            <View style={styles.bookContainerLeft}>
              <Image
                source={{ uri: book.viewLink }}
                style={styles.bookImage}
                defaultSource={require("../../image/logo.png")}
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
                  name={
                    book.status == "Available" ? "check-bold" : "close-thick"
                  }
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
                {book.genres.map((genre, genreIndex) => (
             
                    <View key={genre._id} style={styles.genreButton}>
                      <Text style={styles.bookGenre}>{genre.name}</Text>
                    </View>
                ))}
              </View>
              <Text style={styles.bookDepositFee}>
                {book.depositFee.toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                ₫
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignSelf: "flex-end",
                }}
              >
                <TouchableOpacity
                  disabled={book.status !== "Available"}
                  style={[
                    styles.borrowButton,
                    {
                      backgroundColor:
                        book.status === "Unavailable" ? "gray" : "#063970",
                    },
                  ]}
                  onPress={() => handleBookPress(book._id, book.viewLink)}
                >
                  <Text style={styles.borrowButtonText}>Edit this book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* <Button title="Add Book" onPress={() => navigation.navigate('AddBook')} /> */}
    </View>
    // </SafeAreaView>
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
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
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
});

export default MyBooksScreen;
