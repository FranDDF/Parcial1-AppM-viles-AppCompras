import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotonCustom({ titulo, onPress, color = '#2196F3' }) {
  return (
    <TouchableOpacity style={[styles.boton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: { padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  texto: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});