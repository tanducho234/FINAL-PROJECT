import React, { useState, useEffect } from "react";
import { Alert, FlatList, View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Button, Image, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Checkbox from 'expo-checkbox';
import axios from 'axios'; // Assuming you'll make API requests to add a book
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MyBooksScreen = ({ navigation }) => {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {

    // Fetch user's books from the backend API
    const fetchUserData = async () => {

      console.log("fetchAllBooksData")
      const token = await AsyncStorage.getItem('token');
      axios.get(`http://localhost:3000/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async res => {
          console.log('fetchAllBooksData thanh cong', res.data)
          // setUserBooks(res.data);
          const books = res.data;
          fetchImageLinksForBooks(books)
            .then((updatedBooks) => {
              // console.log('Books with image links:', updatedBooks);
              setUserBooks(updatedBooks);
            })
            .catch((error) => {
              console.error('Error fetching image links for books:', error);
            });
        })
        .catch(error => Alert.alert(
          'fetchAllBooksData fail ',
          error.response.data.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }]
        ));
    }
    fetchUserData();

     // Listen for focus events on the screen
  const focusSubscription = navigation.addListener('focus', () => {
    // Refetch user's books when the screen gains focus
    fetchUserData();
  });

  // Clean up the subscription
  return () => {
    focusSubscription();
  };
  }, [navigation]);


  const fetchImageLinkAndUpdate = async (book) => {
    try {
      const response = await axios.get(`http://localhost:3000/getviewlink/${book.imagePath}`);
      const imageLink = response.data.viewLink; // Assuming the response contains the image link
      return { ...book, imageLink }; // Return updated book object with image link
    } catch (error) {
      console.error('Error fetching image link:', error);
      return book; // Return original book object if error occurs
    }
  };

  // Function to fetch image links for all books
  const fetchImageLinksForBooks = async (books) => {
    const updatedBooks = await Promise.all(books.map(fetchImageLinkAndUpdate));
    return updatedBooks;
  };
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <ScrollView>
          {userBooks.map((book, index) => (
            <Pressable key={index} onPress={() => handleBookPress(book)}>
              <View style={styles.bookContainer}>
                {/* Display small image of the book */}
                <Image source={{ uri: book.imageLink }} style={{ width: 100, height: 100 }} />

                {/* Book details */}
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.bookTitle}>Title: {book.title}</Text>
                  <Text style={styles.bookAuthor}>Author: {book.author}</Text>
                  <Text style={{ color: book.status === 'Available' ? 'green' : 'red' }}>Status: {book.status}</Text>

                  {/* You can display other book details here */}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <Button title="Add Book" onPress={() => navigation.navigate('AddBook')} />
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
    flexDirection: 'row', borderWidth: 1,
    display: 'space-between',
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default MyBooksScreen;
