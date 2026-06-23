# README realizado con IA

# Lista de Compras — App Móvil (React Native + Expo)

Aplicación móvil desarrollada en React Native (Expo) para la materia de Aplicaciones Móviles.

## Opción elegida
**Lista de compras**: permite gestionar productos a comprar de manera local, con un login simple simulado que mantiene la sesión del usuario.

---

## Parcial 2 — Funcionalidades agregadas

La app del Parcial 1 se amplió con acceso a recursos del dispositivo, estado global y testing:

### 1. Permisos y acceso a recursos
Antes de usar cada recurso se solicita el permiso correspondiente y se maneja el estado
(concedido / denegado), mostrando un mensaje claro al usuario si se rechaza.

### 2. Cámara y galería (`expo-image-picker`)
Al agregar un producto se puede **tomar una foto** con la cámara o **elegir una imagen** de la galería.
La foto queda asociada al producto y se muestra como miniatura en la lista.

### 3. Ubicación / GPS (`expo-location`)
Se obtiene la ubicación actual del dispositivo y, mediante geocoding inverso, se guarda la
**dirección aproximada del comercio** donde comprar el producto. Se muestra en la lista.

### 4. Contactos y calendario (`expo-contacts`, `expo-calendar`)
- **Contactos**: se puede elegir un contacto de la agenda como **proveedor** del producto.
- **Calendario**: al guardar un producto se crea un **recordatorio** ("Comprar: ...") en el
  calendario del dispositivo.

### 5. Estado global con Zustand
La lista de productos se migró de `useState` + AsyncStorage manual a un **store global de Zustand**
(`src/store/useShoppingStore.js`), con acciones `addProducto`, `removeProducto` y `updateProducto`,
y persistencia en el dispositivo. Las pantallas leen y modifican el estado a través del store.

### 6. Testing con Jest + React Native Testing Library
Tres tests mínimos en la carpeta `__tests__/`:
- **Componente reutilizable**: `BotonCustom` (render e interacción).
- **Lógica de negocio**: validación y formateo de nombres (`src/utils/validations.js`).
- **Store global**: acciones del store de Zustand.

---

## Cómo ejecutar la app

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el proyecto en el emulador de Android (Android Studio) o dispositivo:
   ```bash
   npx expo start --android
   ```
   También se puede abrir con **Expo Go** escaneando el QR (`npx expo start`).

> Nota: las notificaciones locales funcionan en Expo Go. Para notificaciones en segundo plano y
> el resto de recursos nativos, se recomienda el emulador de Android Studio o un development build.

## Cómo correr los tests

```bash
npm test
```

## Stack técnico
- React Native 0.81 / Expo SDK 54
- React Navigation (native-stack)
- Zustand (estado global) + AsyncStorage (persistencia)
- expo-notifications, expo-image-picker, expo-location, expo-contacts, expo-calendar
- Jest + jest-expo + @testing-library/react-native

Demo del Parcial 2 en YouTube: https://youtube.com/shorts/w4uh3vuHh8Y?feature=share
