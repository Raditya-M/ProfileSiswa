import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#E8581A';
const DARK = '#2C3E50';
const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

type TabItem = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TAB_ITEMS: TabItem[] = [
  { name: 'index',      title: 'DASHBOARD', icon: 'home-outline',             iconFocused: 'home' },
  { name: 'portofolio', title: 'PORTFOLIO',  icon: 'folder-open-outline',      iconFocused: 'folder-open' },
  { name: 'sertifikat', title: 'SERTIFIKAT', icon: 'shield-checkmark-outline', iconFocused: 'shield-checkmark' },
  { name: 'profile',    title: 'PROFILE',    icon: 'person-outline',           iconFocused: 'person' },
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const tab = TAB_ITEMS[index];

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, focused && styles.tabItemActive]}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={1}
          >
            <Ionicons
              name={focused ? tab.iconFocused : tab.icon}
              size={22}
              color={focused ? 'white' : '#888'}
            />
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1.5,
    borderTopColor: '#1a1a1a',
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 16 : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: ORANGE,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#888',
    fontFamily: MONO,
  },
  tabLabelActive: {
    color: 'white',
  },
});

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TAB_ITEMS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}