# Endpoint Necesario en el Backend

## ⚠️ El frontend está listo, pero falta implementar este endpoint en el backend

### Endpoint Requerido

```
PUT /api/users/:userId/password
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

### Request Body
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Response Success (200 OK)
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

### Response Errors

**401 Unauthorized** - Token inválido o expirado
```json
{
  "message": "Token inválido",
  "error": "Unauthorized"
}
```

**400 Bad Request** - Contraseña actual incorrecta
```json
{
  "message": "La contraseña actual es incorrecta",
  "error": "Invalid password"
}
```

**400 Bad Request** - Validación fallida
```json
{
  "message": "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial",
  "error": "Validation failed"
}
```

## Lógica del Backend (Pseudocódigo)

```javascript
// Controller: users.controller.js o similar
async changePassword(req, res) {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    const authenticatedUserId = req.user.id; // Del token JWT
    
    // 1. Verificar que el usuario autenticado sea el mismo que intenta cambiar la contraseña
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "No tienes permiso para cambiar esta contraseña",
        error: "Forbidden"
      });
    }
    
    // 2. Buscar el usuario en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "Usuario no encontrado",
        error: "Not found"
      });
    }
    
    // 3. Verificar que la contraseña actual sea correcta
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        message: "La contraseña actual es incorrecta",
        error: "Invalid password"
      });
    }
    
    // 4. Validar la nueva contraseña (opcional, el frontend ya lo hace)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: "La nueva contraseña no cumple los requisitos de seguridad",
        error: "Validation failed"
      });
    }
    
    // 5. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 6. Actualizar en la base de datos
    user.password = hashedPassword;
    await user.save();
    
    // 7. Respuesta exitosa
    return res.status(200).json({ 
      message: "Contraseña actualizada correctamente"
    });
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({ 
      message: "Error interno del servidor",
      error: "Internal server error"
    });
  }
}
```

## Registro de la Ruta (Express.js)

```javascript
// routes/users.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const usersController = require('../controllers/users.controller');

// Cambiar contraseña (requiere autenticación)
router.put('/:userId/password', authenticateToken, usersController.changePassword);

module.exports = router;
```

## Frontend está Preparado Para:

✅ **Validaciones en el frontend:**
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos un número
- Al menos un carácter especial
- Verificar que nueva contraseña y confirmación coincidan

✅ **UI completa:**
- Modal de edición de perfil con sección de contraseña
- Campos: contraseña actual, nueva contraseña, confirmar nueva
- Mensajes de error apropiados
- Toggle para mostrar/ocultar campos de contraseña

✅ **Manejo de errores:**
- Muestra mensaje específico del backend
- No actualiza el perfil si falla el cambio de contraseña
- Limpia los campos después de éxito

## Próximos Pasos

1. Implementa el endpoint `PUT /api/users/:userId/password` en el backend
2. Asegúrate de que use bcrypt para comparar la contraseña actual
3. Asegúrate de que hashee la nueva contraseña antes de guardar
4. Prueba el endpoint con Postman o Thunder Client
5. Una vez funcionando, la funcionalidad en el frontend funcionará automáticamente

## Alternativas de Endpoint

Si prefieres usar otra convención, puedes cambiar en `src/services/auth.service.ts` línea ~100:

- `PUT /api/users/:userId/change-password`
- `PATCH /api/users/:userId/password`
- `POST /api/auth/change-password` (y enviar userId en el body)
- `PUT /api/auth/update-password` (y obtener userId del token)
