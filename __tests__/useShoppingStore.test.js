import { useShoppingStore } from '../src/store/useShoppingStore';

// Test del STORE GLOBAL (Zustand): las acciones actualizan el estado.
describe('useShoppingStore', () => {
  // Reiniciamos el estado antes de cada test para que sean independientes.
  beforeEach(() => {
    useShoppingStore.setState({ productos: [] });
  });

  it('arranca con la lista vacia', () => {
    expect(useShoppingStore.getState().productos).toEqual([]);
  });

  it('addProducto agrega un producto', () => {
    useShoppingStore.getState().addProducto({ id: 1, nombre: 'Yerba' });
    const { productos } = useShoppingStore.getState();
    expect(productos).toHaveLength(1);
    expect(productos[0].nombre).toBe('Yerba');
  });

  it('removeProducto elimina por id', () => {
    useShoppingStore.setState({
      productos: [
        { id: 1, nombre: 'Yerba' },
        { id: 2, nombre: 'Pan' },
      ],
    });
    useShoppingStore.getState().removeProducto(1);
    const { productos } = useShoppingStore.getState();
    expect(productos).toHaveLength(1);
    expect(productos[0].id).toBe(2);
  });

  it('updateProducto modifica un producto existente', () => {
    useShoppingStore.setState({ productos: [{ id: 1, nombre: 'Yerba' }] });
    useShoppingStore.getState().updateProducto(1, { nombre: 'Yerba Mate' });
    expect(useShoppingStore.getState().productos[0].nombre).toBe('Yerba Mate');
  });
});
