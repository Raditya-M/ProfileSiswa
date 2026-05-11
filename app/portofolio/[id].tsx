import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Platform,
  TouchableOpacity, ActivityIndicator, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'http://172.16.0.68:8000/api';
const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const GREEN = '#2E7D32';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export default function PortfolioDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE}/portfolios/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const json = await res.json();
        setData(json.data ?? json);
      } catch {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={ORANGE} /></View>;
  if (error || !data) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.backLink}>← Kembali</Text></TouchableOpacity>
    </View>
  );

  const toolsList = data.tools?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROJECT_DETAILS</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push(`/portofolio/edit/${id}` as any)}>
            <Ionicons name="create-outline" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => Share.share({ message: data.judul })}>
            <Ionicons name="share-social-outline" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.thumbnail}>
          <Ionicons name="folder-open-outline" size={64} color="#777" />
          <View style={styles.thumbnailAccent} />
        </View>

        <View style={styles.whiteSection}>
          <Text style={styles.judul}>{data.judul}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>
                DATE: {new Date(data.created_at).toLocaleDateString('id-ID')}
              </Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: ORANGE }]}>
              <Text style={styles.badgeText}>{data.kategori}</Text>
            </View>
            {data.nilai ? (
              <View style={[styles.badge, { backgroundColor: GREEN }]}>
                <Text style={styles.badgeText}>GRADE {data.nilai}</Text>
              </View>
            ) : null}
            {data.teknologi ? (
              <View style={[styles.badge, styles.badgeOutline]}>
                <Text style={[styles.badgeText, { color: '#1a1a1a' }]}>{data.teknologi}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>DESKRIPSI PROYEK</Text></View>
          <View style={styles.sectionBody}><Text style={styles.deskripsi}>{data.deskripsi}</Text></View>
        </View>

        {toolsList.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>TOOLS & TECHNOLOGY</Text></View>
            <View style={styles.sectionBody}>
              {toolsList.map((tool: string, i: number) => (
                <View key={tool}>
                  <View style={styles.toolRow}>
                    <Ionicons name="construct-outline" size={16} color={DARK} />
                    <Text style={styles.toolText}>{tool}</Text>
                  </View>
                  {i < toolsList.length - 1 && <View style={styles.toolDivider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {data.link_github ? (
          <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
            <Ionicons name="eye-outline" size={16} color="white" />
            <Text style={styles.btnPrimaryText}>LIHAT PROJECT LIVE</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
          <Ionicons name="download-outline" size={16} color="#1a1a1a" />
          <Text style={styles.btnSecondaryText}>UNDUH LAPORAN (PDF)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'white' },
  errorText: { fontSize: 13, color: '#e74c3c', fontFamily: MONO },
  backLink: { fontSize: 13, color: DARK, fontFamily: MONO },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: '#1a1a1a' },
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, color: '#1a1a1a', fontFamily: MONO },
  scroll: { flex: 1, backgroundColor: '#E8E6E1' },
  thumbnail: { height: 220, backgroundColor: '#c8c8c8', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  thumbnailAccent: { position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, borderWidth: 2, borderColor: ORANGE },
  whiteSection: { backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  judul: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO, lineHeight: 32, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  metaPill: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 2 },
  metaPillText: { fontSize: 11, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 2 },
  badgeOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#1a1a1a' },
  badgeText: { fontSize: 10, fontWeight: '700', color: 'white', fontFamily: MONO },
  section: { marginHorizontal: 12, marginTop: 14, borderWidth: 2, borderColor: '#1a1a1a', borderRadius: 2, overflow: 'hidden', backgroundColor: 'white' },
  sectionHeader: { backgroundColor: DARK, paddingHorizontal: 14, paddingVertical: 10 },
  sectionTitle: { color: 'white', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, fontFamily: MONO },
  sectionBody: { padding: 14 },
  deskripsi: { fontSize: 14, color: '#1a1a1a', fontFamily: MONO, lineHeight: 22 },
  toolRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  toolText: { fontSize: 13, color: '#1a1a1a', fontFamily: MONO, fontWeight: '600' },
  toolDivider: { height: 1, backgroundColor: '#e0e0e0' },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: ORANGE, borderWidth: 2, borderColor: '#1a1a1a', marginHorizontal: 12, marginTop: 16, paddingVertical: 14, borderRadius: 2 },
  btnPrimaryText: { color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, fontFamily: MONO },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'white', borderWidth: 2, borderColor: '#1a1a1a', marginHorizontal: 12, marginTop: 10, paddingVertical: 14, borderRadius: 2 },
  btnSecondaryText: { color: '#1a1a1a', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, fontFamily: MONO },
});