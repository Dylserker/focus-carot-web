import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../src/context/AuthContext';
import { achievementService } from '../../src/services/achievementService';
import { Achievement, UserAchievement } from '../../src/services/api';

const AchievementCard = ({ 
    achievement, 
    isUnlocked, 
    unlockDate 
}: { 
    achievement: Achievement; 
    isUnlocked: boolean;
    unlockDate?: string;
}) => {
    return (
        <View style={[
            styles.achievementCard,
            !isUnlocked && styles.lockedAchievement
        ]}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.name}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <Text style={styles.achievementPoints}>{achievement.points} points</Text>
                {isUnlocked && unlockDate && (
                    <Text style={styles.unlockDate}>
                        Débloqué le {new Date(unlockDate).toLocaleDateString('fr-FR')}
                    </Text>
                )}
            </View>
            {!isUnlocked && (
                <View style={styles.lockedOverlay}>
                    <Text style={styles.lockedText}>🔒</Text>
                </View>
            )}
            {isUnlocked && (
                <View style={styles.unlockedOverlay}>
                    <Text style={styles.unlockedText}>✅</Text>
                </View>
            )}
        </View>
    );
};

export default function AchievementsScreen() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadAchievements();
        }
    }, [isAuthenticated]);

    const loadAchievements = async () => {
        try {
            setIsLoading(true);
            
            // Charger tous les succès
            const achievementsResult = await achievementService.getAchievements();
            if (achievementsResult.success && achievementsResult.data) {
                setAchievements(achievementsResult.data);
            } else if (achievementsResult.message && (achievementsResult.message.includes('ID invalide') || achievementsResult.message.includes('401'))) {
                await logout();
                Alert.alert('Erreur', 'Session expirée, veuillez vous reconnecter.');
                return;
            } else {
                Alert.alert('Erreur', achievementsResult.message || 'Impossible de charger les succès');
            }

            // Charger les succès de l'utilisateur
            const userAchievementsResult = await achievementService.getUserAchievements();
            if (userAchievementsResult.success && userAchievementsResult.data) {
                setUserAchievements(userAchievementsResult.data);
            } else if (userAchievementsResult.message && (userAchievementsResult.message.includes('ID invalide') || userAchievementsResult.message.includes('401'))) {
                await logout();
                Alert.alert('Erreur', 'Session expirée, veuillez vous reconnecter.');
                return;
            } else {
                Alert.alert('Erreur', userAchievementsResult.message || 'Impossible de charger vos succès');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du chargement des succès');
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadAchievements();
        setIsRefreshing(false);
    };

    const stats = achievementService.getAchievementStats(achievements, userAchievements);

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mes Succès</Text>
                </View>
                <View style={styles.centerContainer}>
                    <Text style={styles.centerText}>Veuillez vous connecter pour voir vos succès</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes Succès</Text>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#f0ad4e" />
                    <Text style={styles.loadingText}>Chargement des succès...</Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={['#f0ad4e']}
                        />
                    }
                >
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {stats.unlockedAchievements}
                            </Text>
                            <Text style={styles.statLabel}>Débloqués</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {stats.totalAchievements}
                            </Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {stats.totalPoints}
                            </Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {stats.completionRate}%
                            </Text>
                            <Text style={styles.statLabel}>Progression</Text>
                        </View>
                    </View>

                    <View style={styles.achievementsContainer}>
                        {achievements.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Aucun succès disponible</Text>
                                <Text style={styles.emptySubtext}>Les succès apparaîtront ici</Text>
                            </View>
                        ) : (
                            achievements.map((achievement) => {
                                const isUnlocked = achievementService.isAchievementUnlocked(
                                    achievement.id, 
                                    userAchievements
                                );
                                const unlockDate = achievementService.getAchievementUnlockDate(
                                    achievement.id, 
                                    userAchievements
                                );

                                return (
                                    <AchievementCard
                                        key={achievement.id}
                                        achievement={achievement}
                                        isUnlocked={isUnlocked}
                                        unlockDate={unlockDate || undefined}
                                    />
                                );
                            })
                        )}
                    </View>
                </ScrollView>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    centerText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
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
        marginBottom: 5,
    },
    achievementPoints: {
        fontSize: 12,
        color: '#f0ad4e',
        fontWeight: 'bold',
    },
    unlockDate: {
        fontSize: 11,
        color: '#999',
        fontStyle: 'italic',
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
    unlockedOverlay: {
        position: 'absolute',
        right: 15,
        top: '50%',
        marginTop: -12,
    },
    unlockedText: {
        fontSize: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});