import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Platform, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';

const stats = [
  { label: 'PORTOFOLIO', value: '12' },
  { label: 'SERTIFIKASI', value: '3' },
  { label: 'PRESTASI', value: '5' },
  { label: 'RATA NILAI', value: '85' },
];

const menuItems = [
  { label: 'PROFIL',      icon: 'person-outline',           route: '/profile' },
  { label: 'NILAI',       icon: 'bar-chart-outline',        route: '/nilai' },
  { label: 'PORTOFOLIO',  icon: 'folder-open-outline',      route: '/portofolio' },
  { label: 'PRESTASI',    icon: 'trophy-outline',           route: '/prestasi' },
  { label: 'SERTIFIKASI', icon: 'shield-checkmark-outline', route: '/sertifikat' },
  { label: 'CIS',         icon: 'school-outline',           route: '/cis' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="white" />
        <Text style={styles.headerTitle}>STUDENT PROFILE</Text>
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={16} color={DARK} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeGreeting}>Selamat datang,</Text>
            <Text style={styles.welcomeName}>Budi Santoso</Text>
            <Text style={styles.welcomeClass}>XII - Teknik Mesin</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Kelengkapan Profil</Text>
            <Text style={styles.progressPercent}>80%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons name={item.icon as any} size={32} color={DARK} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const mono = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E1',
  },
  header: {
    backgroundColor: DARK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: mono,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  scroll: {
    padding: 12,
    gap: 10,
  },

  // Welcome
  welcomeCard: {
    backgroundColor: DARK,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: '#3d5166',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeGreeting: {
    color: '#ccc',
    fontSize: 13,
    fontFamily: mono,
  },
  welcomeName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: mono,
    marginTop: 2,
  },
  welcomeClass: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: mono,
    marginTop: 4,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    padding: 14,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: ORANGE,
    fontFamily: mono,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 1,
    fontFamily: mono,
    marginTop: 4,
  },

  // Progress
  progressCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    padding: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: '#1a1a1a',
    fontFamily: mono,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: ORANGE,
    fontFamily: mono,
  },
  progressTrack: {
    height: 14,
    backgroundColor: DARK,
    borderRadius: 0,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ORANGE,
  },

  // Menu
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  menuCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 10,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#1a1a1a',
    fontFamily: mono,
  },
});