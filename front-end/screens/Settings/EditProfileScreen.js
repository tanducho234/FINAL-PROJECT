import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,Button, ScrollView,Alert,StyleSheet,Pressable } from 'react-native';
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
  const [buttonStatus, setButtonStatus] = useState(false);
  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      console.log("fetchUserData")
      const token = await AsyncStorage.getItem('token');
    axios.get(`http://localhost:3000/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
      .then(async res =>   {
        console.log('fetchUserData thanh cong')
        console.log(res.data);
        setEmail(res.data.email)
        setAddress(res.data.address)
        setFirstName(res.data.firstName)
        setLastName(res.data.lastName)
        setBio(res.data.bio)
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


  const handleSaveProfile = async () => {
    // Add your logic to save the profile changes
    // This could involve making an API call to update the user's profile
    // For simplicity, we'll just log the changes for now
    console.log('Saving profile changes:');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Address:', address);
    console.log('Bio:', bio);

    const token = await AsyncStorage.getItem('token');
    axios.post(
      `http://localhost:3000/users/profile`,
      {
        firstname: firstName,
        lastname: lastName,
        address: address,
        bio: bio,
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

    // You can then navigate back to the profile view or perform any other action as needed
  };

  return (
    //  <SafeAreaView style={{ flex: 1, backgroundColor: 'red', alignItems: 'stretch' ,paddingTop:-10}}>
      <View style={{ marginHorizontal: 30}}>
      {/* <Pressable
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 0,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>
          Edit Profile
        </Text> */}

        <ScrollView style={{ marginTop: 12 }}>
          <View>
            <Text style={{ marginBottom: 5 }}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
              color='gray'
            />
            <Text style={{ marginBottom: 5 }}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={ (text)=>{
                setFirstName(text);
                // console.log(firstName)
                setButtonStatus(true);
              }}      
              
              />
            <Text style={{ marginBottom: 5 }}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={ (text)=>{
                setLastName(text)
                setButtonStatus(true);
              }}            />
            <Text style={{ marginBottom: 5 }}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={ (text)=>{
                setAddress(text)
                setButtonStatus(true);
              }}            />
            <Text style={{ marginBottom: 5 }}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 80 }]} // Additional height for multiline input
              multiline
              numberOfLines={4}
              value={bio}
              onChangeText={ (text)=>{
                setBio(text)
                setButtonStatus(true);
              }}
            />
          </View>
        </ScrollView>

        {/* <TouchableOpacity
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 }}
          onPress={handleSaveProfile}
          disabled= {buttonStatus} // Disable the button if the form is not valid
          
        >
          <Text style={styles.button
        }
        disabled= {buttonStatus}
        >Save Profile</Text>
        </TouchableOpacity> */}
        <View style={[styles.button,{alignItems:'center'}]}
        backgroundColor={buttonStatus ? 'green' : 'gray'}>
        <Button
          disabled= {!buttonStatus} // Disable the button if the form is not valid
          title="Save"
          color="white"
          onPress={handleSaveProfile}
        />
      </View>
      </View>
    // </SafeAreaView>
  );
};

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    marginBottom: 20,
    borderRadius: 50,
    width: '50%',
    alignSelf: 'center', // To center horizontally
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
});

export default EditProfile;
