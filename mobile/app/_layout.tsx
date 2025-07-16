import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import Footer from '../components/Footer';
import { HeaderBackground, HeaderLeft, HeaderRight } from '../components/Header';

function AppLayoutContent() {
    const { user, isLoading } = useAuth();

    // Afficher un indicateur de chargement pendant que l'authentification se charge
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f0ad4e" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack screenOptions={{
                headerShown: true,
                headerTitle: "",
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: 'transparent',
                },
                headerBackground: HeaderBackground,
                headerLeft: HeaderLeft,
                headerRight: HeaderRight,
                gestureEnabled: false,
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="screen/login" />
                <Stack.Screen name="screen/register" />
                <Stack.Screen name="screen/home" />
                <Stack.Screen name="screen/tasks" />
                <Stack.Screen name="screen/achievements" />
                <Stack.Screen name="screen/profile" />
                <Stack.Screen name="settings" />
            </Stack>
            {user && <Footer />}
        </View>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppLayoutContent />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 70,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});