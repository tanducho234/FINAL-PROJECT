import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Tab, ButtonGroup } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import axios from "axios"; // Assuming you'll make API requests to fetch borrow requests
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsScreen = ({ navigation }) => {
  const [borrowRequestsReceived, setBorrowRequestsReceived] = useState([]);
  const [borrowRequestsSent, setBorrowRequestsSent] = useState([]);
  const [userId, setUserID] = useState("");

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
    fetchRequestsFromBorrowers();

    const ws = new WebSocket("ws://localhost:8080");
    console.log(ws);

    ws.onmessage = async (event) => {
      const message = event.data;
      const messageData = JSON.parse(message);
      tempUserId = await AsyncStorage.getItem("userId");
      console.log("userId", tempUserId, "  ", messageData);
      // Access individual fields from the message data object
      const id1 = messageData.id1;
      const id2 = messageData.id2;
      const type = messageData.type;

      if (
        id1 === tempUserId ||
        id2 === tempUserId ||
        type === "BorrowRequestDeleted"
      ) {
        // fetchAllBorrowBookRequest(); // Call your fetch function
        console.log("BorrowRequestChange");
        handleRefresh();
      }
    };

    // const focusSubscription = navigation.addListener("focus", () => {
    //   // Refetch user's books when the screen gains focus
    //   fetchRequestsFromBorrowers();
    // });

    // Clean up the subscription
    return () => {
      ws.close();
      // focusSubscription();
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
      setUserID(response.data.userId);
      setBorrowRequestsReceived(sortedReceived);
      setBorrowRequestsSent(sortedSent);
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
    }
  };
  const handleReturned = async (requestId, depositFee, userId) => {
    try {
      // Implement logic to accept the borrow request with the given ID
      Alert.alert(
        "Confirm",
        "Are you sure you that you already received your book from borrower",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
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
            },
          },
        ]
      );
      console.log("Accepted borrow request with ID:", requestId);
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error("Error accepting borrow request:", error);
    }
  };

  const handleInReturing = async (requestId, depositFee, userId) => {
    try {
      // Implement logic to accept the borrow request with the given ID
      Alert.alert(
        "Confirm",
        "Are you sure you that you already returned the book to the lender",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
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
      Alert.alert("Error", "Something went wrong");
      console.error("Error accepting borrow request:", error);
    }
  };

  const handleReceived = async (requestId, depositFee, userId) => {
    try {
      // Implement logic to accept the borrow request with the given ID
      Alert.alert(
        "Confirm",
        "Are you sure you that you already received the book",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
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
      Alert.alert("Error", "Something went wrong");
      console.error("Error accepting borrow request:", error);
    }
  };
  const handleInDelivering = async (requestId, depositFee, userId) => {
    try {
      // Implement logic to accept the borrow request with the given ID
      Alert.alert(
        "Confirm",
        "Are you sure you that you already sent this book",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
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
      Alert.alert("Error", "Something went wrong");
      console.error("Error accepting borrow request:", error);
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
      //alert that something went wrong
      Alert.alert("Error", "Something went wrong");
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
      Alert.alert("Error", "Something went wrong");
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
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <ButtonGroup
        buttonContainerStyle={{ backgroundColor: "white" }}
        buttons={["Requests Sented", "Requests Received"]}
        containerStyle={{
          backgroundColor: "white",
        }}
        innerBorderStyle={{}}
        onPress={(selectedIdx) => setIndex(selectedIdx)}
        buttonStyle={{}}
        selectedButtonStyle={{}}
        textStyle={{}}
        selectedTextStyle={{}}
        selectedIndex={index}
      />
      {index === 1 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {borrowRequestsReceived.map((request) => (
            <View key={request._id} style={styles.requestContainer}>
              <View style={styles.requestRow}>
                <Text>From : </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Message", { screen: "Messages" }); // Navigate to MessagesScreen first
                    setTimeout(() => {
                      navigation.navigate("Message", {
                        screen: "Chat",
                        params: {
                          receiverName:
                            request.borrower.firstName +
                            " " +
                            request.borrower.lastName, // Swapped
                          senderId: request.lender._id, // Swapped
                          receiverId: request.borrower._id, // Swapped
                          senderAvatarViewLink: request.lenderViewLink, // Swapped
                          receiverAvatarViewLink: request.borrowerViewLink, // Swapped
                          senderName:
                            request.lender.firstName +
                            " " +
                            request.lender.lastName, // Swapped
                        },
                      });
                    }, 100); // Delay the navigation to ChatScreen
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      flexWrap: "wrap",
                      maxWidth: "70%",
                    }}
                  >
                    {request.borrower.firstName} {request.borrower.lastName} (
                    {request.borrower.address})
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
                <Text styles={{}}>
                  {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </View>

              <View style={styles.requestRow}>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {request.book.title}
                </Text>
              </View>
              <View style={styles.requestRow}>
                <View style={styles.requestInfo}>
                  <Text
                    style={{
                      color:
                        request.book.status === "Available" ? "green" : "red",
                    }}
                  >
                    Book is {request.book.status}
                  </Text>
                  <Text>
                    Deposit Fee:{" "}
                    {request.depositFee.toLocaleString("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    ₫{" "}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    // turn yellow if request,status='Pending', turn red if 'Rejected', turn 'green' if Accepted
                    color:
                      request.status === "Pending" ||
                      request.status === "In Returning"
                        ? "#f4a739"
                        : request.status === "Rejected"
                        ? "red"
                        : request.status === "In Delivering"
                        ? "#3498db"
                        : request.status === "On Hold"
                        ? "#9b59b6"
                        : "green",
                  }}
                >
                  {request.status}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                {request.status === "Pending" && (
                  <Button
                    buttonStyle={{ borderWidth: 10 }}
                    title="Accept this request"
                    disabled={
                      request.book.status !== "Available" || refreshing === true
                    }
                    onPress={() =>
                      handleAcceptRequest(
                        request._id,
                        request.depositFee,
                        request.borrower
                      )
                    }
                  />
                )}
                {request.status === "Pending" && (
                  <Button
                    disabled={
                      request.status !== "Pending" || refreshing === true
                    }
                    title="Reject this request"
                    onPress={() =>
                      handleRejectRequest(
                        request._id,
                        request.depositFee,
                        request.borrower
                      )
                    }
                    color="red"
                  />
                )}

                {request.status === "Accepted" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "green",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      Use the button bellow to confirm that you already sent
                      your book.
                    </Text>
                    <Button
                      disabled={refreshing}
                      title="I have sent my book."
                      onPress={() =>
                        handleInReturing(
                          request._id,
                          request.depositFee,
                          request.borrower
                        )
                      }
                      color="#3498db"
                    />
                  </View>
                )}

                {request.status === "In Delivering" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#3498db",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      This borrow request's status will be update after borrwer
                      received the book
                    </Text>
                  </View>
                )}

                {request.status === "Returned" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "green",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      Your book is now Available again!
                    </Text>
                  </View>
                )}
                {request.status === "On Hold" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#9b59b6",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      Wating for the borrower to return the book.
                    </Text>
                  </View>
                )}
                {request.status === "In Returning" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#f39c12",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      If you have received the book, use the button update the
                      borrow request's status.
                    </Text>
                    <Button
                      disabled={refreshing}
                      title="I have received my book."
                      onPress={() =>
                        handleReturned(
                          request._id,
                          request.depositFee,
                          request.borrower
                        )
                      }
                      color="green"
                    />
                  </View>
                )}
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
                <Text>To : </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Message", { screen: "Messages" }); // Navigate to MessagesScreen first
                    setTimeout(() => {
                      navigation.navigate("Message", {
                        screen: "Chat",
                        params: {
                          receiverName:
                            request.lender.firstName +
                            " " +
                            request.lender.lastName,
                          senderId: request.borrower._id,
                          receiverId: request.lender._id,
                          senderAvatarViewLink: request.borrowerViewLink,
                          receiverAvatarViewLink: request.lenderViewLink,
                          senderName:
                            request.borrower.firstName +
                            " " +
                            request.borrower.lastName,
                        },
                      });
                    }, 100); // Delay the navigation to ChatScreen
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {request.lender.firstName} {request.lender.lastName} (
                    {request.lender.address})
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
                <Text styles={{}}>
                  {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </View>

              <View style={styles.requestRow}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {request.book.title}
                </Text>
              </View>
              <View style={styles.requestRow}>
                <View style={styles.requestInfo}>
                  {/* <Text
                    style={{
                      color:
                        request.book.status === "Available" ? "green" : "red",
                    }}
                  >
                    Book is {request.book.status}
                  </Text> */}
                  <Text>
                    Deposit Fee:{" "}
                    {request.depositFee.toLocaleString("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    ₫{" "}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    // turn yellow if request,status='Pending'
                    color:
                      request.status === "Pending" ||
                      request.status === "In Returning"
                        ? "#f4a739"
                        : request.status === "Rejected"
                        ? "red"
                        : request.status === "In Delivering"
                        ? "#3498db"
                        : request.status === "On Hold"
                        ? "#9b59b6"
                        : "green",
                  }}
                >
                  {request.status}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                {request.status === "Pending" && (
                  <Button
                    //hide if status != pending
                    disabled={
                      request.status !== "Pending" || refreshing === true
                    }
                    title="Cancel this request"
                    onPress={() =>
                      handleCancelRequest(
                        request._id,
                        request.depositFee,
                        request.borrower
                      )
                    }
                    color="red"
                  />
                )}
                {request.status === "Rejected" && (
                  <Text
                    style={{
                      fontSize: 15,
                      color: "red",
                      marginTop: 2,
                      fontStyle: "italic",
                    }}
                  >
                    Your Deposit Fee has been refunded!
                  </Text>
                )}
                {request.status === "On Hold" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#9b59b6",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      Done reading and returned the book?
                    </Text>
                    <Button
                      disabled={refreshing}
                      title="I have returned the book."
                      onPress={() =>
                        handleInReturing(
                          request._id,
                          request.depositFee,
                          request.borrower
                        )
                      }
                      color="green"
                    />
                  </View>
                )}

                {request.status === "In Returning" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#f4a739",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      Wating for the lender to confirm that you have returned.
                    </Text>
                  </View>
                )}

                {request.status === "Accepted" && (
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#007AFF",
                      marginTop: 2,
                      fontStyle: "italic",
                    }}
                  >
                    Be Patient! The lender will send the book to you soon.
                  </Text>
                )}
                {request.status === "In Delivering" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#3498db",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      If you have received the book, please update request's
                      status using the button below
                    </Text>
                    <Button
                      disabled={refreshing}
                      title="I have received the book."
                      onPress={() =>
                        handleReceived(
                          request._id,
                          request.depositFee,
                          request.borrower
                        )
                      }
                      color="#9b59b6"
                    />
                  </View>
                )}
                {request.status === "Returned" && (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "green",
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      Your Deposit Fee has been refunded!
                    </Text>
                  </View>
                )}
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
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    borderTopWidth: 1,

    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  requestContainer: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    //Shadow
    shadowColor: "#BBBBBB",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "start",
    marginBottom: 8,
  },
  requestInfo: {
    flex: 1,
  },
});

export default NotificationsScreen;
