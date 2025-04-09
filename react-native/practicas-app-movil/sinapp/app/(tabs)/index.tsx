import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DirectoryTree from "../components/DirectoryTree";
import AppHeader from '../components/AppHeader';
import QuickActions from '../components/QuickActions';
import RecentFiles from '../components/RecentFiles';

interface HomeScreenProps {
  navigation: any; 
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <AppHeader title="Gestor Documental" />
      <QuickActions navigation={navigation} />
      <View style={styles.sectionTitleContainer}>
      </View>
      <DirectoryTree navigation={navigation} />
      <RecentFiles />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});