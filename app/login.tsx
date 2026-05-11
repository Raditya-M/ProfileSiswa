import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// IP sesuai dengan konfigurasi Laravel --host
const BASE_URL = 'http://172.16.0.68:8000/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validasi dasar sebelum menembak API
    if (!email || !password) {
      Alert.alert('Peringatan', 'Email dan password wajib diisi!');
      return;
    }

    setIsLoading(true);

    try {
      // Menggunakan Fetch API sesuai standar LKPD
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Login Berhasil, Token:', result.token);
        
        await AsyncStorage.setItem('userToken', result.token);
        if (result.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(result.user));
        }

        Alert.alert('Sukses', 'Selamat datang kembali!');
        router.replace('/(tabs)'); 
      } else {
        // Jika login gagal (Status 401/422)
        Alert.alert('Gagal Masuk', result.message || 'Email atau password salah.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Kesalahan Jaringan', 
        'Tidak dapat terhubung ke server. Pastikan Laravel sudah running di host 172.16.0.73'
      );
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
          <Text style={styles.headerTitle}>AUTHENTICATION_GATE</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL_ADDRESS</Text>
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
            <Text style={styles.label}>PASSWORD</Text>
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
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>EXECUTE_LOGIN</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>SISTEM PROFILING SISWA SMK PESAT v2.0</Text>

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
    // Efek Brutalist Shadow
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  header: {
    backgroundColor: DARK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: MONO,
  },
  body: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    fontFamily: MONO,
  },
  input: {
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1a1a1a',
    backgroundColor: 'white',
    fontFamily: MONO,
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
    color: ORANGE,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: MONO,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: ORANGE,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingVertical: 16,
    alignItems: 'center',
    // Brutalist Shadow untuk tombol
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: MONO,
  },
  footer: {
    marginTop: 30,
    fontSize: 9,
    letterSpacing: 2,
    color: '#888',
    fontFamily: MONO,
    textAlign: 'center',
  },
});