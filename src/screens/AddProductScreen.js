import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import BotonCustom from '../components/BotonCustom';
import { useShoppingStore } from '../store/useShoppingStore';
import { validarNombreProducto, formatearNombreProducto } from '../utils/validations';

export default function AddProductScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [cargandoUbic, setCargandoUbic] = useState(false);

  const addProducto = useShoppingStore((state) => state.addProducto);

  //app cámara
  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la camara para tomar la foto del producto.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.5, allowsEditing: true });
    if (!resultado.canceled) setFoto(resultado.assets[0].uri);
  };

  //app galería
  const elegirDeGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galeria para elegir una imagen.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, allowsEditing: true });
    if (!resultado.canceled) setFoto(resultado.assets[0].uri);
  };

  //app GPS
  const obtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la ubicacion para registrar el comercio.');
      return;
    }
    setCargandoUbic(true);
    try {
      const pos = await Location.getCurrentPositionAsync({});
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      let direccion = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      try {
        const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        if (geo && geo[0]) {
          const g = geo[0];
          const partes = [g.street, g.name, g.city].filter(Boolean);
          if (partes.length) direccion = partes.join(', ');
        }
      } catch (e) {
        // Si falla el geocoding, dejamos las coordenadas como direccion.
      }
      setUbicacion({ latitude: lat, longitude: lon, direccion });
    } catch (e) {
      Alert.alert('Error', 'No pudimos obtener la ubicacion. Intentá de nuevo.');
    } finally {
      setCargandoUbic(false);
    }
  };

  //contactos
  const elegirContacto = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a los contactos para asociar un proveedor.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
    const conNombre = (data || []).filter((c) => c.name);
    if (conNombre.length === 0) {
      Alert.alert('Sin contactos', 'No hay contactos disponibles en el dispositivo.');
      return;
    }
  
    const botones = conNombre.slice(0, 6).map((c) => ({
      text: c.name,
      onPress: () =>
        setContacto({
          nombre: c.name,
          telefono: c.phoneNumbers && c.phoneNumbers[0] ? c.phoneNumbers[0].number : '',
        }),
    }));
    botones.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert('Elegí un proveedor', 'Seleccioná un contacto:', botones);
  };

  //calendario
  const crearRecordatorioEnCalendario = async (nombreProducto) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se pudo crear el recordatorio (permiso de calendario denegado).');
      return false;
    }
    try {
      const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const modificable = calendarios.find((c) => c.allowsModifications);
      if (!modificable) return false;
      const inicio = new Date(Date.now() + 60 * 60 * 1000); // dentro de 1 hora
      const fin = new Date(inicio.getTime() + 30 * 60 * 1000);
      await Calendar.createEventAsync(modificable.id, {
        title: `Comprar: ${nombreProducto}`,
        startDate: inicio,
        endDate: fin,
        notes: 'Recordatorio creado desde la app Lista de Compras.',
      });
      return true;
    } catch (e) {
      return false;
    }
  };

  //guardar
  const guardar = async () => {
    if (!validarNombreProducto(nombre)) {
      Alert.alert('Nombre invalido', 'El nombre del producto debe tener al menos 2 caracteres.');
      return;
    }
    const nombreFinal = formatearNombreProducto(nombre);

    //se guarda en Zustand
    addProducto({
      id: Date.now(),
      nombre: nombreFinal,
      foto,
      ubicacion,
      contacto,
    });

    //recordatorio en calendario
    const creado = await crearRecordatorioEnCalendario(nombreFinal);
    if (creado) {
      Alert.alert('Guardado', 'Producto agregado y recordatorio creado en el calendario.');
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Nuevo Producto</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} placeholder="Ej: Yerba" value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Foto del producto</Text>
      {foto ? <Image source={{ uri: foto }} style={styles.preview} /> : null}
      <BotonCustom titulo="Tomar foto" onPress={tomarFoto} color="#3F51B5" />
      <BotonCustom titulo="Elegir de galeria" onPress={elegirDeGaleria} color="#3F51B5" />

      <Text style={styles.label}>Comercio (ubicacion)</Text>
      {ubicacion ? <Text style={styles.info}>{ubicacion.direccion}</Text> : null}
      {cargandoUbic ? (
        <ActivityIndicator size="small" color="#009688" style={styles.loader} />
      ) : (
        <BotonCustom titulo="Obtener ubicacion actual" onPress={obtenerUbicacion} color="#009688" />
      )}

      <Text style={styles.label}>Proveedor (contacto)</Text>
      {contacto ? (
        <Text style={styles.info}>
          {contacto.nombre}
          {contacto.telefono ? ` - ${contacto.telefono}` : ''}
        </Text>
      ) : null}
      <BotonCustom titulo="Elegir proveedor" onPress={elegirContacto} color="#9C27B0" />

      <BotonCustom titulo="Guardar" onPress={guardar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contenido: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  preview: { width: '100%', height: 180, borderRadius: 8, marginBottom: 10, backgroundColor: '#eee' },
  info: { fontSize: 14, color: '#444', backgroundColor: '#f2f2f2', padding: 8, borderRadius: 5, marginBottom: 5 },
  loader: { marginVertical: 10 },
});
