import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = 'http://172.16.0.73:8000';

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        // Simpan token, navigasi ke Home
        console.log('Token:', result.token);
        // navigation.replace('Home');
      } else {
        alert(result.message || 'Login gagal');
      }
    } catch (error) {
      alert('Tidak dapat terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="school" size={20} color="white" />
          <Text style={styles.headerTitle}>MASUK</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="siswa@smkpesat.sch.id"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { paddingRight: 44, flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lupa Password */}
          <TouchableOpacity style={{ marginBottom: 20 }}>
            <Text style={styles.forgotText}>Lupa kata sandi?</Text>
          </TouchableOpacity>

          {/* Tombol Masuk */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={() => router.push('/(tabs)')}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>MASUK</Text>
            }
          </TouchableOpacity>

        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>SISTEM PROFILING SISWA SMK PESAT</Text>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2C3E50',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  body: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1a1a1a',
    backgroundColor: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  forgotText: {
    color: '#E8581A',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  button: {
    backgroundColor: '#E8581A',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    letterSpacing: 3,
    color: '#888',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});