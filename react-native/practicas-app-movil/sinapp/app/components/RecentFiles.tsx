import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FileItem {
  id: number;
  name: string;
  type: 'pdf' | 'ppt' | 'doc' | string; // Especificamos tipos válidos para 'type'
  date: string;
}

const RecentFiles = () => {
  const recentFiles: FileItem[] = [
    { id: 1, name: 'Informe Financiero Q1.pdf', type: 'pdf', date: 'Hoy' },
    { id: 2, name: 'Presentación Cliente.pptx', type: 'ppt', date: 'Ayer' },
    { id: 3, name: 'Contrato Servicios.docx', type: 'doc', date: '15/06' },
  ];

  const getIcon = (type: 'pdf' | 'ppt' | 'doc' | string): keyof typeof MaterialIcons.glyphMap => {
    switch (type) {
      case 'pdf': return 'picture-as-pdf';
      case 'ppt': return 'slideshow';
      case 'doc': return 'description';
      default: return 'insert-drive-file';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recientes</Text>
      <FlatList
        data={recentFiles}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fileItem}>
            <MaterialIcons name={getIcon(item.type)} size={36} color="#757575" />
            <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.fileDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  fileItem: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  fileName: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  fileDate: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
});

export default RecentFiles;
