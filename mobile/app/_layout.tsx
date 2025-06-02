import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from '../components/Footer';
import { HeaderBackground, HeaderLeft, HeaderRight } from '../components/Header';

function AppLayoutContent() {
    const { user } = useAuth();

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
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
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
});