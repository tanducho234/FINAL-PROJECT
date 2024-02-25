import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Asset } from 'expo';

const LoadingPage = () => {
    return (
        <View style={styles.container}>
            {/* Assuming logo.png is your logo image */}
            <Image source={require('../image/logo.png')} style={styles.logo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00b250',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain', // Adjust this based on your logo aspect ratio
    },
});

export default LoadingPage;
