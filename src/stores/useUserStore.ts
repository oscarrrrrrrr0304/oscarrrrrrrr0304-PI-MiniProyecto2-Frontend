/**
 * Store de Zustand para la gestión del estado de autenticación de usuario
 * Incluye persistencia en localStorage para mantener la sesión
 * 
 * @module useUserStore
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth.service";
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from "../types/auth.types.js";

/**
 * Interface del estado de autenticación
 * @interface AuthState
 * @property {User | null} user - Usuario autenticado actual (incluye id, name, email, age, moviesLiked), null si no hay sesión
 * @property {string | null} token - Token JWT de autenticación
 * @property {boolean} isAuthenticated - Estado de autenticación del usuario
 * @property {boolean} isLoading - Indica si hay una operación en progreso
 * @property {string | null} error - Mensaje de error si hubo un problema
 */
interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /**
   * Inicia sesión con credenciales
   * @param {LoginCredentials} credentials - Email y contraseña
   * @returns {Promise<void>}
   * @throws {Error} Si las credenciales son inválidas
   */
  login: (credentials: LoginCredentials) => Promise<void>;
  
  /**
   * Registra un nuevo usuario
   * @param {RegisterData} data - Datos del nuevo usuario
   * @returns {Promise<void>}
   * @throws {Error} Si el email ya está registrado
   */
  register: (data: RegisterData) => Promise<void>;
  
  /**
   * Cierra la sesión del usuario
   * @returns {Promise<void>}
   */
  logout: () => Promise<void>;
  
  /**
   * Solicita recuperación de contraseña por email
   * @param {ForgotPasswordData} data - Email del usuario
   * @returns {Promise<void>}
   * @throws {Error} Si el email no está registrado
   */
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  
  /**
   * Resetea la contraseña con un token
   * @param {ResetPasswordData} data - Token y nueva contraseña
   * @returns {Promise<void>}
   * @throws {Error} Si el token es inválido
   */
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  
  /**
   * Actualiza los datos del perfil de usuario
   * @param {UpdateUserData} data - Datos a actualizar
   * @returns {Promise<void>}
   * @throws {Error} Si el usuario no está autenticado o los datos son inválidos
   */
  updateUser: (data: UpdateUserData) => Promise<void>;
  
  /**
   * Cambia la contraseña del usuario
   * @param {ChangePasswordData} data - Contraseña actual y nueva
   * @returns {Promise<void>}
   * @throws {Error} Si la contraseña actual es incorrecta
   */
  changePassword: (data: ChangePasswordData) => Promise<void>;
  
  /**
   * Elimina permanentemente la cuenta del usuario
   * @returns {Promise<void>}
   * @throws {Error} Si el usuario no está autenticado
   */
  deleteAccount: () => Promise<void>;
  
  /**
   * Verifica la validez del token JWT almacenado
   * Se ejecuta al cargar la aplicación para auto-login
   * @returns {Promise<void>}
   */
  verifyToken: () => Promise<void>;
  
  /**
   * Limpia el mensaje de error del estado
   * @returns {void}
   */
  clearError: () => void;
  
  /**
   * Establece manualmente el usuario en el estado
   * @param {User} user - Usuario a establecer
   * @returns {void}
   */
  setUser: (user: User) => void;
  
  /**
   * Actualiza el array de videos favoritos del usuario
   * Optimizado para evitar re-renders innecesarios
   * @param {string[]} moviesLiked - Array actualizado de IDs de videos favoritos
   * @returns {void}
   */
  updateMoviesLiked: (moviesLiked: string[]) => void;
}

/**
 * Hook de Zustand para el estado de autenticación
 * Incluye middleware de persistencia para guardar usuario, token e isAuthenticated en localStorage
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useUserStore();
 * 
 * // Usar en componente
 * if (isAuthenticated) {
 *   console.log('Usuario:', user.name);
 * }
 * 
 * // Login
 * await login({ email: 'user@example.com', password: '123456' });
 * ```
 */
const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          
          console.log('✓ Login exitoso -', response.user.name);
          console.log('Videos favoritos:', response.user.moviesLiked?.length || 0);
          
          localStorage.setItem("token", response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Registro
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          localStorage.setItem("token", response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al registrarse";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        // Con JWT no necesitamos llamar al backend
        // Solo limpiamos el estado local y el token
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Recuperación de contraseña
      forgotPassword: async (data: ForgotPasswordData) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Store: Iniciando forgotPassword con:", data);
          const result = await authService.forgotPassword(data);
          console.log("Store: Respuesta recibida:", result);
          set({ isLoading: false });
        } catch (error: unknown) {
          console.error("Store: Error en forgotPassword:", error);
          const errorMessage = error instanceof Error ? error.message : "Error al enviar correo de recuperación";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Resetear contraseña
      resetPassword: async (data: ResetPasswordData) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(data);
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al resetear la contraseña";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Actualizar usuario
      updateUser: async (data: UpdateUserData) => {
        const state = useUserStore.getState();
        const userId = state.user?.id;
        const currentUser = state.user;
        
        if (!userId || !currentUser) {
          throw new Error("No se encontró el usuario. Por favor, vuelve a iniciar sesión.");
        }

        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateUser(userId, data);
          
          // Crear un nuevo objeto de usuario con los datos actualizados
          // Mantener moviesLiked y otros campos que no se actualizan
          const newUserData: User = {
            id: userId,
            name: updatedUser.name ?? data.name ?? currentUser.name,
            email: updatedUser.email ?? data.email ?? currentUser.email,
            age: updatedUser.age ?? data.age ?? currentUser.age,
            moviesLiked: updatedUser.moviesLiked ?? currentUser.moviesLiked, // Preservar moviesLiked
          };
          
          // Actualizar el estado con un nuevo objeto para forzar la re-renderización
          set({
            user: { ...newUserData }, // Crear una nueva referencia del objeto
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al actualizar perfil";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Cambiar contraseña
      changePassword: async (data: ChangePasswordData) => {
        const state = useUserStore.getState();
        const userId = state.user?.id;
        
        if (!userId) {
          throw new Error("No se encontró el usuario. Por favor, vuelve a iniciar sesión.");
        }

        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(data);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al cambiar contraseña";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Eliminar cuenta
      deleteAccount: async () => {
        const state = useUserStore.getState();
        const currentUser = state.user;
        
        if (!currentUser || !currentUser.id) {
          throw new Error("No se encontró el usuario. Por favor, vuelve a iniciar sesión.");
        }

        set({ isLoading: true, error: null });
        try {
          await authService.deleteAccount(currentUser);
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al eliminar cuenta";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Verificar token (auto-login)
      verifyToken: async () => {
        const state = useUserStore.getState();
        const token = localStorage.getItem("token");
        
        // Si no hay token, marcar como no autenticado
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        // Si ya hay un usuario en el estado (de la persistencia), no hacer nada
        if (state.user && state.isAuthenticated) {
          console.log("✓ Usuario autenticado -", state.user.name);
          console.log("Videos favoritos:", state.user.moviesLiked?.length || 0);
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.verifyToken();
          
          console.log('✓ Token verificado -', user.name);
          console.log('Videos favoritos:', user.moviesLiked?.length || 0);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error al verificar token:", error);
          // Solo limpiar si realmente falla la verificación
          // Comentamos esto para no cerrar sesión automáticamente
          // localStorage.removeItem("token");
          // set({
          //   user: null,
          //   token: null,
          //   isAuthenticated: false,
          //   isLoading: false,
          //   error: null,
          // });
          
          // En su lugar, mantener el estado actual de la persistencia
          set({ isLoading: false });
        }
      },

      // Utilidades
      clearError: () => set({ error: null }),
      setUser: (user: User) => set({ user }),
      
      /**
       * Actualiza solo el array moviesLiked sin afectar otros campos
       * Optimizado para evitar re-renders del componente VideoPage
       */
      updateMoviesLiked: (moviesLiked: string[]) => {
        const state = useUserStore.getState();
        if (state.user) {
          set({
            user: {
              ...state.user,
              moviesLiked
            }
          });
        }
      },
    }),
    {
      name: "user-storage", // nombre en localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;