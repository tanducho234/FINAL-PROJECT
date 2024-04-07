import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { Button ,Input} from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

const AccountBalanceScreen = () => {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const _handlePressButtonAsync = async () => {
    let Temporesult = await WebBrowser.openBrowserAsync('https://expo.dev');
    setResult(Temporesult);
    console.log(Temporesult);
  };
  useEffect(() => {
    fetchAccountBalance();
  }, []);

  const fetchAccountBalance = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users/balance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data.accountBalance);
      setUserId(response.data.userId);


    } catch (error) {
      console.error('Error fetching account balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (amount) => {
    try {
      setLoading(true);
      const token = ''; // Get token from AsyncStorage
      const response = await axios.post(
        'http://localhost:3000/create_payment_url',
        { amount:amount ,
            bankCode:"VNBANK",
            language:"vn",
            userId:userId
        }, // Pass chosen amount to the server
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle response (e.g., open payment URL in a webview)
      console.log('Payment URL:', response.data.vnpUrl);
      await WebBrowser.openBrowserAsync(response.data.vnpUrl)
     

    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setLoading(false);
      fetchAccountBalance()
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Your Account Balance: {balance} VND</Text>
      <Button
        title="Make Payment (100,000 VND)"
        onPress={() => initiatePayment(100000)}
        disabled={loading}
      />
      <Button
        title="Make Payment (200,000 VND)"
        onPress={() => initiatePayment(200000)}
        disabled={loading}
      />
      <Button
        title="Make Payment (500,000 VND)"
        onPress={() => initiatePayment(500000)}
        disabled={loading}
      />
            <Button title="Open WebBrowser" onPress={_handlePressButtonAsync} />

      {/* Option to input custom payment amount */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default AccountBalanceScreen;
