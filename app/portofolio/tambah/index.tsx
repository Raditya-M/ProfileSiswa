import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Platform,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

const BASE = 'http://172.16.0.68:8000/api';
const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
const KATEGORI_OPTIONS = ['ENGINEERING', 'CIVIL', 'ELECTRICAL', 'DRAFTING', 'IT', 'LAINNYA'];

export default function TambahPortfolioScreen() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [showKategori, setShowKategori] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

const handlePickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    alert('Izin akses galeri diperlukan');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.uri.split('/').pop() ?? 'photo.jpg';
    const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    setImage({ uri: asset.uri, name: fileName, type: fileType });
  }
};

  const handleAddTool = () => {
    const t = newTool.trim();
    if (t && !tools.includes(t)) { setTools([...tools, t]); setNewTool(''); }
  };

  const handleSave = async () => {
  setIsSaving(true);
  setErrorMsg(null);
  try {
    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('kategori', kategori);
    formData.append('deskripsi', deskripsi);
    formData.append('tools', tools.join(','));
    formData.append('teknologi', tools.join(','));
    formData.append('jenis_porto', 'Project');

    if (image) {
      formData.append('thumbnail', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    }

    const res = await fetch(`${BASE}/portfolios`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) { setErrorMsg(json.message ?? 'Gagal menyimpan'); return; }
    setSavedId(String(json.data?.id ?? json.id ?? ''));
    setShowSuccess(true);
  } catch {
    setErrorMsg('Tidak dapat terhubung ke server');
  } finally {
    setIsSaving(false);
  }
};

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.successSafe} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <View style={styles.successIconShadow} />
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark" size={52} color="#1a1a1a" />
            </View>
          </View>
          <View style={styles.successTitleBox}>
            <Text style={styles.successTitle}>BERHASIL{'\n'}DIUNGGAH!</Text>
          </View>
          <View style={styles.successDescRow}>
            <View style={styles.successDescAccent} />
            <Text style={styles.successDesc}>Portofolio kamu telah tersimpan dalam sistem.</Text>
          </View>
          <View style={styles.successBtns}>
            <TouchableOpacity style={styles.successBtnPrimary} onPress={() => router.replace('/portofolio' as any)} activeOpacity={0.8}>
              <Text style={styles.successBtnPrimaryText}>KEMBALI KE LIST</Text>
            </TouchableOpacity>
            {savedId ? (
              <TouchableOpacity style={styles.successBtnSecondary} onPress={() => router.replace(`/portofolio/${savedId}` as any)} activeOpacity={0.8}>
                <Text style={styles.successBtnSecondaryText}>LIHAT PORTOFOLIO →</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>PORTFOLIO_SYSTEM</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={16} color={DARK} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>TAMBAH PORTOFOLIO</Text>
          <Text style={styles.pageSubtitle}>Lengkapi data proyek untuk ditambahkan ke profil akademik Anda.</Text>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" />
              <Text style={styles.errorBoxText}>{errorMsg}</Text>
            </View>
          )}

          {/* Judul */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelBox}><Text style={styles.labelBoxText}>JUDUL PROYEK</Text></View>
            <TextInput style={styles.input} value={judul} onChangeText={setJudul} placeholder="Masukkan judul proyek yang representatif" placeholderTextColor="#aaa" />
          </View>

          {/* Kategori */}
          <View style={styles.fieldGroup}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowKategori(!showKategori)} activeOpacity={0.8}>
              <Text style={[styles.dropdownValue, !kategori && { color: '#aaa' }]}>{kategori || 'Pilih Kategori...'}</Text>
              <Ionicons name={showKategori ? 'chevron-up' : 'chevron-down'} size={16} color="#888" />
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
            <View style={styles.labelBox}><Text style={styles.labelBoxText}>DESKRIPSI</Text></View>
            <TextInput style={[styles.input, styles.textArea]} value={deskripsi} onChangeText={setDeskripsi} placeholder="Jelaskan peran Anda, teknologi yang digunakan, dan hasil yang dicapai..." placeholderTextColor="#aaa" multiline numberOfLines={6} textAlignVertical="top" />
          </View>

          {/* Tools */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelBox}><Text style={styles.labelBoxText}>TOOLS & TEKNOLOGI</Text></View>
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
                <TextInput style={styles.addToolInput} value={newTool} onChangeText={setNewTool} placeholder="+ Tambah Tool" placeholderTextColor="#888" onSubmitEditing={handleAddTool} returnKeyType="done" />
              </View>
            </View>
          </View>

          {/* Upload placeholder */}
          <View style={styles.fieldGroup}>
            <View style={[styles.labelBox, { backgroundColor: ORANGE }]}>
                <Text style={[styles.labelBoxText, { color: 'white' }]}>UNGGAH FILE/GAMBAR</Text>
            </View>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={handlePickImage}>
                {image ? (
                // Preview setelah dipilih
                <View style={styles.uploadPreview}>
                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    <View style={styles.previewOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text style={styles.previewName} numberOfLines={1}>{image.name}</Text>
                    <Text style={styles.previewChange}>Ketuk untuk ganti</Text>
                    </View>
                </View>
                ) : (
                // Default state
                <>
                    <Ionicons name="cloud-upload-outline" size={40} color="#555" />
                    <Text style={styles.uploadTitle}>Seret & Lepas File</Text>
                    <Text style={styles.uploadSub}>atau klik untuk menelusuri</Text>
                    <View style={styles.uploadFormats}>
                    {['JPG', 'PNG', 'PDF'].map((fmt) => (
                        <View key={fmt} style={styles.formatPill}>
                        <Text style={styles.formatPillText}>{fmt}</Text>
                        </View>
                    ))}
                    </View>
                </>
                )}
            </TouchableOpacity>
            </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.btnSimpan, (!judul || !kategori || !deskripsi || isSaving) && styles.btnDisabled]}
            onPress={handleSave}
            disabled={!judul || !kategori || !deskripsi || isSaving}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={18} color="white" />
            <Text style={styles.btnSimpanText}>{isSaving ? 'MENYIMPAN...' : 'SIMPAN PORTOFOLIO'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK },
  header: { backgroundColor: DARK, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitleBox: { borderWidth: 2, borderColor: ORANGE, paddingHorizontal: 12, paddingVertical: 4 },
  headerTitle: { color: 'white', fontSize: 13, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  headerAvatar: { width: 34, height: 34, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 2 },
  scroll: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 20 },
  pageTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO, letterSpacing: 1 },
  pageSubtitle: { fontSize: 12, color: '#555', fontFamily: MONO, lineHeight: 18, marginTop: -8 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fdecea', borderWidth: 1.5, borderColor: '#e74c3c', padding: 10, borderRadius: 2 },
  errorBoxText: { fontSize: 12, color: '#e74c3c', fontFamily: MONO, flex: 1 },
  fieldGroup: { gap: 0 },
  labelBox: { backgroundColor: '#1a1a1a', paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  labelBoxText: { color: 'white', fontSize: 10, fontWeight: '700', letterSpacing: 1, fontFamily: MONO },
  input: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 12, fontSize: 13, color: '#1a1a1a', fontFamily: MONO, backgroundColor: 'white' },
  textArea: { height: 140, textAlignVertical: 'top' },
  dropdown: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' },
  dropdownValue: { fontSize: 13, color: '#1a1a1a', fontFamily: MONO },
  dropdownList: { borderWidth: 1.5, borderColor: '#1a1a1a', borderTopWidth: 0, backgroundColor: 'white' },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemActive: { backgroundColor: DARK },
  dropdownItemText: { fontSize: 12, color: '#1a1a1a', fontFamily: MONO, fontWeight: '600' },
  dropdownItemTextActive: { color: 'white' },
  toolsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, borderWidth: 1.5, borderColor: '#1a1a1a', padding: 10, backgroundColor: 'white', minHeight: 48 },
  toolChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ORANGE, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 2 },
  toolChipText: { color: 'white', fontSize: 11, fontWeight: '700', fontFamily: MONO },
  addToolChip: { borderWidth: 1.5, borderColor: '#aaa', borderStyle: 'dashed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 2, minWidth: 110 },
  addToolInput: { fontSize: 11, color: '#1a1a1a', fontFamily: MONO, padding: 0, minWidth: 90 },
  uploadBox: { borderWidth: 2, borderColor: '#1a1a1a', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', paddingVertical: 32, gap: 8, backgroundColor: '#fafafa' },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO },
  uploadSub: { fontSize: 11, color: '#888', fontFamily: MONO },
  uploadFormats: { flexDirection: 'row', gap: 8, marginTop: 4 },
  formatPill: { borderWidth: 1.5, borderColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 2 },
  formatPillText: { fontSize: 10, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO },
  bottomBar: { padding: 12, backgroundColor: 'white', borderTopWidth: 1.5, borderTopColor: '#1a1a1a' },
  btnSimpan: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: ORANGE, borderWidth: 2, borderColor: '#1a1a1a', paddingVertical: 15, borderRadius: 2 },
  btnDisabled: { opacity: 0.45 },
  btnSimpanText: { color: 'white', fontSize: 13, fontWeight: '700', letterSpacing: 1.5, fontFamily: MONO },
  successSafe: { flex: 1, backgroundColor: '#F5F3EE' },
  successContainer: { flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 32, gap: 20 },
  successIconWrapper: { position: 'relative', width: 90, height: 90, marginBottom: 8 },
  successIconShadow: { position: 'absolute', top: 8, left: 8, width: 80, height: 80, backgroundColor: '#1a1a1a', borderRadius: 2 },
  successIconBox: { position: 'absolute', top: 0, left: 0, width: 80, height: 80, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', borderRadius: 2, borderWidth: 2, borderColor: '#1a1a1a' },
  successTitleBox: { borderWidth: 2, borderColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'white', width: '100%' },
  successTitle: { fontSize: 30, fontWeight: '700', color: '#1a1a1a', fontFamily: MONO, lineHeight: 36 },
  successDescRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  successDescAccent: { width: 3, backgroundColor: '#1a1a1a', alignSelf: 'stretch', borderRadius: 2 },
  successDesc: { flex: 1, fontSize: 14, color: '#555', fontFamily: MONO, lineHeight: 22 },
  successBtns: { width: '100%', gap: 10, marginTop: 8 },
  successBtnPrimary: { backgroundColor: ORANGE, borderWidth: 2, borderColor: '#1a1a1a', paddingVertical: 14, alignItems: 'center', borderRadius: 2 },
  successBtnPrimaryText: { color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, fontFamily: MONO },
  successBtnSecondary: { backgroundColor: 'white', borderWidth: 2, borderColor: '#1a1a1a', paddingVertical: 14, alignItems: 'center', borderRadius: 2 },
  successBtnSecondaryText: { color: '#1a1a1a', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, fontFamily: MONO },
  uploadPreview: {
  width: '100%',
  position: 'relative',
},
previewImage: {
  width: '100%',
  height: 180,
  resizeMode: 'cover',
},
previewOverlay: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.55)',
  padding: 10,
  alignItems: 'center',
  gap: 2,
},
previewName: {
  color: 'white',
  fontSize: 11,
  fontFamily: MONO,
  fontWeight: '700',
  textAlign: 'center',
},
previewChange: {
  color: '#ddd',
  fontSize: 10,
  fontFamily: MONO,
},
});