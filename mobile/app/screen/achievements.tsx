import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

const achievementsData: Achievement[] = [
    {
        id: '1',
        title: 'Première tâche',
        description: 'Vous avez complété votre première tâche',
        icon: '🏆',
        unlocked: true,
    },
    {
        id: '2',
        title: 'Dix tâches',
        description: 'Vous avez complété dix tâches',
        icon: '⭐',
        unlocked: true,
    },
    {
        id: '3',
        title: 'Tâche difficile',
        description: 'Vous avez complété une tâche difficile',
        icon: '🥇',
        unlocked: false,
    },
    {
        id: '4',
        title: 'Master organisateur',
        description: 'Vous avez complété 50 tâches',
        icon: '🎖️',
        unlocked: false,
    },
    {
        id: '5',
        title: 'Persévérance',
        description: 'Vous avez utilisé l\'application pendant 30 jours consécutifs',
        icon: '🔄',
        unlocked: false,
    },
];

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    return (
        <View style={[
            styles.achievementCard,
            !achievement.unlocked && styles.lockedAchievement
        ]}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
            {!achievement.unlocked && (
                <View style={styles.lockedOverlay}>
                    <Text style={styles.lockedText}>🔒</Text>
                </View>
            )}
        </View>
    );
};

export default function AchievementsScreen() {
    const [achievements, setAchievements] = useState<Achievement[]>(achievementsData);

    useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes Succès</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {achievements.filter(a => a.unlocked).length}
                        </Text>
                        <Text style={styles.statLabel}>Débloqués</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {achievements.length}
                        </Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                </View>

                <View style={styles.achievementsContainer}>
                    {achievements.map((achievement) => (
                        <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#f0ad4e',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        marginBottom: 60,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f0ad4e',
    },
    statLabel: {
        fontSize: 14,
        color: '#777',
    },
    achievementsContainer: {
        padding: 15,
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        position: 'relative',
    },
    achievementIcon: {
        fontSize: 30,
        marginRight: 15,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    achievementDescription: {
        fontSize: 14,
        color: '#666',
    },
    lockedAchievement: {
        opacity: 0.7,
    },
    lockedOverlay: {
        position: 'absolute',
        right: 15,
        top: '50%',
        marginTop: -12,
    },
    lockedText: {
        fontSize: 24,
    },
});