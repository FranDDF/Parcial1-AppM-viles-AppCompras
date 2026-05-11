import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonCustom from '../components/BotonCustom';

export default function AddProductScreen({ navigation }) {
  const [nombre, setNombre] = useState('');

  const guardar = async () => {
    if (!nombre) return;
    
    const datosViejos = await AsyncStorage.getItem('listaCompras');
    const lista = datosViejos ? JSON.parse(datosViejos) : [];
    
    const nuevo = { id: Date.now(), nombre: nombre };
    lista.push(nuevo);
    
    await AsyncStorage.setItem('listaCompras', JSON.stringify(lista));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nuevo Producto</Text>
      <TextInput style={styles.input} placeholder="Ej: Yerba" onChangeText={setNombre} />
      <BotonCustom titulo="Guardar" onPress={guardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});