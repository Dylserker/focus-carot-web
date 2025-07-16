import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, ImageBackground, Modal, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { taskService } from '../../src/services/taskService';
import { Task } from '../../src/services/api';

const TaskModal = ({ visible, onClose, onSubmit, isLoading }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (task: { title: string; description: string }) => void;
    isLoading: boolean;
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        const validation = taskService.validateTaskData({ title, description });
        if (!validation.isValid) {
            Alert.alert('Erreur de validation', validation.errors.join('\n'));
            return;
        }

        onSubmit({ title: title.trim(), description: description.trim() });
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.modalTitle}>Nouvelle tâche</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Titre"
                            value={title}
                            onChangeText={setTitle}
                            editable={!isLoading}
                        />

                        <TextInput
                            style={[styles.modalInput, styles.textArea]}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            editable={!isLoading}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={onClose}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.submitButton, isLoading && styles.buttonDisabled]} 
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.selectedButtonText}>Ajouter</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated } = useAuth();

    // Charger les tâches au montage du composant
    useEffect(() => {
        if (isAuthenticated) {
            loadTasks();
        }
    }, [isAuthenticated]);

    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const result = await taskService.getTasks();
            if (result.success && result.data) {
                setTasks(result.data);
            } else {
                Alert.alert('Erreur', result.message || 'Impossible de charger les tâches');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du chargement des tâches');
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async (taskData: { title: string; description: string }) => {
        setIsSubmitting(true);
        try {
            const result = await taskService.createTask(taskData);
            if (result.success && result.data) {
                setTasks([result.data, ...tasks]);
                Alert.alert('Succès', 'Tâche créée avec succès');
            } else {
                Alert.alert('Erreur', result.message || 'Impossible de créer la tâche');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la création de la tâche');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTaskCompletion = async (id: string) => {
        try {
            const result = await taskService.toggleTaskComplete(id);
            if (result.success && result.data) {
                setTasks(tasks.map(task =>
                    task.id === id ? result.data! : task
                ));
            } else {
                Alert.alert('Erreur', result.message || 'Impossible de modifier la tâche');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la modification de la tâche');
        }
    };

    const deleteTask = async (id: string) => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer cette tâche ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await taskService.deleteTask(id);
                            if (result.success) {
                                setTasks(tasks.filter(task => task.id !== id));
                                Alert.alert('Succès', 'Tâche supprimée avec succès');
                            } else {
                                Alert.alert('Erreur', result.message || 'Impossible de supprimer la tâche');
                            }
                        } catch (error) {
                            Alert.alert('Erreur', 'Erreur lors de la suppression de la tâche');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity
                style={[styles.checkbox, item.completed && styles.checked]}
                onPress={() => toggleTaskCompletion(item.id)}
            />
            <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                    {item.title}
                </Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskDetails}>
                    Créée le: {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                </Text>
            </View>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteBtn}>×</Text>
            </TouchableOpacity>
        </View>
    );

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Veuillez vous connecter pour voir vos tâches</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.backgroundImage}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Liste de tâches</Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.loadingText}>Chargement des tâches...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={tasks}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            style={styles.list}
                            refreshing={isLoading}
                            onRefresh={loadTasks}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Aucune tâche pour le moment</Text>
                                    <Text style={styles.emptySubtext}>Appuyez sur + pour ajouter une tâche</Text>
                                </View>
                            }
                        />
                    )}

                    <TaskModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSubmit={addTask}
                        isLoading={isSubmitting}
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#5cb85c',
        borderRadius: 5,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        marginBottom: 10,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    taskDetails: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 10,
    },
    checked: {
        backgroundColor: '#5cb85c',
        borderColor: '#5cb85c',
    },
    deleteBtn: {
        color: '#dc3545',
        fontSize: 24,
        fontWeight: 'bold',
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#5cb85c',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#7fb7e6',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    selectedButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptySubtext: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        opacity: 0.8,
    },
});