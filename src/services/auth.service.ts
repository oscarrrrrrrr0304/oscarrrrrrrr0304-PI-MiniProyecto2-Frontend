/**
 * Servicio de autenticación para interactuar con el backend
 * Maneja login, registro, verificación de token, recuperación de contraseña y gestión de usuario
 * 
 * @module authService
 */

import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateUserData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  User,
} from "../types/auth.types.js";

/**
 * URL base del backend obtenida desde variables de entorno
 * @constant {string}
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Maneja las respuestas de las peticiones HTTP
 * Parsea errores del backend y lanza excepciones con mensajes descriptivos
 * 
 * @async
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<any>} JSON parseado de la respuesta
 * @throws {Error} Si la respuesta no es exitosa (status code >= 400)
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Error en la solicitud",
    }));
    throw new Error(error.message || error.error || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Obtiene los headers de autenticación con el token JWT
 * Incluye el token desde localStorage si existe
 * 
 * @returns {Object} Headers con Content-Type y Authorization (si hay token)
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Servicio de autenticación y gestión de usuarios
 * @namespace authService
 */
export const authService = {
  /**
   * Inicia sesión con credenciales de usuario
   * @async
   * @param {LoginCredentials} credentials - Email y contraseña del usuario
   * @returns {Promise<AuthResponse>} Usuario autenticado y token JWT
   * @throws {Error} Si las credenciales son inválidas
   * @example
   * const { user, token } = await authService.login({ email: 'user@example.com', password: '123456' });
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },

  /**
   * Registra un nuevo usuario en la aplicación
   * @async
   * @param {RegisterData} data - Datos del nuevo usuario (nombre, email, contraseña, edad)
   * @returns {Promise<AuthResponse>} Usuario registrado y token JWT
   * @throws {Error} Si el email ya está registrado o los datos son inválidos
   * @example
   * const { user, token } = await authService.register({ name: 'Juan', email: 'juan@example.com', password: '123456', age: 25 });
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Verifica la validez del token JWT almacenado
   * Usado para auto-login al cargar la aplicación
   * @async
   * @returns {Promise<User>} Datos del usuario si el token es válido
   * @throws {Error} Si el token es inválido o ha expirado
   * @example
   * const user = await authService.verifyToken();
   */
  async verifyToken(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  /**
   * Solicita un correo de recuperación de contraseña
   * @async
   * @param {ForgotPasswordData} data - Email del usuario
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   * @throws {Error} Si el email no está registrado
   * @example
   * await authService.forgotPassword({ email: 'user@example.com' });
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Resetea la contraseña usando el token recibido por email
   * @async
   * @param {ResetPasswordData} data - Token de reseteo y nueva contraseña
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   * @throws {Error} Si el token es inválido o ha expirado
   * @example
   * await authService.resetPassword({ token: 'reset-token-123', newPassword: 'newpass123' });
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Actualiza los datos del perfil de usuario
   * @async
   * @param {string} userId - ID del usuario a actualizar
   * @param {UpdateUserData} data - Datos a actualizar (nombre, email, edad)
   * @returns {Promise<User>} Usuario actualizado
   * @throws {Error} Si el usuario no existe o los datos son inválidos
   * @example
   * const updatedUser = await authService.updateUser('user-id-123', { name: 'Juan Carlos' });
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Cambia la contraseña del usuario
   * Requiere la contraseña actual para validar la acción
   * @async
   * @param {string} userId - ID del usuario
   * @param {ChangePasswordData} data - Contraseña actual y nueva contraseña
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   * @throws {Error} Si la contraseña actual es incorrecta
   * @example
   * await authService.changePassword('user-id-123', { currentPassword: 'old123', newPassword: 'new456' });
   */
  async changePassword( data: ChangePasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Elimina permanentemente la cuenta del usuario
   * @async
   * @param {User} data - Datos del usuario a eliminar
   * @returns {Promise<User>} Usuario eliminado
   * @throws {Error} Si el usuario no existe
   * @example
   * await authService.deleteAccount(currentUser);
   */
  async deleteAccount(data: User): Promise<User> {
    const response = await fetch(`${API_URL}/users/${data.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Cierra la sesión del usuario
   * Intenta invalidar el token en el backend (si está implementado)
   * No lanza error si falla, ya que el token local se limpia de todas formas
   * @async
   * @returns {Promise<void>}
   * @example
   * await authService.logout();
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (error) {
      // Incluso si falla, limpiamos el token local
      console.error("Error en logout:", error);
    }
  },
};
