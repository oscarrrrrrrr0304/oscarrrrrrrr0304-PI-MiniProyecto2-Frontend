/**
 * Tipos de TypeScript para autenticación y gestión de usuarios
 * @module auth.types
 */

/**
 * Usuario de la aplicación
 * @interface User
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre completo del usuario
 * @property {string} email - Email del usuario (usado para login)
 * @property {number} age - Edad del usuario
 */
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

/**
 * Respuesta del servidor para operaciones de autenticación (login/register)
 * @interface AuthResponse
 * @property {User} user - Datos del usuario autenticado
 * @property {string} token - Token JWT para autenticación en peticiones futuras
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Credenciales para iniciar sesión
 * @interface LoginCredentials
 * @property {string} email - Email del usuario
 * @property {string} password - Contraseña del usuario
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos necesarios para registrar un nuevo usuario
 * @interface RegisterData
 * @property {string} name - Nombre completo
 * @property {string} email - Email único
 * @property {string} password - Contraseña (mínimo 6 caracteres recomendado)
 * @property {number} age - Edad del usuario
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
}

/**
 * Datos opcionales para actualizar el perfil de usuario
 * Todos los campos son opcionales, solo se actualizan los proporcionados
 * @interface UpdateUserData
 * @property {string} [name] - Nuevo nombre
 * @property {string} [email] - Nuevo email
 * @property {number} [age] - Nueva edad
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  age?: number;
}

/**
 * Datos para cambiar la contraseña del usuario
 * @interface ChangePasswordData
 * @property {string} currentPassword - Contraseña actual para validar
 * @property {string} newPassword - Nueva contraseña
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Datos para solicitar recuperación de contraseña
 * @interface ForgotPasswordData
 * @property {string} email - Email del usuario que olvidó su contraseña
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Datos para resetear la contraseña con un token
 * @interface ResetPasswordData
 * @property {string} token - Token recibido por email
 * @property {string} newPassword - Nueva contraseña a establecer
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}
