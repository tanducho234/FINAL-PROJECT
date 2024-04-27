import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Alert,
  ScrollView,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Button } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

const EditBookScreen = ({ navigation, route }) => {
  const { bookId, imageLink } = route.params;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [genresList, setGenresList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [depositFee, setDepositFee] = useState("");
  const [buttonStatus, setButtonStatus] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const token = await AsyncStorage.getItem("token");
      axios
        .get(`http://localhost:3000/books/${bookId}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          const book = res.data;
          setTitle(book.title);
          setAuthor(book.author);
          setISBN(book.ISBN);
          setDesc(book.desc);
          setImage(imageLink);
          setSelectedGenres(book.genres);
          setDepositFee(book.depositFee.toString()); // Convert depositFee to string for TextInput
        })
        .catch((error) =>
          Alert.alert("editbook fail ", error.response.data.message, [
            { text: "OK", onPress: () => console.log("OK pressed") },
          ])
        );
    };
    fetchBook();

    const fetchGenresData = async () => {
      const token = await AsyncStorage.getItem("token");
      axios
        .get(`http://localhost:3000/genres`)
        .then(async (res) => {
          setGenresList(res.data.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch((error) =>
          Alert.alert("fetchGenresData fail ", error.response.data.message, [
            { text: "OK", onPress: () => console.log("OK pressed") },
          ])
        );
    };
    fetchGenresData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await axios.delete(
                `http://localhost:3000/books/${bookId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (error) {
              console.error("Error deleting book:", error);
              // Handle errors
            }
            navigation.navigate("MyBooks");
          }}
        >
          <Icon marginRight={20} name="delete" size={30} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const toggleGenre = (genreId) => {
    const index = selectedGenres.indexOf(genreId);
    if (index > -1) {
      setButtonStatus(true);
      setSelectedGenres(selectedGenres.filter((_id) => _id !== genreId));
    } else {
      setButtonStatus(true);
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const editBook = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      console.log("depositFee", depositFee);
      await axios
        .post(
          `http://localhost:3000/books/${bookId}`,
          {
            title,
            author,
            genres: selectedGenres,
            ISBN,
            desc,
            depositFee,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) =>
          Alert.alert("Success!", res.data.message, [
            { text: "Ok", onPress: () => navigation.goBack() },
          ])
        )
        .catch((error) =>
          Alert.alert("update fail ", error.response.data.message, [
            { text: "OK", onPress: () => console.log("OK pressed") },
          ])
        );
    } catch (error) {
      console.error("Error updating book", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginHorizontal: 12 }}>
      <ScrollView style={{ marginTop: 12, backgroundColor: "white" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 0,
          }}
        >
          <View
            style={{
              marginTop: 20,
              width: 180,
              height: 180,
              backgroundColor: "lightgrey",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 180, height: 180 }}
              />
            )}
            {!image && <Text>No Image</Text>}
          </View>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ marginBottom: 5 }}>Title</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setButtonStatus(true);
            }}
          />
          <Text style={{ marginBottom: 5 }}>Author</Text>
          <TextInput
            style={styles.input}
            placeholder="Author"
            value={author}
            onChangeText={(text) => {
              setAuthor(text);
              setButtonStatus(true);
            }}
          />
          <Text style={{ marginBottom: 5 }}>Genre(s)</Text>
          <TouchableOpacity onPress={openModal}>
            <Text
              style={[
                styles.input,
                { textAlign: "right", padding: 9, color: "#4287f5" },
              ]}
              editable={false}
            >
              Tap to choose genre(s)
            </Text>
          </TouchableOpacity>
          <Text style={{ marginBottom: 5 }}>ISBN</Text>
          <TextInput
            style={styles.input}
            placeholder="ISBN"
            value={ISBN}
            onChangeText={(text) => {
              setISBN(text);
              setButtonStatus(true);
            }}
          />
          <Text style={{ marginBottom: 5 }}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={desc}
            onChangeText={(text) => {
              setDesc(text);
              setButtonStatus(true);
            }}
            placeholder="Enter description"
            multiline
          />
          <Text style={{ marginBottom: 5 }}>Deposit Fee</Text>
          <TextInput
            style={styles.input}
            placeholder="Deposit Fee"
            value={depositFee}
            onChangeText={(text) => {
              setDepositFee(text);
              setButtonStatus(true);
            }}
            keyboardType="numeric" // Set keyboard type to numeric for inputting numbers
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose genre(s) of your book</Text>
              <FlatList
                data={genresList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleGenre(item._id)}>
                    <View
                      style={{
                        marginBottom: 5,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        value={selectedGenres.includes(item._id)}
                        onValueChange={() => toggleGenre(item._id)}
                      />
                      <Text style={{ marginLeft: 5 }}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={{ textAlign: "center" }}>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Button
          buttonStyle={{ backgroundColor: "green", padding: 10 }}
          containerStyle={{
            borderRadius: 50,
            backgroundColor: "green",
            width: "50%",
            alignSelf: "center",
          }}
          disabledTitleStyle={{ color: "gray" }}
          icon={<Icon name="content-save" size={15} color="white" />}
          iconRight
          disabled={!buttonStatus}
          loading={loading}
          loadingProps={{ animating: true }}
          loadingStyle={{}}
          onPress={editBook}
          title="Edit"
          titleProps={{}}
          titleStyle={{ marginHorizontal: 5, fontSize: 20 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginBottom: 20,
    borderRadius: 50,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    height: "80%",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default EditBookScreen;
