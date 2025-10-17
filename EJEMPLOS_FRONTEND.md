# Ejemplos de Implementación en el Frontend

## 🎯 Componente: ForgotPasswordPage.jsx

```jsx
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Si el email existe, recibirás un correo con instrucciones');
        setEmail('');
      } else {
        setMessage(data.error || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <p>Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </form>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
```

## 🔐 Componente: ResetPasswordPage.jsx

```jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Obtener token de la URL
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validaciones
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token JWT
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage('¡Contraseña actualizada exitosamente! Redirigiendo...');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage(data.error || 'Error al resetear la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <p>Ingresa tu nueva contraseña</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
        </button>
      </form>

      {message && (
        <div className={message.includes('Error') || message.includes('no coinciden') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
```

## 🛣️ Configuración de Rutas (React Router)

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## 🔗 Agregar enlace en LoginPage

```jsx
// LoginPage.jsx
import { Link } from 'react-router-dom';

const LoginPage = () => {
  // ... tu código existente
  
  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        {/* Inputs de login */}
        
        <button type="submit">Iniciar Sesión</button>
        
        {/* Agregar este enlace */}
        <Link to="/forgot-password" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </div>
  );
};
```

## 🎨 Estilos CSS básicos

```css
/* ForgotPassword.css */
.forgot-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
}

.forgot-password-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.forgot-password-container p {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.forgot-password-container input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.forgot-password-container button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.forgot-password-container button:hover:not(:disabled) {
  background-color: #45a049;
}

.forgot-password-container button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  padding: 12px;
  margin-top: 15px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 5px;
  text-align: center;
}

.error-message {
  padding: 12px;
  margin-top: 15px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  border-radius: 5px;
  text-align: center;
}

/* ResetPassword.css */
.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
}

.input-group {
  position: relative;
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 12px 45px 12px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  width: auto;
}

.forgot-password-link {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #4CAF50;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password-link:hover {
  text-decoration: underline;
}
```

## ⚙️ Variables de Entorno Frontend (.env)

```env
# Vite
VITE_API_URL=http://localhost:3000

# Producción
# VITE_API_URL=https://tu-backend.render.com
```

## 📱 Versión con React Hook Form (opcional)

```jsx
import { useForm } from 'react-hook-form';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const password = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          newPassword: data.newPassword 
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/dashboard');
      } else {
        setApiError(result.error || 'Error al resetear la contraseña');
      }
    } catch (error) {
      setApiError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="password"
        {...register('newPassword', {
          required: 'La contraseña es requerida',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
          }
        })}
        placeholder="Nueva contraseña"
      />
      {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}

      <input
        type="password"
        {...register('confirmPassword', {
          required: 'Confirma tu contraseña',
          validate: value => value === password || 'Las contraseñas no coinciden'
        })}
        placeholder="Confirmar contraseña"
      />
      {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}

      <button type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
      </button>

      {apiError && <div className="error-message">{apiError}</div>}
    </form>
  );
};
```

## 📧 Ejemplo del Email que recibirá el usuario

El usuario recibirá un email con:
- Un botón grande para restablecer la contraseña
- El enlace completo (por si el botón no funciona)
- Advertencia de que el enlace expira en 1 hora
- Mensaje de que puede ignorar el correo si no lo solicitó

El enlace será algo como:
```
https://tu-frontend.vercel.app/reset-password/4a3f8b9c2d1e...
```

## 🔍 Testing con Thunder Client / Postman

### Forgot Password:
```
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "tu_email@gmail.com"
}
```

### Reset Password:
```
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "token": "token_del_email",
  "newPassword": "nuevaPassword123"
}
```
