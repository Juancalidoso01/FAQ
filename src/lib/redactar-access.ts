/**
 * Candado opcional para la herramienta de redacción.
 * Si REDACTAR_PASSWORD no está definida, el acceso es abierto.
 * Si está definida, las llamadas deben enviar el header x-redactar-clave.
 */
export function isRedactorAuthorized(request: Request): boolean {
  const required = process.env.REDACTAR_PASSWORD;
  if (!required) return true;
  return request.headers.get("x-redactar-clave") === required;
}

export function redactorRequiresPassword(): boolean {
  return Boolean(process.env.REDACTAR_PASSWORD);
}
