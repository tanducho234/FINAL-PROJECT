// HomeScreen.js
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  const [userViewLink, setUserViewLink] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3); // Set the number of books per page
  const [favouriteBooks, setFavouritesBooks] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isShowingFavouriteBook, setIsShowingFavouriteBook] = useState(false);

  const scrollViewRef = useRef();

  const updateSearch = (search) => {
    setSearch(search);

    console.log(search);
    handleSearch();
  };

  const handleSearch = () => {
    console.log("handleSearch");
    setRefreshing(true);
    setIsFiltered(true);

    const filtered = allBooks.filter(
      (book) =>
        (book.title &&
          book.title.toLowerCase().includes(search.toLowerCase())) ||
        (book.author &&
          book.author.toLowerCase().includes(search.toLowerCase()))
    );
    setAllBooks(filtered);
    setFilteredBooks(filtered);
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
    setTimeout(() => {}, 500);
    setRefreshing(false);
  };

  const handleGenrePress = (genre) => {
    console.log("handleGenrePress");
    setIsFiltered(true);
    const filtered = allBooks.filter((book) =>
      book.genres.some((bookGenre) => bookGenre.name === genre.name)
    );
    setFilteredBooks(filtered);
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  const handleRefresh = () => {
    console.log("refresh");
    setRefreshing(true);
    setIsFiltered(false);
    setSearch("");
    fetchUserData().then(() => {
      setRefreshing(false);
      console.log("refresh done");
    });
  };

  const fetchUserData = async (isFavourite) => {
    try {
      const response = await axios.get(`http://localhost:3000/books/all`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      const books = response.data.books;
      setUserId(response.data.userId);
      setUserViewLink(response.data.userViewLink);
      setUserFullName(response.data.userFullName);
      setAllBooks(books);
      setPageNumber(1); 
      const initialBooks = books.slice(0, pageSize);
      setFilteredBooks(initialBooks);
      setFavouritesBooks(response.data.favoriteBooks);
      setIsShowingFavouriteBook(false);

    } catch (error) {
      Alert.alert("Error", error.message, [
        { text: "OK", onPress: () => console.log("OK pressed") },
      ]);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    fetchUserData();
  }, []);
  const handleShowFavouriteBooksList = async () => {
    console.log(
      "handleShowFavouriteBooksList",
      isShowingFavouriteBook,
      favouriteBooks
    );
    setIsFiltered(true);
    const filtered = isShowingFavouriteBook
      ? allBooks // If currently showing favorite books, revert to showing all books
      : allBooks.filter((book) => favouriteBooks.includes(book._id));
    setFilteredBooks(filtered);

    setIsShowingFavouriteBook(!isShowingFavouriteBook);
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };
  const handleAddFavouriteBooksList = async (bookId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/users/favourite-book`,
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
          `http://localhost:3000/users/balance`,
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

  const handleBookPress = (bookId) => {
    navigation.navigate("Review", {
      commenterId: "",
      bookId: bookId,
    });
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
    if (isCloseToBottom && !loadingMore && !isFiltered && !refreshing) {
      console.log("handleScroll", pageNumber);
      setLoadingMore(true);
      const nextPageBooks = allBooks.slice(0, (pageNumber + 1) * pageSize);
      setFilteredBooks(nextPageBooks);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      //delay 1s
      setTimeout(() => {
        setLoadingMore(false);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        platform="ios"
        containerStyle={{
          backgroundColor: "white",
          width: "100%",
          padding: 0,
          borderRadius: 5,
        }}
        inputContainerStyle={{
          height: 40,
          width: "80%",
          alignSelf: "center",
        }}
        inputStyle={{}}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        lightTheme
        loadingProps={{}}
        onChangeText={(newVal) => {
          updateSearch(newVal);
          if (newVal == "") {
            setFilteredBooks(allBooks.slice(0, pageSize));
            handleRefresh();
          }
        }}
        onClear={() => handleRefresh()}
        onClearText={() => console.log("onClearText()")}
        placeholder="Type query here..."
        placeholderTextColor="#888"
        cancelButtonTitle="Cancel"
        cancelButtonProps={{}}
        onCancel={() => handleRefresh()}
        value={search}
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity
        onPress={() => handleShowFavouriteBooksList()} // Adjust the onPress handler as needed
      >
        <View
          style={[
            styles.filterButton,
            { borderColor: isShowingFavouriteBook ? "green" : "gray" },
          ]}
        >
          <Icon
            name="heart"
            size={20}
            color={isShowingFavouriteBook ? "green" : "gray"}
          />
          <Text
            style={[
              styles.filterButtonText,
              ,
              { color: isShowingFavouriteBook ? "green" : "gray" },
            ]}
          >
            {" "}
            Favourite
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={1000}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filteredBooks.map((book, index) => (
          <View style={styles.bookContainer} key={book._id}>
            <View style={styles.bookContainerLeft}>
              <Pressable
                onPress={() => handleBookPress(book._id)}
              >
                <Image
                  source={{ uri: book.viewLink }}
                  style={styles.bookImage}
                  defaultSource={require("../image/logo.png")}
                />
              </Pressable>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Message", { screen: "Messages" }); // Navigate to MessagesScreen first
                  setTimeout(() => {
                    navigation.navigate("Message", {
                      screen: "Chat",
                      params: {
                        receiverName:
                          book.ownerId.firstName + " " + book.ownerId.lastName,
                        senderId: userId,
                        receiverId: book.ownerId._id,
                        senderAvatarViewLink: userViewLink,
                        receiverAvatarViewLink: book.ownerId.viewLink,
                        senderName: userFullName,
                      },
                    });
                  }, 100); // Delay the navigation to ChatScreen
                }}
              >
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
                    name="account"
                    size={25}
                    color="black"
                  />
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 15,
                      maxWidth: 90,
                      flexWrap: "wrap",
                    }}
                  >
                    {book.ownerId.firstName} {book.ownerId.lastName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.bookContainerRight}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {book.genres.map((genre, genreIndex) => (
                  <TouchableOpacity
                    key={genre._id}
                    onPress={() => handleGenrePress(genre)} // Adjust the onPress handler as needed
                  >
                    <View style={styles.genreButton}>
                      <Text style={styles.bookGenre}>{genre.name}</Text>
                    </View>
                  </TouchableOpacity>
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
                  style={{ alignSelf: "flex-end", margin: 9 }}
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
          </View>
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

export default HomeScreen;
