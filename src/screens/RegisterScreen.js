import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonCustom from '../components/BotonCustom';

export default function RegisterScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const registrar = async () => {
    if (!usuario || !password) return Alert.alert('Error', 'Completá los datos');

    const cuenta = { user: usuario, pass: password };
    await AsyncStorage.setItem('cuentaLocal', JSON.stringify(cuenta));

    Alert.alert('Éxito', 'Registrado correctamente');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>
      <TextInput style={styles.input} placeholder="Usuario" onChangeText={setUsuario} />
      {/* ACÁ TAMBIÉN: secureTextEntry={true} explícito */}
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry={true} onChangeText={setPassword} />
      <BotonCustom titulo="Registrarme" onPress={registrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});