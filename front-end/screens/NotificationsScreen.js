import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import { Tab } from '@rneui/themed';


import axios from 'axios'; // Assuming you'll make API requests to fetch borrow requests
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = ({ navigation }) => {
    const [borrowRequestsReceived, setBorrowRequestsReceived] = useState([]);
    const [borrowRequestsSent, setBorrowRequestsSent] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const [index, setIndex] = useState(0);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchRequestsFromBorrowers()
            .then(() => {
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
        const focusSubscription = navigation.addListener('focus', () => {
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
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/borrow', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const sortedReceived = response.data.borrowRequestsReceived.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // Sort borrow requests sent by createdAt in descending order
            const sortedSent = response.data.borrowRequestsSent.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // Update the state with sorted arrays
            setBorrowRequestsReceived(sortedReceived);
            setBorrowRequestsSent(sortedSent);
        } catch (error) {
            console.error('Error fetching borrow requests:', error);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            // Implement logic to accept the borrow request with the given ID
            console.log('Accepted borrow request with ID:', requestId);
            handleRefresh();
        } catch (error) {
            console.error('Error accepting borrow request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            // Implement logic to reject the borrow request with the given ID
            console.log('Rejected borrow request with ID:', requestId);
        } catch (error) {
            console.error('Error rejecting borrow request:', error);
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
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                >
                    {borrowRequestsReceived.map((request) => (
                        <View key={request._id} style={styles.requestContainer}>
                            <Text>Borrower: {request.borrower.firstName} {request.borrower.lastName}</Text>
                            <Text>Book: {request.book.title}</Text>
                            <Text>Status: {request.status}</Text>
                            <Text>Status: {request.createdAt}</Text>

                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Accept"
                                    onPress={() => handleAcceptRequest(request._id)}
                                />
                                <Button
                                    title="Reject"
                                    onPress={() => handleRejectRequest(request._id)}
                                    color="red"
                                />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                >
                    {borrowRequestsSent.map((request) => (
                        <View key={request._id} style={styles.requestContainer}>
                            <Text>Request sent to: {request.lender.firstName} {request.lender.lastName}</Text>
                            <Text>Book: {request.book.title}</Text>
                            <Text>Status: {request.status}</Text>
                            <Text>CreateAt: {new Date(request.createdAt).toLocaleDateString()}</Text>

                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Cancel"
                                    onPress={() => handleRejectRequest(request._id)}
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
        fontWeight: 'bold',
        marginBottom: 10,
    },
    requestContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default NotificationsScreen;
