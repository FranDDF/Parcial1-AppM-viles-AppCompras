import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BotonCustom from '../components/BotonCustom';
import { useAuth } from '../context/AuthContext';

// import * as Notifications from 'expo-notifications'; --crashea el emulador

export default function HomeScreen({ navigation }) {
  const { userEmail, logoutContext } = useAuth();
  const [productos, setProductos] = useState([]);

  useFocusEffect(
    useCallback(() => { cargarProductos(); }, [])
  );

  const cargarProductos = async () => {
    const datos = await AsyncStorage.getItem('listaCompras');
    if (datos) setProductos(JSON.parse(datos));
  };

  const eliminar = async (id) => {
    const nuevaLista = productos.filter(p => p.id !== id);
    setProductos(nuevaLista);
    await AsyncStorage.setItem('listaCompras', JSON.stringify(nuevaLista));
  };

  const dispararNotificacion = () => {
    Alert.alert('¡Listo!', 'Notificación programada. Esperá 5 segundos...');

    setTimeout(() => {
      Alert.alert(":shopping_trolley: Recordatorio", "Acordate de comprar lo de la lista.");
    }, 5000);

    /* CÓDIGO DE NOTIFICACIÓN:
      await Notifications.scheduleNotificationAsync({
        content: { title: ":shopping_trolley: Recordatorio", body: "Acordate de comprar lo de la lista." },
        trigger: { seconds: 5 },
      });
    */
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saludo}>Hola, {userEmail}</Text>
        <Button title="Salir" color="red" onPress={() => logoutContext(navigation)} />
      </View>

      <Text style={styles.titulo}>Mi Lista</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.textoItem}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => eliminar(item.id)}>
              <Text style={styles.borrar}>:x: Borrar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <BotonCustom titulo="+ Agregar Producto" onPress={() => navigation.navigate('AddProduct')} />
      <BotonCustom titulo=":alarm_clock: Notificarme" onPress={dispararNotificacion} color="#FF9800" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  saludo: { fontSize: 18, fontWeight: 'bold' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#eee', marginBottom: 10, borderRadius: 8 },
  textoItem: { fontSize: 18 },
  borrar: { color: 'red', fontWeight: 'bold' }
});