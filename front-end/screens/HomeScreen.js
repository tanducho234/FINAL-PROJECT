// HomeScreen.js
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Alert, FlatList, View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Button, Image, Pressable, ScrollView, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "@rneui/base";

import Checkbox from 'expo-checkbox';
import axios from 'axios'; // Assuming you'll make API requests to add a book
import AsyncStorage from '@react-native-async-storage/async-storage';


import { SearchBar } from '@rneui/themed';

const HomeScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [allBooks, setAllBooks] = useState([]);

    const updateSearch = (search) => {
        setSearch(search);
        console.log(search)
    };

    const handleSearch = () => {
        // Filter books based on search input
        const filtered = allBooks.filter(book =>
            (book.title && book.title.toLowerCase().includes(search.toLowerCase())) ||
            (book.author && book.author.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredBooks(filtered);
    };
    const handleRefresh = () => {
        setRefreshing(true)
        fetchUserData()
            .then(() => { setRefreshing(false) })


    }

    // Fetch user's books from the backend API
    const fetchUserData = async () => {

        console.log("fetchAllall")
        const token = await AsyncStorage.getItem('token');
        axios.get(`http://localhost:3000/books/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async res => {
                // console.log('fetchAllBooksData thanh cong', res.data)
                const books = res.data;
                // console.log(books)
                for (let i = books.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [books[i], books[j]] = [books[j], books[i]];
                }
                setFilteredBooks(books)
                setAllBooks(books)
            })
            .catch(error => Alert.alert(
                'fetchAllAll fail ',
                error.response.data.message,
                [{ text: 'OK', onPress: () => console.log('OK pressed') }]
            ));
    }
    useEffect(() => {


        fetchUserData();

        //// Listen for focus events on the screen
        // const focusSubscription = navigation.addListener('focus', () => {
        //     // Refetch user's books when the screen gains focus
        //     fetchUserData();
        // });

        // // Clean up the subscription
        // return () => {
        //     focusSubscription();
        // };
    }, [navigation]);


    const handleBorrowBookPress = async (lenderId, bookId) => {
        console.log("handleBorrowBookPress", lenderId, " ", bookId);
        
        const confirmed = await new Promise((resolve) => {
            Alert.alert(
                'Confirm Borrow',
                'Are you sure you want to borrow this book?',
                [
                    { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
                    { text: 'Confirm', onPress: () => resolve(true) }
                ],
                { cancelable: false }
            );
        });
    
        if (!confirmed) {
            console.log('Borrow request cancelled');
            return;
        }
    
        const token = await AsyncStorage.getItem('token');
    
        await axios.post(`http://localhost:3000/borrow/`, {
            lenderId,
            bookId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(res => {
            console.log(res.data);
            Alert.alert(
                'Request sent',
                res.data.message,
                [{ text: 'OK', onPress: () => console.log('OK pressed') }]
            );
        })
        .catch(err => {
            console.log(err);
            Alert.alert(
                'Oops',
                err.response.data.message
                ,
                [{ text: 'OK', onPress: () => console.log('OK pressed') }]
            );
        });
    };


    return (
        <View style={styles.container}>

            <SearchBar
                platform="ios"
                containerStyle={{ backgroundColor: 'white' }}
                inputContainerStyle={{ marginTop: 10 }}
                inputStyle={{}}
                leftIconContainerStyle={{}}
                rightIconContainerStyle={{}}
                lightTheme
                loadingProps={{}}
                onChangeText={newVal => {
                    updateSearch(newVal)
                    if (newVal == '') { setFilteredBooks(allBooks) }
                }}
                onClearText={() => console.log('onClearText()')}
                placeholder="Type query here..."
                placeholderTextColor="#888"
                cancelButtonTitle="Cancel"
                cancelButtonProps={{}}
                onCancel={() => console.log('cancel')}
                value={search}
                onSubmitEditing={handleSearch}

            />
            {/* <Button title="Search" onPress={(val) =>console.log('aaa')} /> */}
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {filteredBooks.map((book, index) => (
                    <Pressable key={book._id} onPress={() =>
                        handleBookPress(book._id, book.imageLink)
                    }>
                        <View style={styles.bookContainer}>
                            <View>
                            <Image source={{ uri: book.viewLink }} style={styles.bookImage} />
                            <Avatar
                                activeOpacity={0.2}
                                avatarStyle={{}}
                                containerStyle={{ backgroundColor: "#BDBDBD" }}
                                icon={{}}
                                iconStyle={{}}
                                imageProps={{}}
                                placeholderStyle={{}}
                                rounded
                                size="small"
                                source={{ uri: book.ownerId.viewLink }}
                                titleStyle={{}}
                            />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.bookTitle}>{book.title}</Text>
                                <Text style={styles.bookAuthor}>{book.author}</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {book.genres.map((genre, genreIndex) => (
                                        <View key={genre._id} style={styles.genreContainer}>
                                            <Text key={genreIndex} style={styles.bookGenre}>{genre.name}</Text>
                                        </View>

                                    ))}
                                </View>
                                <Text style={styles.bookRating}>⭐ 4.67</Text>
                                <TouchableOpacity style={styles.borrowButton}
                                    onPress={() => handleBorrowBookPress(book.ownerId._id, book._id)}
                                >
                                    <Text style={styles.borrowButtonText}>Borrow this</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Pressable>
                ))}
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
        flexDirection: 'row', borderWidth: 1,
        display: 'flex',
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    bookImage: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
    },
    textContainer: {
        // backgroundColor:'red',
        flex: 1,
        paddingHorizontal: 10,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontSize: 14,
    },
    genreContainer: {
        borderRadius: 12,
        backgroundColor: '#E0E0E0', // A light grey color, for example
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start', // To ensure the container does not stretch
        marginTop: 4, // To give a little space from the title
    },
    bookGenre: {
        color: '#333333', // A darker text color for contrast
        fontSize: 12,
        fontWeight: 'bold', // If the genre label is bold
    },
    bookRating: {
        fontSize: 14,
        color: '#FFD700', // Gold color for the stars, if you're using star emojis
        marginTop: 4, // Spacing from the genre to the rating
    },
    borrowButton: {
        backgroundColor: '#1E90FF', // A vivid blue color, for example
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20, // Rounded corners
        alignSelf: 'flex-end', // Align to the left
        marginTop: 10, // Space from the rating to the button
        backgroundColor: 'green'
    },
    borrowButtonText: {
        color: 'white', // White text on the blue button
        fontSize: 16,
        fontWeight: 'bold', // If the text is bold
        textAlign: 'center', // Center the text inside the button
    },

});

export default HomeScreen;
