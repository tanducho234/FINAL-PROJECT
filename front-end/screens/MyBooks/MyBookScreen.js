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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import axios from "axios"; // Assuming you'll make API requests to add a book
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
const MyBooksScreen = ({ navigation }) => {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    // Fetch user's books from the backend API
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
          // console.log('fetchAllBooksData thanh cong', res.data)
          const books = res.data;
          //get online imagePath for all books
          fetchImageLinksForBooks(books)
            .then((updatedBooks) => {
              setUserBooks(updatedBooks);
            })
            .catch((error) => {
              console.error("Error fetching image links for books:", error);
            });
        })
        .catch((error) =>
          Alert.alert("fetchAllBooksData fail ", error.response.data.message, [
            { text: "OK", onPress: () => console.log("OK pressed") },
          ])
        );
    };
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
  }, [navigation]);

  const fetchImageLinkAndUpdate = async (book) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/image/getviewlink/${book.imagePath}`
      );
      const imageLink = response.data.viewLink; // Assuming the response contains the image link
      return { ...book, imageLink }; // Return updated book object with image link
    } catch (error) {
      console.error("Error fetching image link:", error);
      return book; // Return original book object if error occurs
    }
  };

  // Function to fetch image links for all books
  const fetchImageLinksForBooks = async (books) => {
    const updatedBooks = await Promise.all(books.map(fetchImageLinkAndUpdate));
    return updatedBooks;
  };
  const handleBookPress = async (bookId, imageLink) => {
    navigation.navigate("EditBook", { bookId: bookId, imageLink: imageLink });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        {userBooks.map((book, index) => (
          <Pressable
            key={index}
            onPress={() => handleBookPress(book._id, book.imageLink)}
          >
            <View style={styles.bookContainer}>
              {/* Display small image of the book */}
              <View style={{ marginRight: 10 }}>
                <Image
                  source={{ uri: book.imageLink }}
                  style={{ width: 100, height: 150, resizeMode: "cover" }}
                />
                {/* Status below the image */}
                <Text
                  style={{
                    color: book.status === "Available" ? "green" : "red",
                    marginTop: 5,
                    marginLeft: 5,
                  }}
                >
                  {book.status}
                </Text>
              </View>

              {/* Book details */}
              <View style={{ flex: 1, justifyContent: "top" }}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>Author: {book.author}</Text>
                {/* You can display other book details here */}
              </View>
            </View>
          </Pressable>
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
    marginHorizontal: 12,
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
    display: "flex",
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 18, // Adjust font size as needed
    fontWeight: "bold", // Set font weight to bold
  },
});

export default MyBooksScreen;
