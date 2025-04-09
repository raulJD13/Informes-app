import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

type QuickActionsProps = {
  navigation: NavigationProp<any>; // Cambia 'any' por el tipo específico si tienes un navigator definido
};

const QuickActions = ({ navigation }: QuickActionsProps) => {
  const actions = [
    { icon: 'add', label: 'Nuevo', action: () => navigation.navigate('NewDocument') },
    { icon: 'upload', label: 'Subir', action: () => console.log('Subir archivo') },
    { icon: 'star', label: 'Favoritos', action: () => navigation.navigate('Favorites') },
    { icon: 'share', label: 'Compartir', action: () => console.log('Compartir') },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionButton}
          onPress={action.action}
        >
          {/* Validación del ícono usando el mapa de íconos de MaterialIcons */}
          <MaterialIcons
            name={action.icon as keyof typeof MaterialIcons.glyphMap}
            size={24}
            color="#4CAF50"
          />
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
});

export default QuickActions;
