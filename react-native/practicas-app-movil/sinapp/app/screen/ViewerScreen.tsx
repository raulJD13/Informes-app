import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';

// Define el tipo de parámetros esperados por la ruta
type ViewerScreenParams = {
  ViewerScreen: {
    file: {
      nombre: string;
      tipo: string;
    };
  };
};

// Especifica el tipo de la prop `route` usando `RouteProp`
type ViewerScreenProps = {
  route: RouteProp<ViewerScreenParams, 'ViewerScreen'>;
};

const ViewerScreen = ({ route }: ViewerScreenProps) => {
  const { file } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name={
            file.tipo === 'pdf' ? 'picture-as-pdf' :
            file.tipo === 'ppt' ? 'slideshow' :
            'description'
          }
          size={48}
          color="#4CAF50"
        />
        <Text style={styles.title}>{file.nombre}</Text>
        <Text style={styles.subtitle}>
          Documento {file.tipo?.toUpperCase() || 'Archivo'}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>
          Este es el contenido del documento {file.nombre}. 
          En una versión completa de la aplicación, aquí se mostraría 
          el contenido real del archivo o una previsualización del mismo.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default ViewerScreen;
