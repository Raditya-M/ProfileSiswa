import React, { useState, useEffect } from 'react';
import SideDrawer from '@/components/sidedrawer';
import {
  View, Text, ScrollView, StyleSheet,
  Platform, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// Konfigurasi Networking [cite: 63, 67]
const BASE_URL = 'http://172.16.0.68:8000/api'; 

export default function HomeScreen() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [counts, setCounts] = useState({ portfolio: 0, certificate: 0 });

  // Data Menu dengan Icon (Tetap dipertahankan)
  const menuItems = [
    { label: 'PROFIL',     icon: 'person-outline',           route: '/profile' },
    { label: 'NILAI',      icon: 'bar-chart-outline',        route: '/nilai' },
    { label: 'PORTOFOLIO', icon: 'folder-open-outline',      route: '/portofolio' },
    { label: 'PRESTASI',   icon: 'trophy-outline',           route: '/prestasi' },
    { label: 'SERTIFIKASI', icon: 'shield-checkmark-outline', route: '/sertifikat' },
    { label: 'CIS',         icon: 'school-outline',           route: '/cis' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Tahap 3.2: Fungsi Fetching GET [cite: 68, 69]
      const headers = { 'Accept': 'application/json' };

      const [resUser, resPorto, resCert] = await Promise.all([
        fetch(`${BASE_URL}/user`, { method: 'GET', headers }),
        fetch(`${BASE_URL}/portofolios`, { method: 'GET', headers }),
        fetch(`${BASE_URL}/sertifikasis`, { method: 'GET', headers })
      ]);

      if (!resUser.ok) throw new Error('Gagal ambil data User');

      const userDataJson = await resUser.json();
      const portoDataJson = await resPorto.json();
      const certDataJson = await resCert.json();

      setUserData(userDataJson);
      setCounts({
        portfolio: Array.isArray(portoDataJson) ? portoDataJson.length : 0,
        certificate: Array.isArray(certDataJson) ? certDataJson.length : 0
      });

    } catch (error: any) {
      console.error("Connection Error:", error.message);
      Alert.alert(
        "CONNECTION_ERROR", 
        "Gagal sinkronisasi data. Pastikan Laravel sudah jalan di IP 172.16.0.68"
      );
    } finally {
      setLoading(false); // Sesuai Tahap 3.2 [cite: 70]
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loadingText}>SYNCING_DATA...</Text>
      </View>
    );
  }

  const stats = [
    { label: 'PORTOFOLIO', value: counts.portfolio.toString() },
    { label: 'SERTIFIKASI', value: counts.certificate.toString() },
    { label: 'PRESTASI',   value: '0' },
    { label: 'RATA NILAI', value: '0' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>STUDENT PROFILE</Text>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={16} color={DARK} />
        </View>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card (Data Dinamis dari API) */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={44} color="white" />
          </View>
          <View style={styles.welcomeInfo}>
              <Text style={styles.welcomeGreeting}>Selamat datang,</Text>
              <Text style={styles.welcomeName}>{userData?.name || 'GUEST_USER'}</Text>
              <Text style={styles.welcomeClass}>{userData?.jurusan || 'PROG_DEPT'}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid2}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Kelengkapan Profil</Text>
            <Text style={styles.progressPercent}>{userData ? '100%' : '0%'}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: userData ? '100%' : '0%' }]} />
          </View>
        </View>

        {/* Menu Grid dengan Icon Lengkap */}
        <View style={styles.grid2}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.label} 
              style={styles.menuCard} 
              activeOpacity={0.75}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuCardInner}>
                <Ionicons name={item.icon as any} size={32} color={DARK} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8E6E1' },
  loadingText: { fontFamily: MONO, fontSize: 10, color: DARK, marginTop: 10, fontWeight: '700' },
  header: { backgroundColor: DARK, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: 'white', fontSize: 14, fontWeight: '700', letterSpacing: 2, fontFamily: MONO },
  headerAvatar: { width: 34, height: 34, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 2 },
  scroll: { flex: 1, backgroundColor: '#E8E6E1' },
  scrollContent: { padding: 12, gap: 10 },
  welcomeCard: { backgroundColor: DARK, borderWidth: 2, borderColor: '#1a1a1a', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 2 },
  avatarBox: { width: 80, height: 80, borderWidth: 2, borderColor: ORANGE, backgroundColor: '#3d5166', alignItems: 'center', justifyContent: 'center', borderRadius: 2 },
  welcomeInfo: { flex: 1 },
  welcomeGreeting: { color: '#aaa', fontSize: 13, fontFamily: MONO },
  welcomeName: { color: 'white', fontSize: 17, fontWeight: '700', fontFamily: MONO, marginTop: 2 },
  welcomeClass: { color: ORANGE, fontSize: 13, fontWeight: '700', fontFamily: MONO, marginTop: 4 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: 'white', borderWidth: 2, borderColor: '#1a1a1a', padding: 14, borderRadius: 2 },
  statValue: { fontSize: 26, fontWeight: '700', color: ORANGE, fontFamily: MONO },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#1a1a1a', letterSpacing: 1, fontFamily: MONO, marginTop: 4 },
  card: { backgroundColor: 'white', borderWidth: 2, borderColor: '#1a1a1a', padding: 14, borderRadius: 2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 12, color: '#1a1a1a', fontFamily: MONO },
  progressPercent: { fontSize: 12, fontWeight: '700', color: ORANGE, fontFamily: MONO },
  progressTrack: { height: 16, backgroundColor: DARK },
  progressFill: { height: '100%', backgroundColor: ORANGE },
  menuCard: { flex: 1, minWidth: '45%', height: 130, backgroundColor: 'white', borderWidth: 2, borderColor: '#1a1a1a', borderRadius: 2 },
  menuCardInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  menuLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: '#1a1a1a', fontFamily: MONO, textAlign: 'center' },
});