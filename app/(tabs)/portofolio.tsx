import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Platform,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideDrawer from '@/components/sidedrawer';

const BASE = 'http://172.16.0.68:8000/api';
const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export default function PortfolioScreen() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE}/portfolios`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const json = await res.json();
      setPortfolios(Array.isArray(json) ? json : json.data ?? []);
    } catch {
      setError('Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const renderCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.thumbnail}>
        <Ionicons name="folder-open-outline" size={48} color="#777" />
        {item.nilai && (
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>{item.nilai} GRADED</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.judul}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardDate}>
            {new Date(item.created_at).toLocaleDateString('id-ID', {
              day: '2-digit', month: '2-digit', year: '2-digit',
            })}
          </Text>
          <View style={styles.kategoriPill}>
            <Text style={styles.kategoriText}>{item.kategori}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.viewButton}
          activeOpacity={0.7}
          onPress={() => router.push(`/portofolio/${item.id}` as any)}
        >
          <Ionicons name="eye-outline" size={14} color="#1a1a1a" />
          <Text style={styles.viewButtonText}>VIEW PROJECT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SideDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} activeRoute="/portofolio" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>PORTFOLIO_SYSTEM</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={16} color={DARK} />
        </View>
      </View>

      <View style={styles.pageTitleRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>PORTFOLIO</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.centerText}>Memuat portofolio...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="wifi-outline" size={40} color="#aaa" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchData()}>
            <Text style={styles.retryText}>COBA LAGI</Text>
          </TouchableOpacity>
        </View>
      ) : portfolios.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="folder-open-outline" size={48} color="#ccc" />
          <Text style={styles.centerText}>Belum ada portofolio.</Text>
          <Text style={styles.subText}>Tekan + untuk menambahkan.</Text>
        </View>
      ) : (
        <FlatList
          data={portfolios}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(true)}
              colors={[ORANGE]}
              tintColor={ORANGE}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/portofolio/tambah' as any)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK },
  header: { backgroundColor: DARK, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitleBox: { borderWidth: 2, borderColor: ORANGE, paddingHorizontal: 12, paddingVertical: 4 },
  headerTitle: { color: 'white', fontSize: 13, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  headerAvatar: { width: 34, height: 34, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 2 },
  pageTitleRow: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: '#1a1a1a', gap: 10 },
  backButton: { width: 32, height: 32, borderWidth: 2, borderColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center', borderRadius: 2 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO, letterSpacing: 1 },
  list: { flex: 1, backgroundColor: 'white' },
  listContent: { padding: 12, gap: 14, paddingBottom: 100 },
  card: { borderWidth: 2, borderColor: '#1a1a1a', borderRadius: 2, overflow: 'hidden', backgroundColor: 'white' },
  thumbnail: { height: 180, backgroundColor: '#d0d0d0', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gradeBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: ORANGE, paddingHorizontal: 10, paddingVertical: 5 },
  gradeBadgeText: { color: 'white', fontSize: 10, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO, marginBottom: 8, lineHeight: 22 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardDate: { fontSize: 12, color: '#555', fontFamily: MONO },
  kategoriPill: { backgroundColor: DARK, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 2 },
  kategoriText: { color: 'white', fontSize: 10, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  divider: { height: 1.5, backgroundColor: '#1a1a1a', marginBottom: 10 },
  viewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  viewButtonText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: '#1a1a1a', fontFamily: MONO },
  fab: { position: 'absolute', bottom: 20, right: 16, width: 52, height: 52, backgroundColor: ORANGE, borderWidth: 2, borderColor: '#1a1a1a', borderRadius: 2, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  center: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', gap: 12 },
  centerText: { fontSize: 13, color: '#888', fontFamily: MONO },
  subText: { fontSize: 11, color: '#ccc', fontFamily: MONO },
  errorText: { fontSize: 12, color: '#e74c3c', fontFamily: MONO, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { borderWidth: 2, borderColor: '#1a1a1a', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 2 },
  retryText: { fontSize: 11, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
});