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

# 🧪 Tests — App Compras

Este proyecto incluye una suite de tests unitarios ubicada en la carpeta `__tests__/`. Los tests cubren tres capas distintas de la aplicación: lógica de negocio pura, estado global y componentes visuales.

---

## Herramientas utilizadas

- **Jest** — runner de tests y sistema de assertions
- **@testing-library/react-native** — renderizado y simulación de interacciones sobre componentes React Native
- **Zustand** (API de `getState` / `setState`) — acceso directo al store para testear acciones sin necesidad de montar componentes

---

## Estructura de la suite

```
__tests__/
├── validations.test.js       # Lógica de negocio pura (funciones utilitarias)
├── useShoppingStore.test.js  # Estado global (store Zustand)
└── BotonCustom.test.js       # Componente reutilizable (UI)
```

Cada archivo apunta a una capa diferente de la arquitectura, lo que permite identificar rápidamente dónde falla algo cuando un test no pasa.

---

## Descripción de cada archivo

### `validations.test.js`

Testea las funciones `validarNombreProducto` y `formatearNombreProducto` de `src/utils/validations.js`. Son funciones puras —reciben un valor y devuelven un resultado— por lo que no requieren ningún setup especial.

| Test | Qué verifica |
|---|---|
| Rechaza texto vacío | `validarNombreProducto('')` devuelve `false` |
| Rechaza solo espacios | `validarNombreProducto(' ')` devuelve `false` |
| Rechaza un solo carácter | `validarNombreProducto('a')` devuelve `false` |
| Acepta un nombre válido | `validarNombreProducto('Yerba')` devuelve `true` |
| Primera letra en mayúscula | `formatearNombreProducto('yerba')` devuelve `'Yerba'` |
| Recorta espacios extremos | `formatearNombreProducto(' pan ')` devuelve `'Pan'` |

---

### `useShoppingStore.test.js`

Testea el store global de Zustand (`src/store/useShoppingStore.js`). Zustand expone `getState()` y `setState()` directamente sobre el store, lo que permite manipular y verificar el estado sin montar ningún componente.

Antes de cada test se reinicia el store a un estado limpio (`productos: []`) usando `beforeEach`, garantizando que los tests sean independientes entre sí.

| Test | Qué verifica |
|---|---|
| Estado inicial vacío | El array `productos` arranca como `[]` |
| `addProducto` | Agrega un producto y verifica nombre y longitud del array |
| `removeProducto` | Elimina por `id` y verifica que el producto correcto persiste |
| `updateProducto` | Modifica un campo de un producto existente |

---

### `BotonCustom.test.js`

Testea el componente `BotonCustom` de `src/components/BotonCustom.js` usando `@testing-library/react-native`. Se verifica tanto el renderizado visual como el comportamiento ante interacciones del usuario.

| Test | Qué verifica |
|---|---|
| Renderiza el título | El texto pasado por prop `titulo` aparece en pantalla |
| Ejecuta `onPress` | Al presionar el botón, el callback se llama exactamente una vez |

---

## Cómo correr los tests

```bash
npx jest
```

Para ver un reporte detallado:

```bash
npx jest --verbose
```

---

## Uso de IA en el desarrollo de los tests

Los tests de este proyecto fueron desarrollados con asistencia de IA (Claude). El proceso fue el siguiente:

**1. Definición de la estrategia de testing**
Se le indicó a la IA la arquitectura del proyecto (componentes, store Zustand, utilidades) y se le pidió que propusiera qué capas testear y con qué herramientas. La IA recomendó separar los tests en tres categorías —lógica pura, estado global y componentes— para cubrir distintas superficies de error de forma independiente.

**2. Generación inicial de los tests**
Con el código de cada módulo como contexto, la IA generó los bloques `describe` e `it` con sus assertions correspondientes. Los casos de borde (string vacío, solo espacios, un carácter) para `validarNombreProducto` fueron sugeridos directamente por la IA en base al comportamiento esperado de la función.

**3. Setup de aislamiento del store**
La IA identificó que los tests del store Zustand necesitaban un `beforeEach` para reiniciar el estado entre tests, evitando que un test afecte al siguiente. Esto fue incorporado al archivo junto con la explicación en el comentario del código.

**4. Revisión y ajustes manuales**
Una vez generados los tests, se revisó manualmente que los nombres de los módulos importados y los paths relativos fueran correctos para la estructura del proyecto.

En resumen, la IA aceleró la escritura de los tests y aportó criterios sobre qué casos cubrir, mientras que la revisión humana garantizó que el código generado encajara correctamente con el proyecto real.

## Stack técnico
- React Native 0.81 / Expo SDK 54
- React Navigation (native-stack)
- Zustand (estado global) + AsyncStorage (persistencia)
- expo-notifications, expo-image-picker, expo-location, expo-contacts, expo-calendar
- Jest + jest-expo + @testing-library/react-native

Demo del Parcial 2 en YouTube: https://youtube.com/shorts/w4uh3vuHh8Y?feature=share
