// validación de longitud de texto del producto
export function validarNombreProducto(nombre) {
  return typeof nombre === 'string' && nombre.trim().length >= 2;
}

export function formatearNombreProducto(nombre) {
  const limpio = String(nombre).trim();
  if (limpio.length === 0) return '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}
