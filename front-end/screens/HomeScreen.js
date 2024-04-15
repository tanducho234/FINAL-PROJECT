// HomeScreen.js
import React, { useState, useEffect, useRef } from "react";
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "@rneui/base";

import Checkbox from "expo-checkbox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SearchBar } from "@rneui/themed";

const HomeScreen = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3); // Set the number of books per page
  const [favouriteBooks, setFavouritesBooks] = useState([]);

  const scrollViewRef = useRef();

  const updateSearch = (search) => {
    setSearch(search);
    console.log(search);
  };

  const handleSearch = () => {
    const filtered = allBooks.filter(
      (book) =>
        (book.title &&
          book.title.toLowerCase().includes(search.toLowerCase())) ||
        (book.author &&
          book.author.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredBooks(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData().then(() => {
      setRefreshing(false);
    });
  };

  const fetchUserData = async () => {
    console.log("fetchAllall");
    try {
      const response = await axios.get(`http://localhost:3000/books/all`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      const books = response.data.books;
      for (let i = books.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [books[i], books[j]] = [books[j], books[i]];
      }

      setAllBooks(books);
      setPageNumber(1); // Reset page number to 1 after fetching data
      const initialBooks = books.slice(0, pageSize);
      setFilteredBooks(initialBooks);
      //setFavouritebook
      setFavouritesBooks(response.data.favoriteBooks);
      // console.log("fetchAll", response.data.favoriteBooks);
    } catch (error) {
      Alert.alert("Error", error.message, [
        { text: "OK", onPress: () => console.log("OK pressed") },
      ]);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const handleAddFavouriteBooksList = async (bookId) => {
    console.log("handleAddFavouriteBooksList", bookId);
    try {
      const response = await axios.post(
        `http://localhost:3000/users/add-to-favourite`,
        {
          bookId: bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );
      //add bookid to favouriteBooks
      const index = favouriteBooks.indexOf(bookId);
      if (index > -1) {
        setFavouritesBooks(favouriteBooks.filter((_id) => _id !== bookId));
      } else {
        setFavouritesBooks([...favouriteBooks, bookId]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleBorrowBookPress = async (lenderId, bookId, amount) => {
    console.log("handleBorrowBookPress", lenderId, " ", bookId, " ", amount);
    // Fetch user's account balance
    const balanceResponse = await axios.get(
      "http://localhost:3000/users/balance",
      {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );
    const userBalance = balanceResponse.data.accountBalance;
    const userId = balanceResponse.data.userId;

    // Check if user has sufficient balance to pay the deposit fee
    if (userBalance < amount) {
      Alert.alert(
        "Insufficient Balance",
        "You do not have sufficient balance to borrow this book. Please top up your account."
      );
      return;
    }

    const confirmed = await new Promise((resolve) => {
      Alert.alert(
        "Are you sure you want to send a request to borrow this book?",
        ` A deposit fee of ${amount.toLocaleString("vi-VN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })} VND will be charged.`,
        [
          { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
          { text: "Confirm", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });

    if (!confirmed) {
      console.log("Borrow request cancelled");
      return;
    }

    // Proceed with borrowing the book
    await axios
      .post(
        `http://localhost:3000/borrow/`,
        {
          lenderId,
          bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      )
      .then(async (res) => {
        // Make a new transaction for the deposit fee
        await axios.post(
          `http://localhost:3000/transactions`,
          {
            userId: userId, // Assuming userId is already defined in the component
            amount: amount,
            type: "Deposit",
            description: `Deposit fee`,
          },
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
            },
          }
        );
        // Update user's account balance
        const updatedBalance = await axios.post(
          `http://localhost:3000/users/update-balance`,
          {
            user_id: userId, // Assuming userId is already defined in the component
            amount: -amount, // Subtracting the deposit fee from the balance
          },
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
            },
          }
        );
        Alert.alert("Request sent", res.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ]);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Oops", err.response.data.message, [
          { text: "OK", onPress: () => console.log("OK pressed") },
        ]);
      });
  };

  const handleBookPress = (bookId, imageLink) => {
    console.log("handleBookPress ");
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isCloseToBottom && !loadingMore) {
      setLoadingMore(true);
      const nextPageBooks = allBooks.slice(
        pageNumber * pageSize,
        (pageNumber + 1) * pageSize
      );
      setFilteredBooks((prevBooks) => [...prevBooks, ...nextPageBooks]);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      //delay 1s
      setTimeout(() => {
        setLoadingMore(false);
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        platform="ios"
        containerStyle={{ backgroundColor: "white" }}
        inputContainerStyle={{ marginTop: 10 }}
        inputStyle={{}}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        lightTheme
        loadingProps={{}}
        onChangeText={(newVal) => {
          updateSearch(newVal);
          if (newVal == "") {
            setFilteredBooks(allBooks.slice(0, pageSize));
          }
        }}
        onClearText={() => console.log("onClearText()")}
        placeholder="Type query here..."
        placeholderTextColor="#888"
        cancelButtonTitle="Cancel"
        cancelButtonProps={{}}
        onCancel={() => console.log("cancel")}
        value={search}
        onSubmitEditing={handleSearch}
      />
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={100}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filteredBooks.map((book, index) => (
          <Pressable
            key={book._id}
            onPress={() => handleBookPress(book._id, book.imageLink)}
          >
            <View style={styles.bookContainer}>
              <View>
                <Image
                  source={{ uri: book.viewLink }}
                  style={styles.bookImage}
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                >
                  <Icon name="account" size={25} color="black" />
                  <Avatar
                    activeOpacity={0.2}
                    containerStyle={{ backgroundColor: "#BDBDBD" }}
                    rounded
                    size={25}
                    source={{ uri: book.ownerId.viewLink }}
                  />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {book.genres.map((genre, genreIndex) => (
                    <View key={genre._id} style={styles.genreContainer}>
                      <Text key={genreIndex} style={styles.bookGenre}>
                        {genre.name}
                      </Text>
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
                <TouchableOpacity
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => handleAddFavouriteBooksList(book._id)}
                >
                  <Icon
                    name="heart"
                    size={20}
                    color={favouriteBooks.includes(book._id) ? "red" : "grey"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.borrowButton}
                  onPress={() =>
                    handleBorrowBookPress(
                      book.ownerId._id,
                      book._id,
                      book.depositFee
                    )
                  }
                >
                  <Text style={styles.borrowButtonText}>Borrow this</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        ))}
        {loadingMore && (
          <ActivityIndicator
            style={{ marginTop: 10 }}
            size="large"
            color="#1E90FF"
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: "cover",
  },
  textContainer: {
    // backgroundColor:'red',
    flex: 1,
    paddingHorizontal: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
  },
  genreContainer: {
    borderRadius: 12,
    backgroundColor: "#E0E0E0", // A light grey color, for example
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start", // To ensure the container does not stretch
    marginTop: 4, // To give a little space from the title
  },
  bookGenre: {
    color: "#333333", // A darker text color for contrast
    fontSize: 12,
    fontWeight: "bold", // If the genre label is bold
  },
  bookDepositFee: {
    fontSize: 14,
    //color suitable for price
    fontWeight: "bold",
    color: "green",
    marginTop: 4, // Spacing from the genre to the rating
  },
  borrowButton: {
    backgroundColor: "#1E90FF", // A vivid blue color, for example
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded corners
    alignSelf: "flex-end", // Align to the left
    marginTop: 10, // Space from the rating to the button
    backgroundColor: "green",
  },
  borrowButtonText: {
    color: "white", // White text on the blue button
    fontSize: 16,
    fontWeight: "bold", // If the text is bold
    textAlign: "center", // Center the text inside the button
  },
});

export default HomeScreen;
