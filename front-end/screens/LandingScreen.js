// LandingScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet,Image} from 'react-native';
import { SearchBar } from '@rneui/themed';


const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.firstPart}>
          <Image source={require('../image/pic1.png')} style={styles.image} />
          <Text style={styles.textContainer}>Welcome to My App!</Text>

          
          {/* Add more content here */}
        </View>
       <View ><SearchBar/></View> 

        <View style={styles.secondPart}>
          <Text style={styles.heading}>Welcome to My App!</Text>
          <Text style={styles.description}>
            Discover and share books with others in our community.
          </Text>
          {/* Add more content here */}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    position: 'relative',

  },
  
  firstPart: {
    paddingTop: 60,
    height: 190,
    backgroundColor: '#00b250',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  image: {
    marginLeft:0,
    width: 140,
    height:140,
  },
  searchBar: {
    backgroundColor:"white"
  },
  secondPart: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    margin: 0,
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 30,
        

  },
  button: {
    marginBottom:20,
    height:50,
    width:120,
    backgroundColor: '#00b250',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    justifyContent: 'center', /* centers horizontally */
    alignItems: 'center', /* centers vertically */

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default LandingPage;
