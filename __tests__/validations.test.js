import {
  validarNombreProducto,
  formatearNombreProducto,
} from '../src/utils/validations';

// Test de LOGICA DE NEGOCIO: validacion y formateo.
describe('validarNombreProducto', () => {
  it('rechaza un texto vacio', () => {
    expect(validarNombreProducto('')).toBe(false);
  });

  it('rechaza solo espacios', () => {
    expect(validarNombreProducto('   ')).toBe(false);
  });

  it('rechaza un solo caracter', () => {
    expect(validarNombreProducto('a')).toBe(false);
  });

  it('acepta un nombre valido', () => {
    expect(validarNombreProducto('Yerba')).toBe(true);
  });
});

describe('formatearNombreProducto', () => {
  it('pone la primera letra en mayuscula', () => {
    expect(formatearNombreProducto('yerba')).toBe('Yerba');
  });

  it('recorta los espacios de los extremos', () => {
    expect(formatearNombreProducto('  pan  ')).toBe('Pan');
  });
});
