import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { Button ,Input} from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [buttonStatus, setButtonStatus] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [newImagePath, setNewImagePath] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isImageChange, setIsImageChange] = useState(false);



  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      console.log("fetchUserData")
      const token = await AsyncStorage.getItem('token');
      await axios.get(`http://localhost:3000/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async res => {
          console.log('fetchUserData thanh cong')
          console.log(res.data);
          setEmail(res.data.email)
          setAddress(res.data.address)
          setFirstName(res.data.firstName)
          setLastName(res.data.lastName)
          setBio(res.data.bio)
          setImagePath(res.data.imagePath)
          console.log('imagePathLoad', res.data.imagePath)
          console.log('imageLoad', res.data.image)

          if (res.data.imagePath != null) {
            console.log('getlinkanh')
            const response = await axios.get(`http://localhost:3000/image/getviewlink/${res.data.imagePath}`);
            setImage(response.data.viewLink); // Assuming the response contains the image link

          }

        })
        .catch(error => Alert.alert(
          'fetchUserData fail ',
          error.response.data.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }]
        ));
    };

    // Call the function to fetch user data
    fetchUserData();
  }, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image taken successfully", result.assets[0].uri);
      setImage(result.assets[0].uri);
      setButtonStatus(true);
      setIsImageChange(true);
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
      setButtonStatus(true);
      setIsImageChange(true);

    }
  };



  const showUploadOption = () =>
    Alert.alert('Upload a image', 'Choose your option:', [
      {
        text: 'Open Gallery',
        onPress: () => pickImage(),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Take a picture', onPress: () => takePhoto() },
    ]);

    const updateImagePath = async (path) => {
      setNewImagePath(path);
      console.log('aaaaa',path,'',newImagePath)
    };
    
    const handleSaveProfile = async () => {
      try {
        setLoading(true); // Start loading animation
        const token = await AsyncStorage.getItem('token');
        const formData = new FormData();
        let imagePath = null; // Initialize imagePath
    
        if (isImageChange) {
          formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
    
          // Upload image and retrieve imagePath
          const response = await axios.post('http://localhost:3000/image/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          imagePath = response.data.imagePath;
        }
    
        axios.post(
          `http://localhost:3000/users/profile`,
          {
            firstname: firstName,
            lastname: lastName,
            address: address,
            bio: bio,
            imagePath: imagePath, // Include imagePath in the request payload
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        .then(res => Alert.alert(
          'Success!',
          res.data.message,
          [{ text: 'Ok', onPress: () => navigation.goBack() }]
        ))
        .catch(error => Alert.alert(
          'fetchUserData fail ',
          error.response.data.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }]
        ));
      } catch (error) {
        console.error("Error edit userprofile", error);
      } finally {
        setLoading(false); // Stop loading animation
      }
    };
    


  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={{ alignItems: 'center', }}
            onPress={showUploadOption}
          >
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {image == null && <Image source={require('../../image/gray-profile.png')} style={styles.image} />}
          </TouchableOpacity>
      <ScrollView style={{ marginTop: 12 ,backgroundColor:'white'}}>
        <View>
         
          <Input
  placeholder='Enter email'
  inputContainerStyle={styles.input}
  value={email}
  disabled
  errorMessage="Email cannot be edited"
  label="Email"
  labelStyle={{ marginBottom: 5 }}
  leftIcon={<Icon name="email" size={20} />}
/>
<Input
  placeholder='Enter first name'
  inputContainerStyle={styles.input}
  value={firstName}
  onChangeText={(text) => {
    setFirstName(text);
    setButtonStatus(true);
  }}
  label="First Name"
  labelStyle={{ marginBottom: 5 }}
  leftIcon={<Icon name="account-outline" size={20} />}
/>
<Input
  placeholder='Enter last name'
  inputContainerStyle={styles.input}
  value={lastName}
  onChangeText={(text) => {
    setLastName(text);
    setButtonStatus(true);
  }}
  label="Last Name"
  labelStyle={{ marginBottom: 5 }}
  leftIcon={<Icon name="account-outline" size={20} />}
/>
<Input
  placeholder='Enter address'
  inputContainerStyle={styles.input}
  value={address}
  onChangeText={(text) => {
    setAddress(text);
    setButtonStatus(true);
  }}
  label="Address"
  labelStyle={{ marginBottom: 5 }}
  leftIcon={<Icon name="directions" size={20} />}
/>
<Input
  placeholder='Enter bio'
  inputContainerStyle={[styles.input, { height: 80 }]} // Additional height for multiline input
  multiline
  numberOfLines={4}
  value={bio}
  onChangeText={(text) => {
    setBio(text);
    setButtonStatus(true);
  }}
  label="Bio"
  labelStyle={{ marginBottom: 5 }}
  leftIcon={<Icon name="human" size={20} />}
/>
        </View>
      </ScrollView>

      <Button
        buttonStyle={{  backgroundColor: "green", padding: 10}}
        containerStyle={{ borderRadius: 50, backgroundColor: "green",width:"50%",alignSelf:'center' }}
        disabledTitleStyle={{ color: "gray" }}
        icon={<Icon name="content-save" size={15} color="white" />}
        iconRight
        disabled={!buttonStatus}
        loading={loading}
        loadingProps={{ animating: true }}
        loadingStyle={{}}
        onPress={handleSaveProfile}
        title="Save"
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5, fontSize: 20 }}
      />
      
    </View>
    
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '95%',
    alignSelf: 'center',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  registerText: {
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90
  }

});

export default EditProfile;
