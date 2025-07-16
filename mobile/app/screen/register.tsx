import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, isLoading } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        // Validation de base
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', "Les mots de passe ne correspondent pas");
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await register(name, email, password);
            if (result.success) {
                router.replace('/screen/home');
            } else {
                Alert.alert('Erreur d\'inscription', result.message || 'Veuillez réessayer');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur inattendue s\'est produite');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isButtonDisabled = isLoading || isSubmitting;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Inscription</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={name}
                    onChangeText={setName}
                    editable={!isButtonDisabled}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isButtonDisabled}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isButtonDisabled}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!isButtonDisabled}
                />

                <TouchableOpacity
                    style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isButtonDisabled}
                >
                    {isButtonDisabled ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Déjà un compte ? </Text>
                    <Link href="/screen/login" style={styles.link}>Se connecter</Link>
                </View>
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
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#7fb7e6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    linkText: {
        color: '#666',
    },
    link: {
        color: '#007BFF',
    },
});