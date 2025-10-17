import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth.service";
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  ForgotPasswordData,
} from "../types/auth.types.js";

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones de autenticación
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  
  // Recuperación de contraseña
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  
  // Gestión de cuenta
  updateUser: (data: UpdateUserData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // Verificación de token
  verifyToken: () => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  setUser: (user: User) => void;
}

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
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error("Error en logout:", error);
        } finally {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Recuperación de contraseña
      forgotPassword: async (data: ForgotPasswordData) => {
        set({ isLoading: true, error: null });
        try {
          await authService.forgotPassword(data);
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al enviar correo de recuperación";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Actualizar usuario
      updateUser: async (data: UpdateUserData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateUser(data);
          set({
            user: updatedUser,
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

      // Eliminar cuenta
      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.deleteAccount();
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
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.verifyToken();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Utilidades
      clearError: () => set({ error: null }),
      setUser: (user: User) => set({ user }),
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