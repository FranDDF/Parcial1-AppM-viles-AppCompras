import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useShoppingStore = create(
  persist(
    (set) => ({
      productos: [],

      //agregacion de producto
      addProducto: (producto) =>
        set((state) => ({ productos: [...state.productos, producto] })),

      //eliminacion de producto por id
      removeProducto: (id) =>
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
        })),

      //actualiza un producto ya agregado
      updateProducto: (id, cambios) =>
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === id ? { ...p, ...cambios } : p
          ),
        })),
    }),
    {
      name: 'lista-compras-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
