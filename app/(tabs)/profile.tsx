import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SideDrawer from '@/components/sidedrawer';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const GREEN = '#27AE60';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// TODO: ganti dengan fetch GET /api/user
const DUMMY_PROFILE = {
  nama: 'BUDI SANTOSO',
  status: 'AKTIF',
  nis: '12903482',
  jurusan: 'TEKNIK MESIN',
  kelas: 'KELAS XII-A',
  tempat_lahir: 'Bandung',
  tanggal_lahir: '15 Agustus 2005',
  agama: 'Islam',
  jenis_kelamin: 'Laki-laki',
  alamat: 'Jl. Merdeka No. 45, Kecamatan Sumur Bandung, Kota Bandung, Jawa Barat 40111',
  no_telepon: '+62 812-3456-7890',
  sosmed: {
    instagram: '@budi_santoso',
    linkedin: 'in/budi-santoso',
    github: 'github.com/budisantoso',
  },
};

type SosmedItem = {
  key: keyof typeof DUMMY_PROFILE.sosmed;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const SOSMED_ITEMS: SosmedItem[] = [
  { key: 'instagram', label: 'INSTAGRAM', icon: 'link-outline' },
  { key: 'linkedin',  label: 'LINKEDIN',  icon: 'briefcase-outline' },
  { key: 'github',    label: 'GITHUB',    icon: 'code-slash-outline' },
];

const DATA_DIRI: { label: string; key: keyof typeof DUMMY_PROFILE }[] = [
  { label: 'TEMPAT, TGL LAHIR', key: 'tempat_lahir' },
  { label: 'AGAMA',             key: 'agama' },
  { label: 'JENIS KELAMIN',     key: 'jenis_kelamin' },
  { label: 'ALAMAT',            key: 'alamat' },
  { label: 'NO. TELEPON',       key: 'no_telepon' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const p = DUMMY_PROFILE;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/profile"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>STUDENT PROFILE</Text>
        <View style={styles.headerIconBox}>
          <Ionicons name="school-outline" size={18} color="white" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Profile Card */}
        <View style={styles.profileCard}>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBox}>
              <Ionicons name="person" size={64} color="white" />
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => router.push('/profile/edit' as any)}
            >
              <Ionicons name="pencil" size={12} color="white" />
            </TouchableOpacity>
          </View>

          {/* Nama */}
          <Text style={styles.nama}>{p.nama}</Text>

          {/* Status badge */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{p.status}</Text>
          </View>

          {/* NIS */}
          <View style={styles.nisBadge}>
            <Text style={styles.nisText}>NIS: {p.nis}</Text>
          </View>

          {/* Jurusan & Kelas */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: ORANGE }]}>
              <Text style={styles.badgeText}>{p.jurusan}</Text>
            </View>
            <View style={[styles.badge, styles.badgeOutline]}>
              <Text style={[styles.badgeText, { color: '#1a1a1a' }]}>{p.kelas}</Text>
            </View>
          </View>

        </View>

        {/* Data Diri */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="id-card-outline" size={14} color="white" />
            <Text style={styles.sectionTitle}>DATA DIRI</Text>
          </View>
          <View style={styles.sectionBody}>
            {DATA_DIRI.map((item, index) => {
              const value = item.key === 'tempat_lahir'
                ? `${p.tempat_lahir}, ${p.tanggal_lahir}`
                : String(p[item.key]);
              return (
                <View key={item.key}>
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>{item.label}</Text>
                    <Text style={styles.dataValue}>{value}</Text>
                  </View>
                  {index < DATA_DIRI.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Sosial Media */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="share-social-outline" size={14} color="white" />
            <Text style={styles.sectionTitle}>SOSIAL MEDIA</Text>
          </View>
          <View style={styles.sectionBody}>
            {SOSMED_ITEMS.map((item, index) => (
              <View key={item.key}>
                <View style={styles.sosmedRow}>
                  <View style={styles.sosmedIconBox}>
                    <Ionicons name={item.icon} size={16} color={DARK} />
                  </View>
                  <View style={styles.sosmedInfo}>
                    <Text style={styles.sosmedLabel}>{item.label}</Text>
                    <Text style={styles.sosmedValue}>{p.sosmed[item.key]}</Text>
                  </View>
                  {index === SOSMED_ITEMS.length - 1 && (
                    <TouchableOpacity
                      style={styles.sosmedEditBtn}
                      onPress={() => router.push('/profile/edit' as any)}
                    >
                      <Ionicons name="pencil" size={14} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
                {index < SOSMED_ITEMS.length - 1 && (
                  <View style={styles.rowDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK,
  },

  // Header
  header: {
    backgroundColor: DARK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: MONO,
  },
  headerIconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: '#E8E6E1',
  },
  scrollContent: {
    padding: 12,
    gap: 12,
    paddingBottom: 40,
  },

  // Profile Card
  profileCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 2,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  avatarBox: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    backgroundColor: ORANGE,
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  nama: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: MONO,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 2,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: MONO,
  },
  nisBadge: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 2,
  },
  nisText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: MONO,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 2,
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: MONO,
  },

  // Section
  section: {
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  sectionHeader: {
    backgroundColor: DARK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: MONO,
  },
  sectionBody: {
    paddingHorizontal: 14,
  },

  // Data Diri rows
  dataRow: {
    paddingVertical: 12,
    gap: 4,
  },
  dataLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#888',
    fontFamily: MONO,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  dataValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: MONO,
    lineHeight: 20,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },

  // Sosmed rows
  sosmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  sosmedIconBox: {
    width: 36,
    height: 36,
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  sosmedInfo: {
    flex: 1,
  },
  sosmedLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#888',
    fontFamily: MONO,
  },
  sosmedValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontFamily: MONO,
    marginTop: 2,
  },
  sosmedEditBtn: {
    width: 36,
    height: 36,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
});