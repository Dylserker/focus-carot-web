import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Footer from '../../components/Footer';

const CustomizationScreen = () => {
    const [selectedTab, setSelectedTab] = useState('chibi');

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Text style={styles.title}>Personnalisation</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'chibi' && styles.activeTab]}
                    onPress={() => setSelectedTab('chibi')}
                >
                    <Text style={styles.tabText}>Personnage</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'room' && styles.activeTab]}
                    onPress={() => setSelectedTab('room')}
                >
                    <Text style={styles.tabText}>Chambre</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.contentContainer}>
                {selectedTab === 'chibi' ? (
                    <View style={styles.customizationSection}>
                        <Text style={styles.sectionTitle}>Personnalisation du personnage</Text>
                        <Text style={styles.comingSoonText}>
                            La personnalisation du personnage sera bientôt disponible !
                        </Text>
                    </View>
                ) : (
                    <View style={styles.customizationSection}>
                        <Text style={styles.sectionTitle}>Personnalisation de la chambre</Text>
                        <Text style={styles.comingSoonText}>
                            La personnalisation de la chambre sera bientôt disponible !
                        </Text>
                    </View>
                )}
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 70,
    },
    header: {
        backgroundColor: '#9370DB',
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#9370DB',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    customizationSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    comingSoonText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
    }
});

export default CustomizationScreen;