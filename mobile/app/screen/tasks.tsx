import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, ImageBackground, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'à faire' | 'en cours' | 'terminé';
    date: Date;
    priority: 'basse' | 'moyenne' | 'haute';
    completed: boolean;
}

const TaskModal = ({ visible, onClose, onSubmit }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Task['status']>('à faire');
    const [date, setDate] = useState(new Date());
    const [priority, setPriority] = useState<Task['priority']>('basse');

    const handleSubmit = () => {
        onSubmit({
            title,
            description,
            status,
            date,
            priority
        });
        setTitle('');
        setDescription('');
        setStatus('à faire');
        setDate(new Date());
        setPriority('basse');
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
                        />

                        <TextInput
                            style={[styles.modalInput, styles.textArea]}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <View style={styles.selectContainer}>
                            <Text>Status:</Text>
                            {['à faire', 'en cours', 'terminé'].map((s) => (
                                <TouchableOpacity
                                    key={s}
                                    style={[styles.selectButton, status === s && styles.selectedButton]}
                                    onPress={() => setStatus(s as Task['status'])}
                                >
                                    <Text style={status === s ? styles.selectedButtonText : styles.buttonText}>
                                        {s}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.selectContainer}>
                            <Text>Priorité:</Text>
                            {[
                                { label: 'Basse (10 XP)', value: 'basse' },
                                { label: 'Moyenne (25 XP)', value: 'moyenne' },
                                { label: 'Haute (50 XP)', value: 'haute' }
                            ].map((p) => (
                                <TouchableOpacity
                                    key={p.value}
                                    style={[styles.selectButton, priority === p.value && styles.selectedButton]}
                                    onPress={() => setPriority(p.value as Task['priority'])}
                                >
                                    <Text style={priority === p.value ? styles.selectedButtonText : styles.buttonText}>
                                        {p.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.selectedButtonText}>Ajouter</Text>
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

    const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
        const task: Task = {
            id: Date.now().toString(),
            ...taskData,
            completed: false
        };
        setTasks([...tasks, task]);
    };

    const toggleTaskCompletion = (id: string) => {
        setTasks(
            tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
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
                    Status: {item.status} | Priorité: {item.priority}
                </Text>
            </View>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteBtn}>×</Text>
            </TouchableOpacity>
        </View>
    );

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

                    <FlatList
                        data={tasks}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                    />

                    <TaskModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSubmit={addTask}
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
        color: '#888',
        marginTop: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#5cb85c',
        marginRight: 10,
    },
    checked: {
        backgroundColor: '#5cb85c',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    deleteBtn: {
        color: '#ff6347',
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    selectContainer: {
        marginVertical: 10,
    },
    selectButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 5,
    },
    selectedButton: {
        backgroundColor: '#5cb85c',
        borderColor: '#5cb85c',
    },
    buttonText: {
        color: '#333',
    },
    selectedButtonText: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    submitButton: {
        padding: 10,
        backgroundColor: '#5cb85c',
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
});