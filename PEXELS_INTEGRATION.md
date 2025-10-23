# Integración con Pexels API

## 🎥 Configuración de la API de Pexels

### 1. Obtener una API Key

1. Ve a [Pexels API](https://www.pexels.com/api/)
2. Haz clic en "Get Started" o "Sign Up"
3. Crea una cuenta o inicia sesión
4. Ve a tu perfil y copia tu API Key

### 2. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (ya existe `.env.example` como referencia)
2. Agrega tu API Key:

```env
VITE_API_URL=https://oscarrrrrrrr0304-pi-miniproyecto2-backend.onrender.com/api
VITE_PEXELS_API_KEY=TU_API_KEY_AQUI
```

3. **IMPORTANTE:** Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)

### 3. Reiniciar el Servidor de Desarrollo

Después de crear/modificar el archivo `.env`, reinicia el servidor:

```bash
npm run dev
```

## 📁 Archivos Creados

### Tipos de TypeScript
- **`src/types/pexels.types.ts`** - Interfaces para la API de Pexels

### Servicios
- **`src/services/pexels.service.ts`** - Servicio para interactuar con Pexels API
  - `getVideoById(id)` - Obtener un video específico
  - `searchVideos(query, page, perPage)` - Buscar videos
  - `getPopularVideos(page, perPage)` - Videos populares
  - `getVideoHDUrl(video)` - Obtener URL en HD
  - `getVideoSDUrl(video)` - Obtener URL en SD

### Componentes
- **`src/components/VideoCard.tsx`** - Card para mostrar videos
  - Props: `video` (PexelsVideo), `onVideoClick` (callback)
  - Muestra: imagen, nombre del autor, duración, likes placeholder

- **`src/components/VideoPlayerModal.tsx`** - Modal para reproducir videos
  - Props: `video`, `isOpen`, `onClose`
  - Características:
    - Reproduce video en HD automáticamente
    - Previene scroll del body
    - Pausar al cerrar
    - Muestra información del video
    - Link a Pexels

### Páginas
- **`src/pages/HomePage.tsx`** - Actualizada para cargar videos de Pexels
  - Busca "meditation relaxation"
  - Grid responsive (1-4 columnas según pantalla)
  - Estados: loading, error, videos
  - Abre modal al hacer clic en video

## 🎨 Funcionalidades Implementadas

### VideoCard
✅ Muestra imagen de preview del video
✅ Nombre del autor del video
✅ Duración del video
✅ Placeholder para likes (conectar con backend)
✅ Hover effect (escala)
✅ Click handler para abrir modal

### VideoPlayerModal
✅ Reproduce video en calidad HD
✅ Controles nativos del navegador
✅ Autoplay al abrir
✅ Información del video (duración, dimensiones)
✅ Link a Pexels
✅ Cierre con botón X o click fuera

### HomePage
✅ Carga videos automáticamente
✅ Grid responsive
✅ Estado de loading
✅ Manejo de errores con botón de reintentar
✅ Integración con VideoPlayerModal

## 🚀 Próximos Pasos

### 1. Configurar API Key
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega tu API key de Pexels
```

### 2. Personalización de Búsqueda

Puedes cambiar la query de búsqueda en `HomePage.tsx`:

```typescript
// Línea ~24
const response = await pexelsService.searchVideos("meditation relaxation", 1, 12);

// Cambia por lo que quieras buscar:
const response = await pexelsService.searchVideos("nature", 1, 12);
const response = await pexelsService.searchVideos("yoga", 1, 12);
```

### 3. Integración con Backend (Opcional)

Para guardar videos favoritos, necesitarás:

1. Crear endpoint en backend: `POST /api/users/:userId/favorites`
2. Agregar servicio en frontend: `src/services/favorites.service.ts`
3. Actualizar VideoCard con botón de like funcional
4. Crear página de favoritos: `src/pages/LikedPage.tsx`

### 4. Paginación

Implementar botones de "Cargar más" o paginación:

```typescript
const [page, setPage] = useState(1);

const loadMoreVideos = async () => {
  const response = await pexelsService.searchVideos("meditation", page + 1, 12);
  setVideos([...videos, ...response.videos]);
  setPage(page + 1);
};
```

## 📖 Documentación de Pexels API

- **Documentación oficial:** https://www.pexels.com/api/documentation/?language=javascript#videos
- **Rate limits:** 200 requests por hora (plan gratuito)
- **Atribución:** Se recomienda dar crédito al autor (ya implementado en modal)

## 🔍 Endpoints Disponibles

```typescript
// Buscar videos
pexelsService.searchVideos("query", page, perPage)

// Videos populares
pexelsService.getPopularVideos(page, perPage)

// Video específico
pexelsService.getVideoById(2499611)

// URLs de video
pexelsService.getVideoHDUrl(video)
pexelsService.getVideoSDUrl(video)
```

## ⚠️ Notas Importantes

1. **API Key requerida:** La aplicación no funcionará sin una API key válida de Pexels
2. **Rate limits:** Ten cuidado con el número de requests (200/hora gratis)
3. **CORS:** Pexels API soporta CORS, funciona desde el navegador
4. **Atribución:** Es buena práctica dar crédito a Pexels y a los autores de los videos

## 🐛 Troubleshooting

**Error: "Failed to fetch"**
- Verifica que tu API key esté correctamente configurada en `.env`
- Revisa que el servidor esté reiniciado después de agregar la API key

**No se muestran videos**
- Abre la consola del navegador (F12)
- Verifica si hay errores de red
- Comprueba que la API key sea válida

**Videos no se reproducen**
- Algunos navegadores bloquean autoplay con sonido
- El usuario puede necesitar interactuar primero con la página
