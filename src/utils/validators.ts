/**
 * @fileoverview Utilidades de validación para formularios
 * @module utils/validators
 */

/**
 * Interfaz para el resultado de validación de contraseña
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida que una contraseña cumpla con los requisitos de seguridad:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 * 
 * @param password - La contraseña a validar
 * @returns Objeto con isValid (boolean) y array de errores
 * 
 * @example
 * const result = validatePassword("MiPass123!");
 * if (!result.isValid) {
 *   console.log(result.errors); // Array de mensajes de error
 * }
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Mínimo 8 caracteres
  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  // Al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra mayúscula");
  }

  // Al menos un número
  if (!/[0-9]/.test(password)) {
    errors.push("La contraseña debe contener al menos un número");
  }

  // Al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("La contraseña debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{}...)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Obtiene un mensaje de ayuda con los requisitos de contraseña
 * 
 * @returns String con los requisitos de contraseña
 */
export const getPasswordRequirements = (): string => {
  return "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial";
};
