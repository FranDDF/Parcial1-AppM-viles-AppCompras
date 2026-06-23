
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonCustom from '../components/BotonCustom';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { loginContext } = useAuth();

  const ingresar = async () => {
    const datos = await AsyncStorage.getItem('cuentaLocal');
    if (datos) {
      const cuenta = JSON.parse(datos);
      if (cuenta.user === usuario && cuenta.pass === password) {
        loginContext(cuenta.user);
        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'Datos incorrectos');
      }
    } else {
      Alert.alert('Error', 'No hay usuarios registrados');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      <TextInput style={styles.input} placeholder="Usuario" onChangeText={setUsuario} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry={true} onChangeText={setPassword} />
      <BotonCustom titulo="Entrar" onPress={ingresar} color="#4CAF50" />
      <BotonCustom titulo="Ir a Registrarse" onPress={() => navigation.navigate('Register')} color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});