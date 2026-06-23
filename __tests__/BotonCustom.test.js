import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import BotonCustom from '../src/components/BotonCustom';

// Test de un COMPONENTE reutilizable: renderiza y responde a interacciones.
describe('BotonCustom', () => {
  it('renderiza el texto del titulo', () => {
    render(<BotonCustom titulo="Guardar" onPress={() => {}} />);
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  it('ejecuta onPress cuando se presiona', () => {
    const onPress = jest.fn();
    render(<BotonCustom titulo="Tocar" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tocar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
