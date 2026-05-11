import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, Modal, Animated, Dimensions,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
const DRAWER_WIDTH = Dimensions.get('window').width * 0.72;

const menuItems = [
  { label: 'DASHBOARD',        icon: 'grid-outline',             route: '/' },
  { label: 'ACADEMIC RECORDS', icon: 'school-outline',           route: '/academic' },
  { label: 'ATTENDANCE',       icon: 'calendar-outline',         route: '/attendance' },
  { label: 'SKILLS LAB',       icon: 'construct-outline',        route: '/skills' },
  { label: 'PORTOFOLIO',       icon: 'folder-open-outline',      route: '/portofolio' },
  { label: 'PRESTASI',         icon: 'trophy-outline',           route: '/prestasi' },
  { label: 'SERTIFIKASI',      icon: 'shield-checkmark-outline', route: '/sertifikat' },
  { label: 'CIS',              icon: 'document-text-outline',    route: '/cis' },
  { label: 'GANTI PASSWORD',   icon: 'key-outline',              route: '/ganti-password' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  activeRoute?: string;
};

export default function SideDrawer({ visible, onClose, activeRoute = '/' }: Props) {
  const router = useRouter();
  const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 200);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    onClose();
    // TODO: hapus token
    // await AsyncStorage.removeItem('token');
    setTimeout(() => router.replace('/login' as any), 300);
  };

  return (
    <>
      {/* ── Logout Confirmation Modal ── */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setShowLogoutModal(false)}>
          <View style={styles.logoutBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.logoutModalWrapper}>
          <View style={styles.logoutModal}>

            {/* Icon */}
            <View style={styles.logoutIconBox}>
              <Ionicons name="exit-outline" size={24} color="#1a1a1a" />
            </View>

            {/* Text */}
            <Text style={styles.logoutTitle}>Keluar dari Akun?</Text>
            <Text style={styles.logoutDesc}>
              Kamu akan keluar dari portal siswa SMK Pesat.
            </Text>

            {/* Buttons */}
            <View style={styles.logoutBtnRow}>
              <TouchableOpacity
                style={styles.logoutBtnBatal}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutBtnBatalText}>BATAL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutBtnConfirm}
                onPress={handleLogoutConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutBtnConfirmText}>YA, KELUAR</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ── Drawer ── */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarBox}>
                <Ionicons name="person" size={52} color="white" />
              </View>
              <Text style={styles.profileName}>Budi Santoso</Text>
              <Text style={styles.profileNis}>NIS: 12903482</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Kelas XII</Text>
                </View>
                <View style={[styles.badge, styles.badgeDark]}>
                  <Text style={styles.badgeText}>Teknik Mesin</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Menu List */}
            <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => {
                const isActive = activeRoute === item.route;
                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleNavigate(item.route)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={isActive ? 'white' : '#1a1a1a'}
                    />
                    <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="exit-outline" size={18} color={ORANGE} />
                <Text style={styles.logoutText}>KELUAR</Text>
              </TouchableOpacity>
              <Text style={styles.version}>v1.0.4 — BRUTAL</Text>
            </View>

          </SafeAreaView>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    borderRightWidth: 2,
    borderRightColor: '#1a1a1a',
  },

  // Profile
  profileSection: {
    backgroundColor: DARK,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  avatarBox: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: '#3d5166',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginBottom: 12,
  },
  profileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: MONO,
    textAlign: 'center',
  },
  profileNis: {
    color: ORANGE,
    fontSize: 12,
    fontFamily: MONO,
    marginTop: 4,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: ORANGE,
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  badgeDark: {
    backgroundColor: DARK,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: MONO,
  },

  divider: {
    height: 1.5,
    backgroundColor: '#1a1a1a',
  },

  // Menu
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemActive: {
    backgroundColor: ORANGE,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#1a1a1a',
    fontFamily: MONO,
  },
  menuLabelActive: {
    color: 'white',
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E8241A',
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 2,
  },
  logoutText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: MONO,
  },
  version: {
    textAlign: 'center',
    fontSize: 9,
    color: '#aaa',
    fontFamily: MONO,
    marginBottom: 4,
  },

  // Logout Modal
  logoutBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  logoutModalWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoutModal: {
    backgroundColor: '#FAFAF8',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 2,
    padding: 20,
    width: '100%',
    // shadow brutalist
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  logoutIconBox: {
    width: 52,
    height: 52,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginBottom: 14,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: MONO,
    marginBottom: 6,
  },
  logoutDesc: {
    fontSize: 13,
    color: '#555',
    fontFamily: MONO,
    lineHeight: 20,
    marginBottom: 20,
  },
  logoutBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  logoutBtnBatal: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 2,
  },
  logoutBtnBatalText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#1a1a1a',
    fontFamily: MONO,
  },
  logoutBtnConfirm: {
    flex: 1,
    backgroundColor: DARK,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 2,
  },
  logoutBtnConfirmText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'white',
    fontFamily: MONO,
  },
});