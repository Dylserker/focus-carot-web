import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { router } from 'expo-router';

const Footer = () => {
    const { logout } = useAuth();

    const navigateToHome = () => {
        router.push('/');
    };

    const navigateToProfile = () => {
        router.push('/screen/profile');
    };

    const navigateToTasks = () => {
        router.push('/screen/tasks');
    };

    const navigateToAchievements = () => {
        router.push('/screen/achievements');
    };

    const navigateToCustomization = () => {
        router.push('/screen/customization');
    };

    return (
        <View style={styles.footer}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={navigateToProfile}
                >
                    <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">Profil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tasksButton}
                    onPress={navigateToTasks}
                >
                    <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">Tâches</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.achievementsButton}
                    onPress={navigateToAchievements}
                >
                    <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">Succès</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.customizationButton}
                    onPress={navigateToCustomization}
                >
                    <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">Personnalisation</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8f8f8',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
        maxWidth: '100%',
        marginHorizontal: 'auto',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    profileButton: {
        padding: 6,
        backgroundColor: '#4682B4',
        borderRadius: 5,
        margin: 2,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tasksButton: {
        padding: 6,
        backgroundColor: '#5cb85c',
        borderRadius: 5,
        margin: 2,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    achievementsButton: {
        padding: 6,
        backgroundColor: '#f0ad4e',
        borderRadius: 5,
        margin: 2,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customizationButton: {
        padding: 6,
        backgroundColor: '#9370DB',
        borderRadius: 5,
        margin: 2,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
    },
});

export default Footer;