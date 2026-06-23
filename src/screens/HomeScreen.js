import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert, Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import BotonCustom from '../components/BotonCustom';
import { useAuth } from '../context/AuthContext';
import { useShoppingStore } from '../store/useShoppingStore';

export default function HomeScreen({ navigation }) {
  const { userEmail, logoutContext } = useAuth();

  //el estado ahora viene de Zustand y no de AsyncStorage
  const productos = useShoppingStore((state) => state.productos);
  const removeProducto = useShoppingStore((state) => state.removeProducto);

  const dispararNotificacion = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de compras',
          body: 'Acordate de comprar lo de la lista.',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
          repeats: false,
        },
      });
      Alert.alert('Vas a recibir un recordatorio en 5 segundos.');
    } catch (error) {
      Alert.alert('Recordatorio', 'Acordate de comprar lo de la lista.');
    }
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
        ListEmptyComponent={<Text style={styles.vacio}>Todavia no agregaste productos.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.foto ? (
              <Image source={{ uri: item.foto }} style={styles.miniatura} />
            ) : null}
            <View style={styles.itemTexto}>
              <Text style={styles.textoItem}>{item.nombre}</Text>
              {item.ubicacion ? (
                <Text style={styles.detalle}>Comercio: {item.ubicacion.direccion}</Text>
              ) : null}
              {item.contacto ? (
                <Text style={styles.detalle}>Proveedor: {item.contacto.nombre}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => removeProducto(item.id)}>
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
  vacio: { textAlign: 'center', color: '#888', marginTop: 30, fontSize: 15 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#eee', marginBottom: 10, borderRadius: 8 },
  miniatura: { width: 50, height: 50, borderRadius: 6, marginRight: 12, backgroundColor: '#ddd' },
  itemTexto: { flex: 1 },
  textoItem: { fontSize: 18 },
  detalle: { fontSize: 13, color: '#555', marginTop: 2 },
  borrar: { color: 'red', fontWeight: 'bold', marginLeft: 8 }
});
