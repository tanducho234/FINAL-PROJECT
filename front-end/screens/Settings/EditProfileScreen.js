import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditProfile = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      console.log("fetchUserData")
      const token = await AsyncStorage.getItem('token');
      console.log(token)
    axios.get(`http://localhost:3000/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
      .then(async res =>   {
        console.log('fetchUserData thanh cong')
        console.log(res.data);
        setEmail(res.data.email)
      } )
      .catch(error => Alert.alert(
        'fetchUserData fail ',
        error.response.data.message,
        [{ text: 'OK', onPress: () => console.log('OK pressed') }]
      ));
    };

    // Call the function to fetch user data
    fetchUserData();
  }, []);


  const handleSaveProfile = () => {
    // Add your logic to save the profile changes
    // This could involve making an API call to update the user's profile
    // For simplicity, we'll just log the changes for now
    console.log('Saving profile changes:');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Address:', address);
    console.log('Bio:', bio);
    // You can then navigate back to the profile view or perform any other action as needed
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginHorizontal: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>
          Edit Profile
        </Text>

        <ScrollView style={{ marginTop: 12 }}>
          <View>
            <Text style={{ marginBottom: 5 }}>Email</Text>
            <TextInput
              style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 10, borderColor: '#ccc', borderWidth: 1 }}
              value={email}
              editable={false}
              color='gray'
              
            />
            <Text style={{ marginBottom: 5 }}>First Name</Text>
            <TextInput
              style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 10, borderColor: '#ccc', borderWidth: 1 }}
              value={firstName}
              onChangeText={setFirstName}
            />
            <Text style={{ marginBottom: 5 }}>Last Name</Text>
            <TextInput
              style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 10, borderColor: '#ccc', borderWidth: 1 }}
              value={lastName}
              onChangeText={setLastName}
            />
            <Text style={{ marginBottom: 5 }}>Address</Text>
            <TextInput
              style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 10, borderColor: '#ccc', borderWidth: 1 }}
              value={address}
              onChangeText={setAddress}
            />
            <Text style={{ marginBottom: 5 }}>Bio</Text>
            <TextInput
              style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 10, borderColor: '#ccc', borderWidth: 1 }}
              multiline
              numberOfLines={4}
              value={bio}
              onChangeText={setBio}
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 }}
          onPress={handleSaveProfile}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default EditProfile;
