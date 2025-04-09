import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView,
  Alert,
  TextInput 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

// Definición de tipos
interface DirectoryItem {
  id: number;
  nombre: string;
  padre_id: number | null;
  orden: number;
  directorio: boolean;
  tipo?: string;
}

interface FileData {
  id: number;
  nombre: string;
  tipo: string;
  cod?: string;
  descripcion?: string;
}

interface ConfiguradorInformeProps {
  onClose: () => void;
  onConfirm: (data: FileData) => void;
  initialData: FileData | null;
}

interface DirectoryTreeProps {
  navigation: NavigationProp<any>;
}

// Datos iniciales para el prototipo
const initialDirectories: DirectoryItem[] = [
  { id: 1, nombre: 'Documentos', padre_id: null, orden: 1, directorio: true },
  { id: 2, nombre: 'Informe Financiero.pdf', padre_id: 1, orden: 1, directorio: false, tipo: 'pdf' },
  { id: 3, nombre: 'Proyectos', padre_id: 1, orden: 2, directorio: true },
  { id: 4, nombre: 'Presentación.pptx', padre_id: 3, orden: 1, directorio: false, tipo: 'ppt' },
  { id: 5, nombre: 'Plantillas', padre_id: null, orden: 2, directorio: true },
];

const DirectoryTree: React.FC<DirectoryTreeProps> = ({ navigation }) => {
  const [directories, setDirectories] = useState<DirectoryItem[]>(initialDirectories);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [openDirectories, setOpenDirectories] = useState<Record<number, boolean>>({ 1: true, 3: true });
  const [mostrarConfigurador, setMostrarConfigurador] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<number | null>(null);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nextId, setNextId] = useState(6);

  const promptForName = (title: string, callback: (name?: string) => void) => {
    Alert.prompt(
      title,
      '',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceptar', onPress: (value?: string) => callback(value) },
      ],
      'plain-text'
    );
  };
  

  const addDirectory = (parentId: number | null = null) => {
    promptForName("Nombre del directorio:", (name?: string) => {
      if (!name) return; // Esto asegura que `name` sea definido antes de usarlo
  
      const newDir: DirectoryItem = {
        id: nextId,
        nombre: name,
        padre_id: parentId,
        orden: directories.filter(
          dir =>
            dir.padre_id === parentId ||
            (dir.padre_id === null && parentId === null)
        ).length + 1,
        directorio: true,
      };
  
      setDirectories([...directories, newDir]);
      setOpenDirectories({ ...openDirectories, [nextId]: true });
      setNextId(nextId + 1);
    });
  };

  const addFile = (parentId: number) => {
    setMostrarConfigurador(true);
    setCurrentParentId(parentId);
    setIsEditing(false);
    setCurrentFile(null);
  };

  const editFile = (fileId: number) => {
    const fileToEdit = directories.find(dir => dir.id === fileId);
    if (!fileToEdit) return;

    setCurrentFile({
      id: fileId,
      nombre: fileToEdit.nombre,
      tipo: fileToEdit.tipo || "Informe",
      cod: "COD001",
      descripcion: "Descripción del documento",
    });
    
    setIsEditing(true);
    setMostrarConfigurador(true);
  };

  const handleConfirm = (data: FileData) => {
    setMostrarConfigurador(false);

    if (isEditing && currentFile) {
      setDirectories(directories.map(dir => 
        dir.id === currentFile.id ? { ...dir, nombre: data.nombre } : dir
      ));
    } else if (currentParentId !== null) {
      const newFile: DirectoryItem = {
        id: nextId,
        nombre: data.nombre,
        padre_id: currentParentId,
        orden: directories.filter(dir => dir.padre_id === currentParentId).length + 1,
        directorio: false,
        tipo: data.tipo.toLowerCase(),
      };
      
      setDirectories([...directories, newFile]);
      setNextId(nextId + 1);
    }
  };

  const editDirectory = (id: number) => {
    promptForName("Nuevo nombre:", (newName?: string) => {
      if (!newName) return; 
  
      setDirectories(
        directories.map(dir =>
          dir.id === id ? { ...dir, nombre: newName } : dir
        )
      );
    });
  };

  const deleteDirectory = (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este elemento?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: () => {
            const idsToDelete = new Set<number>([id]);
            let changed = true;
            
            while (changed) {
              changed = false;
              directories.forEach(dir => {
                if (dir.padre_id !== null && idsToDelete.has(dir.padre_id)) {
                  if (!idsToDelete.has(dir.id)) {
                    idsToDelete.add(dir.id);
                    changed = true;
                  }
                }
              });
            }
            
            setDirectories(directories.filter(dir => !idsToDelete.has(dir.id)));
          }
        }
      ]
    );
  };

  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const toggleDirectorio = (id: number) => {
    setOpenDirectories({
      ...openDirectories,
      [id]: !openDirectories[id]
    });
  };

  const getFileIcon = (type?: string) => {
    switch(type) {
      case 'pdf': return 'picture-as-pdf';
      case 'ppt': return 'slideshow';
      case 'doc': return 'description';
      case 'xls': return 'table-chart';
      default: return 'insert-drive-file';
    }
  };

  const renderDirectories = (parentId: number | null = null, level = 0) => {
    return directories
      .filter(dir => dir.padre_id === parentId)
      .sort((a, b) => a.orden - b.orden)
      .map(dir => (
        <View key={dir.id} style={[styles.directory, { marginLeft: level * 20 }]}>
          <TouchableOpacity
            style={styles.directoryRow}
            onPress={() => dir.directorio ? toggleDirectorio(dir.id) : navigation.navigate('Viewer', { file: dir })}
          >
            <MaterialIcons 
              name={dir.directorio ? 
                (openDirectories[dir.id] ? 'folder-open' : 'folder') : 
                getFileIcon(dir.tipo)} 
              size={24} 
              color={dir.directorio ? '#FFA000' : '#757575'} 
            />
            <Text style={styles.directoryName}>{dir.nombre}</Text>
            
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={() => toggleMenu(dir.id)}
            >
              <MaterialIcons name="more-vert" size={24} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>

          {activeMenu === dir.id && (
            <View style={styles.menuOptions}>
              {dir.directorio && (
                <>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      addDirectory(dir.id);
                      setActiveMenu(null);
                    }}
                  >
                    <MaterialIcons name="create-new-folder" size={20} color="#333" />
                    <Text style={styles.menuText}>Nueva carpeta</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      addFile(dir.id);
                      setActiveMenu(null);
                    }}
                  >
                    <MaterialIcons name="note-add" size={20} color="#333" />
                    <Text style={styles.menuText}>Nuevo archivo</Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  dir.directorio ? editDirectory(dir.id) : editFile(dir.id);
                  setActiveMenu(null);
                }}
              >
                <MaterialIcons name="edit" size={20} color="#333" />
                <Text style={styles.menuText}>Renombrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  deleteDirectory(dir.id);
                  setActiveMenu(null);
                }}
              >
                <MaterialIcons name="delete" size={20} color="#ff4444" />
                <Text style={[styles.menuText, { color: '#ff4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}

          {dir.directorio && openDirectories[dir.id] && (
            <View style={styles.subdirectories}>
              {renderDirectories(dir.id, level + 1)}
            </View>
          )}
        </View>
      ));
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {renderDirectories()}
      </ScrollView>

      <Modal
        visible={mostrarConfigurador}
        animationType="slide"
        onRequestClose={() => setMostrarConfigurador(false)}
      >
        <View style={styles.modalContainer}>
          <ConfiguradorInforme
            onClose={() => setMostrarConfigurador(false)}
            onConfirm={handleConfirm}
            initialData={currentFile}
          />
        </View>
      </Modal>
    </View>
  );
};

const ConfiguradorInforme: React.FC<ConfiguradorInformeProps> = ({ onClose, onConfirm, initialData }) => {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [tipo, setTipo] = useState(initialData?.tipo || 'Informe');
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '');

  const handleSubmit = () => {
    const informeData: FileData = {
      id: initialData?.id || 0,
      nombre,
      tipo,
      descripcion,
    };
    
    onConfirm(informeData);
  };

  return (
    <View style={configStyles.modalContent}>
      <View style={configStyles.header}>
        <Text style={configStyles.title}>
          {initialData ? 'Editar Documento' : 'Nuevo Documento'}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={configStyles.formContainer}>
        <View style={configStyles.inputGroup}>
          <Text style={configStyles.label}>Nombre:</Text>
          <TextInput
            style={configStyles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del documento"
          />
        </View>

        <View style={configStyles.inputGroup}>
          <Text style={configStyles.label}>Tipo:</Text>
          <TextInput
            style={configStyles.input}
            value={tipo}
            onChangeText={setTipo}
            placeholder="Tipo de documento"
          />
        </View>

        <View style={configStyles.inputGroup}>
          <Text style={configStyles.label}>Descripción:</Text>
          <TextInput
            style={[configStyles.input, { height: 80 }]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción del documento"
            multiline
          />
        </View>
      </ScrollView>

      <View style={configStyles.footer}>
        <TouchableOpacity 
          style={[configStyles.button, configStyles.cancelButton]}
          onPress={onClose}
        >
          <Text style={configStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[configStyles.button, configStyles.confirmButton]}
          onPress={handleSubmit}
        >
          <Text style={configStyles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const configStyles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  container: {
    flex: 1,
  },
  directory: {
    marginVertical: 4,
  },
  directoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  directoryName: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  menuOptions: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    padding: 8,
    zIndex: 1,
    width: 200,
    position: 'absolute',
    right: 10,
    top: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  subdirectories: {
    marginLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    paddingLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default DirectoryTree;