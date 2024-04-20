import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Book = ({
  book,
  onPress,
  onAddToFavorites,
  onBorrow,
  showBorrowButton,
  showOwnerName,
  favouriteBookIds,
}) => {
  return (
    <View style={styles.bookContainer}>
      <View style={styles.bookContainerLeft}>
        {/* Book image */}
        <Pressable onPress={onPress}>
          <Image
            source={{ uri: book.viewLink }}
            style={styles.bookImage}
            defaultSource={require("../../image/logo.png")}
          />
        </Pressable>
        {/* Owner details */}
        {showOwnerName && (
          <View style={styles.ownerDetails}>
            <Icon name="account" size={25} color="black" />
            <Text style={styles.ownerName}>
              {book.ownerId.firstName} {book.ownerId.lastName}
            </Text>
          </View>
        )}
      </View>
      {/* Book details */}
      <View style={styles.bookContainerRight}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        {/* Genres */}
        <View style={styles.genreContainer}>
          {book.genres.map((genre, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleGenrePress(genre)}
            >
              <View style={styles.genreButton}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Deposit Fee */}
        <Text style={styles.bookDepositFee}>
          {book.depositFee.toLocaleString("vi-VN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          ₫
        </Text>
        {/* Favorite and Borrow buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onAddToFavorites}>
            <Icon
              name="heart"
              size={20}
              color={favouriteBookIds.includes(book._id) ? "red" : "grey"}
            />
          </TouchableOpacity>
          {showBorrowButton && (
            <TouchableOpacity style={styles.borrowButton} onPress={onBorrow}>
              <Text style={styles.borrowButtonText}>Borrow this</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 10,
    // Shadow
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
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: "cover",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  ownerDetails: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  ownerName: {
    fontSize: 15,
    maxWidth: 90,
    flexWrap: "wrap",
  },
  bookContainerRight: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreButton: {
    borderColor: "#ff5e5c",
    borderWidth: 2,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  genreText: {
    color: "#ff5e5c",
    fontSize: 12,
    fontWeight: "bold",
  },
  bookDepositFee: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  borrowButton: {
    backgroundColor: "#063970",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  borrowButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Book;
