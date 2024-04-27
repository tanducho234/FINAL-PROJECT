import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { Button, Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";

const AccountBalanceScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [fullName, setFullName] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    fetchAccountBalance();
    fetchTransactions();

    // Listen for focus events on the screen
    const focusSubscription = navigation.addListener("focus", () => {
      // Refetch user's books when the screen gains focus
      fetchAccountBalance();
      fetchTransactions();
    });

    // Clean up the subscription
    return () => {
      focusSubscription();
    };
  }, [navigation]);

  const fetchAccountBalance = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/users/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data.accountBalance);
      setUserId(response.data.userId);
    } catch (error) {
      console.error("Error fetching account balance:", error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (amount) => {
    try {
      setLoading(true);
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/create_payment_url",
        {
          amount: amount,
          bankCode: "VNBANK",
          language: "vn",
          userId: userId,
        }
      );
      // Handle response (e.g., open payment URL in a webview)
      console.log("Payment URL:", response.data.vnpUrl);
      await WebBrowser.openBrowserAsync(response.data.vnpUrl);
    } catch (error) {
      console.error("Error initiating payment:", error);
    } finally {
      setLoading(false);
      fetchAccountBalance();
      fetchTransactions();
    }
  };
  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //sort from latest to oldest
      const transactions = response.data.sort((a, b) => {
        return new Date(b.transactionDate) - new Date(a.transactionDate);
      });
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  const handleCustomAmount = () => {
    Alert.prompt(
      "Enter Custom Amount",
      "Please enter an amount (divisible by 10.000):",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (input) => {
            const amount = parseFloat(input);
            if (isNaN(amount) || amount % 10000 !== 0) {
              Alert.alert(
                "Invalid Amount",
                "Please enter a valid amount divisible by 10,000."
              );
            } else {
              initiatePayment(amount);
            }
          },
        },
      ],
      "plain-text",
      customAmount
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>{fullName}</Text>
        <Text>
          Last transaction:
          {transactions.length > 0 ? (
            <Text
              style={{
                color:
                  transactions[0].type === "Top-up" ||
                  transactions[0].type === "Refund"
                    ? "green"
                    : "red",
              }}
            >
              {transactions[0].type === "Top-up" ||
              transactions[0].type === "Refund"
                ? "+"
                : "-"}
              {transactions[0].amount.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              ₫
            </Text>
          ) : (
            <Text>No transactions yet</Text>
          )}
        </Text>
        <Text style={styles.balanceText}>
          {balance.toLocaleString("vi-VN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          ₫
        </Text>
        {/* <Text>PNC Bank checking account</Text> */}
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.profileText}>Top-Up</Text>
          <Button
            title="Custom Amount"
            onPress={handleCustomAmount}
            disabled={loading}
          />
        </View>
        <View style={styles.settingRow}>
          <Button
            title="100.000 ₫"
            onPress={() => initiatePayment(100000)}
            disabled={loading}
          />
          <Button
            title="200.000 ₫"
            onPress={() => initiatePayment(200000)}
            disabled={loading}
          />
        </View>
      </View>

      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>Transaction History</Text>
        <FlatList
          style={{ marginBottom: 250, marginTop: 20 }}
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.settingRow}>
                <View>
                  <Text style={{ fontWeight: "bold" }}>{item.description}</Text>
                  <Text>
                    {new Date(item.transactionDate).toLocaleString("vi-VN")}
                  </Text>
                </View>
                <Text
                  style={{
                    color:
                      item.type === "Top-up" || item.type === "Refund"
                        ? "green"
                        : "red",
                  }}
                >
                  {item.type === "Top-up" || item.type === "Refund" ? "+" : "-"}
                  {item.amount.toLocaleString("vi-VN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₫
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceText: {
    fontSize: 50,
    marginTop: 8,
  },
  settingsContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 8,
  },
  balanceText: {
    fontSize: 30,
    marginVertical: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  listContainer: {
    width: "100%",
  },
});

export default AccountBalanceScreen;
