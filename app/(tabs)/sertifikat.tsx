import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Platform, 
  TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SideDrawer from '@/components/sidedrawer';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// Simulasi Data Sertifikat
const DUMMY_CERTIFICATES = [
  {
    id: '1',
    judul: 'PROFESSIONAL CNC OPERATOR LICENSE',
    penerbit: 'BNSP INDONESIA',
    tanggal: '12.10.25',
    kategori: 'TECHNICAL',
    verified: true,
    icon: 'ribbon-outline',
  },
];

export default function SertifikatScreen() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Document Preview Area */}
      <View style={styles.thumbnail}>
        <View style={styles.certPaper}>
          <Ionicons name={item.icon} size={40} color={DARK} />
          <View style={styles.certLine} />
          <View style={[styles.certLine, { width: '60%' }]} />
        </View>

        {/* Badge Verified */}
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color="white" />
            <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
          </View>
        )}
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.judul}</Text>
        <Text style={styles.cardIssuer}>ISSUED BY: {item.penerbit}</Text>

        <View style={styles.cardMeta}>
          <Text style={styles.cardDate}>{item.tanggal}</Text>
          <View style={styles.kategoriPill}>
            <Text style={styles.kategoriText}>{item.kategori}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.viewButton}
          activeOpacity={0.7}
          onPress={() => router.push(`/sertifikat/${item.id}` as any)}
        >
          <Ionicons name="document-text-outline" size={14} color="#1a1a1a" />
          <Text style={styles.viewButtonText}>VIEW DOCUMENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/sertifikat"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>CERTIFICATE_VAULT</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={16} color={DARK} />
        </View>
      </View>

      {/* Page Title */}
      <View style={styles.pageTitleRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>CERTIFICATES</Text>
      </View>

      {/* List / Empty State */}
      {DUMMY_CERTIFICATES.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyBox}>
            <Ionicons name="shield-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>NO_CERTIFICATES_FOUND</Text>
            <Text style={styles.emptySubtext}>Data sertifikasi belum tersedia atau belum diunggah.</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={DUMMY_CERTIFICATES}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/sertifikat/tambah' as any)}
      >
        <Ionicons name="cloud-upload" size={24} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK,
  },
  header: {
    backgroundColor: DARK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitleBox: {
    borderWidth: 2,
    borderColor: ORANGE,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: MONO,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  pageTitleRow: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    gap: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: MONO,
    letterSpacing: 1,
  },
  list: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 12,
    gap: 14,
    paddingBottom: 100,
  },
  // Card
  card: {
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  thumbnail: {
    height: 160,
    backgroundColor: '#E8E6E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  certPaper: {
    width: 80,
    height: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  certLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#eee',
    marginTop: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#27ae60', // Hijau untuk kesan Verified
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
    fontFamily: MONO,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a1a1a',
    fontFamily: MONO,
    marginBottom: 4,
  },
  cardIssuer: {
    fontSize: 11,
    color: ORANGE,
    fontFamily: MONO,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 12,
    color: '#555',
    fontFamily: MONO,
  },
  kategoriPill: {
    backgroundColor: DARK,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  kategoriText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: MONO,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#1a1a1a',
    marginBottom: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#1a1a1a',
    fontFamily: MONO,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyBox: {
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    padding: 40,
    width: '100%',
  },
  emptyText: {
    fontFamily: MONO,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    color: '#aaa',
  },
  emptySubtext: {
    fontFamily: MONO,
    fontSize: 12,
    textAlign: 'center',
    color: '#ccc',
    marginTop: 8,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: ORANGE,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});