import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function Index() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            router.replace(user ? '/screen/home' : '/screen/login');
        }
    }, [isLoading, user]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.title}>Chargement...</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        marginTop: 16,
        color: '#666',
    },
});