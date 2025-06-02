import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const HeaderBackground = () => (
    <ImageBackground
        source={require('../assets/images/Sol.png')}
        style={styles.headerBackground}
        resizeMode="cover"
    />
);

export const HeaderLeft = () => {
    const router = useRouter();

    const navigateToHome = () => {
        router.replace('/screen/home');
    };

    return (
        <TouchableOpacity
            style={styles.homeButton}
            onPress={navigateToHome}
        >
            <Image
                source={require('../assets/logo/Logo_sans_titre.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

export const HeaderRight = () => {
    const router = useRouter();

    const navigateToSettings = () => {
        router.replace('/settings');
    };

    return (
        <TouchableOpacity
            style={styles.settingsButton}
            onPress={navigateToSettings}
        >
            <Ionicons name="settings-outline" size={28} color="#090909FF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    headerBackground: {
        width: '100%',
        height: 80,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(213,151,101,0)',
        borderRadius: 8,
        marginLeft: -10,
        marginTop: 5,
        gap: 5
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 8,
        gap: 5
    },
    buttonText: {
        color: '#f0ad4e',
        fontWeight: 'bold',
        fontSize: 12
    },
    logoImage: {
        width: 60,
        height: 60,
    }
});