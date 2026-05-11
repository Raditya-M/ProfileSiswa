import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Platform,
  TouchableOpacity, TextInput, Modal,
  KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'http://172.16.0.68:8000/api';
const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const RED = '#C0392B';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
const KATEGORI_OPTIONS = ['ENGINEERING', 'CIVIL', 'ELECTRICAL', 'DRAFTING', 'IT', 'LAINNYA'];

export default function EditPortfolioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [showKategori, setShowKategori] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch existing data
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE}/portfolios/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const json = await res.json();
        const d = json.data ?? json;
        setJudul(d.judul ?? '');
        setKategori(d.kategori ?? '');
        setDeskripsi(d.deskripsi ?? '');
        setTools(d.tools ? d.tools.split(',').map((t: string) => t.trim()).filter(Boolean) : []);
      } catch {
        setErrorMsg('Gagal memuat data');
      } finally {
        setLoadingData(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE}/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          judul, kategori, deskripsi,
          tools: tools.join(','),
          teknologi: tools.join(','),
          jenis_porto: 'Project',
        }),
      });
      const json = await res.json();
      if (!res.ok) { setErrorMsg(json.message ?? 'Gagal menyimpan'); return; }
      router.back();
    } catch {
      setErrorMsg('Tidak dapat terhubung ke server');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${BASE}/portfolios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      router.replace('/portofolio' as any);
    } catch {
      setErrorMsg('Gagal menghapus');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loadingData) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={ORANGE} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Ionicons name="trash" size={20} color="white" />
              <Text style={styles.modalHeaderText}>Hapus Яroyek?</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalDesc}>
                Apakah kamu yakin ingin menghapus proyek ini? Tindakan ini{' '}
                <Text style={{ fontWeight: '700' }}>tidak dapat dibatalkan</Text>.
              </Text>
              <View style={styles.modalChip}>
                <Ionicons name="folder-outline" size={14} color="#555" />
                <Text style={styles.modalChipText} numberOfLines={1}>{judul}</Text>
              </View>
              <TouchableOpacity style={[styles.btnDelete, isDeleting && { opacity: 0.7 }]} onPress={handleDelete} disabled={isDeleting} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={14} color="white" />
                <Text style={styles.btnDeleteText}>{isDeleting ? 'MENGHAPUS...' : 'HAPUS PROYEK'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnBatal} onPress={() => setShowDeleteModal(false)} activeOpacity={0.8}>
                <Text style={styles.btnBatalText}>BATAL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT PROJECT</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setShowDeleteModal(true)}>
          <Ionicons name="trash-outline" size={18} color={RED} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" />
              <Text style={styles.errorBoxText}>{errorMsg}</Text>
            </View>
          )}

          {/* Judul */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>JUDUL PROYEK</Text>
            <TextInput style={styles.input} value={judul} onChangeText={setJudul} placeholderTextColor="#aaa" />
          </View>

          {/* Kategori */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>KATEGORI</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowKategori(!showKategori)} activeOpacity={0.8}>
              <Text style={styles.dropdownValue}>{kategori || 'Pilih...'}</Text>
              <Ionicons name={showKategori ? 'chevron-up' : 'chevron-down'} size={16} color="#1a1a1a" />
            </TouchableOpacity>
            {showKategori && (
              <View style={styles.dropdownList}>
                {KATEGORI_OPTIONS.map((opt) => (
                  <TouchableOpacity key={opt} style={[styles.dropdownItem, kategori === opt && styles.dropdownItemActive]} onPress={() => { setKategori(opt); setShowKategori(false); }}>
                    <Text style={[styles.dropdownItemText, kategori === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Deskripsi */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DESKRIPSI</Text>
            <TextInput style={[styles.input, styles.textArea]} value={deskripsi} onChangeText={setDeskripsi} multiline numberOfLines={5} textAlignVertical="top" placeholderTextColor="#aaa" />
          </View>

          {/* Tools */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>TOOLS & TEKNOLOGI</Text>
            <View style={styles.toolsContainer}>
              {tools.map((tool) => (
                <View key={tool} style={styles.toolChip}>
                  <Text style={styles.toolChipText}>{tool}</Text>
                  <TouchableOpacity onPress={() => setTools(tools.filter(t => t !== tool))}>
                    <Ionicons name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addToolChip}>
                <TextInput style={styles.addToolInput} value={newTool} onChangeText={setNewTool} placeholder="+ Tambah Tool" placeholderTextColor="#888" onSubmitEditing={() => { const t = newTool.trim(); if (t && !tools.includes(t)) { setTools([...tools, t]); setNewTool(''); } }} returnKeyType="done" />
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.btnBatalBottom} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.btnBatalBottomText}>BATAL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSimpan, isSaving && { opacity: 0.7 }]} onPress={handleSave} disabled={isSaving} activeOpacity={0.8}>
            <Ionicons name="save-outline" size={16} color="white" />
            <Text style={styles.btnSimpanText}>{isSaving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: '#1a1a1a' },
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, color: '#1a1a1a', fontFamily: MONO },
  scroll: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16, gap: 18, paddingBottom: 20 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fdecea', borderWidth: 1.5, borderColor: '#e74c3c', padding: 10, borderRadius: 2 },
  errorBoxText: { fontSize: 12, color: '#e74c3c', fontFamily: MONO, flex: 1 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: '#555', fontFamily: MONO },
  input: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#1a1a1a', fontFamily: MONO, backgroundColor: 'white', borderRadius: 2 },
  textArea: { height: 120, textAlignVertical: 'top' },
  dropdown: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 2 },
  dropdownValue: { fontSize: 13, color: '#1a1a1a', fontFamily: MONO, fontWeight: '700' },
  dropdownList: { borderWidth: 1.5, borderColor: '#1a1a1a', borderTopWidth: 0, backgroundColor: 'white', borderRadius: 2 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemActive: { backgroundColor: DARK },
  dropdownItemText: { fontSize: 12, color: '#1a1a1a', fontFamily: MONO, fontWeight: '600' },
  dropdownItemTextActive: { color: 'white' },
  toolsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, borderWidth: 1.5, borderColor: '#1a1a1a', padding: 10, backgroundColor: 'white', borderRadius: 2 },
  toolChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ORANGE, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 2 },
  toolChipText: { color: 'white', fontSize: 11, fontWeight: '700', fontFamily: MONO },
  addToolChip: { borderWidth: 1.5, borderColor: '#aaa', borderStyle: 'dashed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 2, minWidth: 110 },
  addToolInput: { fontSize: 11, color: '#1a1a1a', fontFamily: MONO, padding: 0, minWidth: 90 },
  bottomActions: { flexDirection: 'row', gap: 10, padding: 12, borderTopWidth: 1.5, borderTopColor: '#1a1a1a', backgroundColor: 'white' },
  btnBatalBottom: { flex: 1, borderWidth: 1.5, borderColor: '#1a1a1a', paddingVertical: 13, alignItems: 'center', borderRadius: 2 },
  btnBatalBottomText: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: '#1a1a1a', fontFamily: MONO },
  btnSimpan: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: ORANGE, borderWidth: 1.5, borderColor: '#1a1a1a', paddingVertical: 13, borderRadius: 2 },
  btnSimpanText: { color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalBox: { width: '100%', borderWidth: 2, borderColor: '#1a1a1a', backgroundColor: 'white', borderRadius: 2, overflow: 'hidden' },
  modalHeader: { backgroundColor: RED, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  modalHeaderText: { color: 'white', fontSize: 18, fontWeight: '700', fontFamily: MONO, letterSpacing: 1 },
  modalBody: { padding: 16, gap: 12 },
  modalDesc: { fontSize: 13, color: '#1a1a1a', fontFamily: MONO, lineHeight: 20 },
  modalChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: '#aaa', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 2 },
  modalChipText: { fontSize: 12, color: '#555', fontFamily: MONO, flex: 1 },
  btnDelete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: DARK, paddingVertical: 13, borderRadius: 2 },
  btnDeleteText: { color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  btnBatal: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingVertical: 13, alignItems: 'center', borderRadius: 2 },
  btnBatalText: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: '#1a1a1a', fontFamily: MONO },
});