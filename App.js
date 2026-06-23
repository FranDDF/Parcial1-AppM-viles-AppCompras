import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddProductScreen from './src/screens/AddProductScreen';

//manejé error con try catch para salvar el error
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {}

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function configurarNotificaciones() {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        let permiso = status;
        if (status !== 'granted') {
          const req = await Notifications.requestPermissionsAsync();
          permiso = req.status;
        }
        if (permiso !== 'granted') return;

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Recordatorios',
            importance: Notifications.AndroidImportance.MAX,
          });
        }
      } catch (e) {

      }
    }
    configurarNotificaciones();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio', headerBackVisible: false }} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Agregar Producto' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
