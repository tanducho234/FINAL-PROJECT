import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { Tab } from "@rneui/themed";

import axios from "axios"; // Assuming you'll make API requests to fetch borrow requests
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsScreen = ({ navigation }) => {
  const [borrowRequestsReceived, setBorrowRequestsReceived] = useState([]);
  const [borrowRequestsSent, setBorrowRequestsSent] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequestsFromBorrowers().then(() => {
      // Add a delay of 1 second (1000 milliseconds) before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    });
  };

  useEffect(() => {
    // Fetch borrow requests received by the current user
    fetchRequestsFromBorrowers();

    // Listen for focus events on the screen
    const focusSubscription = navigation.addListener("focus", () => {
      // Refetch user's books when the screen gains focus
      fetchRequestsFromBorrowers();
    });

    // Clean up the subscription
    return () => {
      focusSubscription();
    };
  }, [navigation]);

  const fetchRequestsFromBorrowers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/borrow", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedReceived = response.data.borrowRequestsReceived.sort(
        (a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      );

      // Sort borrow requests sent by createdAt in descending order
      const sortedSent = response.data.borrowRequestsSent.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Update the state with sorted arrays
      setBorrowRequestsReceived(sortedReceived);
      setBorrowRequestsSent(sortedSent);
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
    }
  };
  const handleCancelRequest = async (requestId, depositFee, userId) => {
    try {
      // Display confirmation alert
      Alert.alert(
        "Confirm",
        "Are you sure you want to cancel this borrow request?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              // Call axios to delete borrow request
              await axios.get(
                `http://localhost:3000/borrow/delete/${requestId}`,
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );

              // Implement logic to cancel the borrow request with the given ID
              console.log("Cancelled borrow request with ID:", requestId);

              // Refund deposit fee
              await axios.post(
                `http://localhost:3000/transactions`,
                {
                  userId: userId,
                  amount: depositFee, // Subtracting the deposit fee from the user's account balance
                  type: "Refund",
                  description: `Refund deposit fee`,
                },
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );

              // Update user's balance
              const updatedBalance = await axios.post(
                `http://localhost:3000/users/update-balance`,
                {
                  user_id: userId, // Assuming userId is already defined in the component
                  amount: depositFee, // Subtracting the deposit fee from the balance
                },
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );

              // Call handleRefresh function to update UI
              handleRefresh();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error cancelling borrow request:", error);
    }
  };
  const handleAcceptRequest = async (requestId, depositFee, userId) => {
    try {
      // Implement logic to accept the borrow request with the given ID
      Alert.alert(
        "Confirm",
        "Are you sure you want to accept this borrow request?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              // Call axios to delete borrow request
              await axios.get(
                `http://localhost:3000/borrow/accept/${requestId}`,
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );
              // Call handleRefresh function to update UI
              handleRefresh();
            },
          },
        ]
      );
      console.log("Accepted borrow request with ID:", requestId);
    } catch (error) {
      console.error("Error accepting borrow request:", error);
    }
  };

  const handleRejectRequest = async (requestId, depositFee, userId) => {
    try {
      Alert.alert(
        "Confirm",
        "Are you sure you want to Reject this borrow request?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              // Call axios to delete borrow request
              await axios.get(
                `http://localhost:3000/borrow/reject/${requestId}`,
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );

              // Implement logic to cancel the borrow request with the given ID
              // Refund deposit fee
              await axios.post(
                `http://localhost:3000/transactions`,
                {
                  userId: userId,
                  amount: depositFee, // Subtracting the deposit fee from the user's account balance
                  type: "Refund",
                  description: `Refund deposit fee`,
                },
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );

              // Update user's balance
              const updatedBalance = await axios.post(
                `http://localhost:3000/users/update-balance`,
                {
                  user_id: userId, // Assuming userId is already defined in the component
                  amount: depositFee, // Subtracting the deposit fee from the balance
                },
                {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                }
              );

              // Call handleRefresh function to update UI
              handleRefresh();
            },
          },
        ]
      );
      // Implement logic to reject the borrow request with the given ID
      console.log("Rejected borrow request with ID:", requestId);
    } catch (error) {
      console.error("Error rejecting borrow request:", error);
    }
  };

  return (
    <View style={styles.container}>
      <>
        <Tab value={index} onChange={setIndex} dense>
          <Tab.Item>Requests Received</Tab.Item>
          <Tab.Item>Requests Sent</Tab.Item>
        </Tab>
      </>
      {index === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {borrowRequestsReceived.map((request) => (
            <View key={request._id} style={styles.requestContainer}>
              <View style={styles.requestRow}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {request.book.title}
                </Text>
              </View>
              <View style={styles.requestRow}>
                <View style={styles.requestInfo}>
                  <Text>
                    Borrower: {request.borrower.firstName}{" "}
                    {request.borrower.lastName}
                  </Text>
                  {/* deposit fee */}
                  <Text>
                    Deposit Fee:{" "}
                    {request.depositFee.toLocaleString("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    ₫{" "}
                  </Text>
                  <Text>
                    Create At:{" "}
                    {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    // turn yellow if request,status='Pending', turn red if 'Rejected', turn 'green' if Accepted
                    color:
                      request.status === "Pending"
                        ? "#f4a739"
                        : request.status === "Rejected"
                        ? "red"
                        : "green",
                  }}
                >
                  {request.status}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  disabled={request.status !== "Pending"}
                  title="Accept"
                  onPress={() =>
                    handleAcceptRequest(
                      request._id,
                      request.depositFee,
                      request.borrower
                    )
                  }
                />

                <Button
                  disabled={request.status !== "Pending"}
                  title="Reject"
                  onPress={() =>
                    handleRejectRequest(
                      request._id,
                      request.depositFee,
                      request.borrower
                    )
                  }
                  color="red"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {borrowRequestsSent.map((request) => (
            <View key={request._id} style={styles.requestContainer}>
              <View style={styles.requestRow}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {request.book.title}
                </Text>
              </View>
              <View style={styles.requestRow}>
                <View style={styles.requestInfo}>
                  <Text>
                    Owner: {request.lender.firstName} {request.lender.lastName}
                  </Text>
                  <Text>
                    Deposit Fee:{" "}
                    {request.depositFee.toLocaleString("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    ₫{" "}
                  </Text>
                  <Text>
                    Create At:{" "}
                    {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    // turn yellow if request,status='Pending'
                    color:
                      request.status === "Pending"
                        ? "#f4a739"
                        : request.status === "Rejected"
                        ? "red"
                        : "green",
                  }}
                >
                  {request.status}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  //hide if status != pending
                  disabled={request.status !== "Pending"}
                  title="Cancel"
                  onPress={() =>
                    handleCancelRequest(
                      request._id,
                      request.depositFee,
                      request.borrower
                    )
                  }
                  color="red"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  requestContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 8,
  },
  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: 8,
  },
  requestInfo: {
    flex: 1,
  },
});

export default NotificationsScreen;
