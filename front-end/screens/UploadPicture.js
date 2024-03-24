import React, { useState, useEffect } from 'react';
import { View, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ImageUpload = ({ navigation }) => {
    const [image, setImage] = useState(null);
    console.log('hello')

    useEffect(() => {
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
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

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        await axios.post('http://localhost:3000/upload', formData);
        alert('Image uploaded successfully');
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {image && <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/final-project-ad786.appspot.com/o/c036f334-65d0-492f-8d42-32ebd0e6c714_DoYouSpeakEnglishMoonBookCD.jpg?alt=media&token=9b72845d-aa65-4e04-8fa5-7158865c99c7' }} style={{ width: 200, height: 200 }} />}
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            <Button title="Take a photo" onPress={takePhoto} />
            <Button title="Upload Image" onPress={uploadImage} />
        </View>
    );
}
export default ImageUpload;

