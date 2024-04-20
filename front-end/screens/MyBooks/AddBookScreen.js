import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Button } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

const AddBookScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState(null);
  const [genresList, setGenresList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [depositFee, setDepositFee] = useState("");

  const disabledButton =
    !title ||
    !author ||
    genresList.length === 0 ||
    !ISBN ||
    !image ||
    !depositFee;

  useEffect(() => {
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

  const toggleGenre = (genreId) => {
    const index = selectedGenres.indexOf(genreId);
    if (index > -1) {
      setSelectedGenres(selectedGenres.filter((_id) => _id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const addBook = async () => {
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    });
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genres", selectedGenres);
    formData.append("ISBN", ISBN);
    formData.append("desc", desc);
    formData.append("depositFee", depositFee); // Add depositFee to form data

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      await axios
        .post("http://localhost:3000/books", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) =>
          Alert.alert("Success!", res.data.message, [
            { text: "Ok", onPress: () => navigation.goBack() },
          ])
        )
        .catch((error) =>
          Alert.alert("fetchUserData fail ", error.response.data.message, [
            { text: "OK", onPress: () => console.log("OK pressed") },
          ])
        );
    } catch (error) {
      console.error("Error adding book", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showUploadOption = () =>
    Alert.alert("Upload a image", "Choose your option:", [
      {
        text: "Open Gallery",
        onPress: () => pickImage(),
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Take a picture", onPress: () => takePhoto() },
    ]);

  return (
    <View style={{ marginHorizontal: 12 }}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        style={{ marginTop: 12, backgroundColor: "white" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 0,
          }}
        >
          <TouchableOpacity onPress={showUploadOption}>
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
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ marginBottom: 5 }}>Title</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={{ marginBottom: 5 }}>Author</Text>
          <TextInput
            style={styles.input}
            placeholder="Author"
            value={author}
            onChangeText={setAuthor}
          />
          <Text style={{ marginBottom: 5 }}>Genre(s)</Text>
          <TouchableOpacity onPress={openModal}>
            <Text
              style={[
                styles.input,
                { textAlign: "right", padding: 9, color: "#4287f5" },
              ]}
            >
              Tap to choose genre(s)
            </Text>
          </TouchableOpacity>
          <Text style={{ marginBottom: 5 }}>IBSN</Text>
          <TextInput
            style={styles.input}
            placeholder="ISBN"
            value={ISBN}
            onChangeText={setISBN}
          />
          <Text style={{ marginBottom: 5 }}>Deposit Fee</Text>
          <TextInput
            style={styles.input}
            placeholder="Deposit Fee"
            value={depositFee}
            onChangeText={setDepositFee}
            keyboardType="numeric"
          />
          <Text style={{ marginBottom: 5 }}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Enter description"
            multiline
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
              <Text style={styles.modalText}>Hello World!</Text>
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
                <Text style={{ textAlign: "center" }}>Hide Modal</Text>
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
          icon={<Icon name="plus" size={15} color="white" />}
          iconRight
          disabled={disabledButton}
          loading={loading}
          loadingProps={{ animating: true }}
          loadingStyle={{}}
          onPress={addBook}
          title="Add"
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

export default AddBookScreen;
