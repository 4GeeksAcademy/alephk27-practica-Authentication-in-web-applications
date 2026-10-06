# Plan técnico de frontend

## Objetivo y alcance

- Aplicación en TypeScript, Next.js con Pages Router (sin directorio `src`) y Tailwind CSS.
- Diseño responsive mobile-first.
- Consumir el backend FastAPI existente; la autenticación es la prioridad.
- No implementar ni simular permisos de administrador: el API actual no expone roles y sus rutas de libros no requieren autenticación. La página `/` será el inicio de la biblioteca, sin controles exclusivos de administrador.

## Estructura de archivos

```text
frontend/
    pages/
        _app.tsx                 # Importa estilos y monta AuthProvider
        index.tsx                # Inicio de la biblioteca
        books.tsx                # Lista de libros; requiere sesión en la interfaz
        login.tsx                # Inicio de sesión
        signup.tsx               # Registro
        profile.tsx              # Consulta y edición del perfil; requiere sesión
    components/
        AppLayout.tsx            # Estructura compartida y navegación
        AuthNavigation.tsx       # Enlaces condicionados por estado de sesión
        LoginForm.tsx
        SignupForm.tsx
        ProfileForm.tsx
        BookList.tsx
    context/
        AuthContext.tsx           # Usuario actual, token y acciones de sesión
    hooks/
        useAuth.ts                # Acceso tipado al contexto de autenticación
        useRequireAuth.ts          # Protección de páginas privadas en cliente
    lib/
        api.ts                    # fetchApi, URL base, Bearer y errores HTTP
        auth-token.ts              # Lectura, escritura y eliminación de localStorage
        services/
            auth.ts                  # Login y consulta de usuario actual
            users.ts                 # Registro
            profile.ts               # Lectura y actualización de perfil
            books.ts                 # Lectura de libros
    types/
        api.ts                     # Tipos de respuestas y errores comunes
        auth.ts                    # Token, usuario actual y credenciales
        profile.ts                 # Perfil y datos de actualización
        book.ts                    # Libro y enums del backend
    styles/
        globals.css                # Tailwind y estilos globales
    .env.example                 # URL del proxy y URL del backend
    next.config.js
    postcss.config.js
    tsconfig.json
    package.json
```

Mantener los servicios y tipos alineados con los modelos Pydantic existentes; no duplicar lógica HTTP en páginas o componentes.

## Rutas y comportamiento

- `/`: inicio de biblioteca. No mostrar ni asumir herramientas de administrador.
- `/books`: lista de libros; solicitar autenticación en la interfaz según el alcance original.
- `/login`: formulario de acceso con email y contraseña; tras autenticar, redirigir a `/profile`.
- `/signup`: formulario de registro con username, email y contraseña. El backend crea un perfil inicial con el username; no iniciar sesión automáticamente porque el endpoint no entrega token.
- `/profile`: consultar el perfil y permitir editarlo con `PUT /profile/me`; requiere sesión.

La navegación compartida muestra inicio y libros, ofrece login/registro sin sesión, y perfil/cerrar sesión con sesión. El cierre de sesión elimina el token y redirige a `/`.

## Contrato del backend

- `POST /auth/login`: JSON `{ "email": "...", "password": "..." }`; responde `{ "access_token": "...", "token_type": "bearer" }`.
- `GET /auth/me`: requiere `Authorization: Bearer <token>`; responde email y perfil.
- `POST /users`: registro con username, email y contraseña; responde usuario, no token. Errores relevantes: `409` para username/email ya registrados y `422` para validación.
- `GET /profile/me` y `PUT /profile/me`: requieren Bearer. La actualización acepta `full_name`, `phone` y `address`; bio no es editable con el modelo actual.
- `GET /books` y `GET /books/{book_id}`: lectura de libros. No requieren token en el backend actual.
- El backend no incluye rol en usuario/token ni endpoints de autorización por rol. No usar un rol inferido desde el cliente como control de acceso.

## Autenticación y sesión

1. El login valida el formulario y llama `POST /auth/login` como JSON.
2. Guardar `access_token` en `localStorage` y usar el esquema Bearer en cada petición protegida.
3. Al inicializar la aplicación en cliente, recuperar el token y validar la sesión con `GET /auth/me`; mantener estado de carga hasta completar la comprobación para evitar parpadeos de navegación.
4. `useRequireAuth` espera la comprobación inicial; sin sesión o ante `401`, eliminar el token y redirigir a `/login`. No borrar la sesión por errores de red o respuestas `5xx`.
5. Logout elimina el token local y vuelve a `/`.

`localStorage` se conserva como decisión del alcance, con el riesgo conocido de exposición del token ante XSS. El JWT del backend expira en 30 minutos por defecto y no existe endpoint de refresh; ante `401` se requiere iniciar sesión de nuevo.

## Validación y manejo de errores

- Aplicar validación en cliente y respetar los límites del backend: username de 1 a 50 caracteres, email de 3 a 254, contraseña de al menos 8 en registro, `full_name` de 1 a 100, teléfono hasta 30 y dirección hasta 250.
- En login, la contraseña acepta como mínimo un carácter, según el modelo de entrada del backend.
- La capa `fetchApi` establece `Content-Type: application/json` en peticiones con body, añade el Bearer cuando exista token, gestiona respuestas sin body (`204`) y convierte errores HTTP en mensajes utilizables por los formularios.
- Mostrar errores de validación/autenticación junto al formulario; conservar mensajes de error de red diferenciados de `401`.

## Configuración e integración

- El navegador consume `NEXT_PUBLIC_API_URL=/api`; Next.js reescribe `/api/*` hacia `BACKEND_API_URL`, evitando depender de CORS o exponer el origen backend al cliente.
- `BACKEND_API_URL` apunta por defecto a `http://127.0.0.1:3000`; configurarlo por entorno al desplegar. No incluir secretos del backend en el frontend.
- Ejecutar Next.js en `3001`: el `server.py` existente ya ocupa el puerto `3000` para FastAPI.
- La protección de `/books` y `/profile` en este plan es de navegación/interfaz. Solo `/profile` y `/auth/me` están protegidas actualmente por el servidor; `GET /books` sigue siendo público.

## Secuencia de trabajo propuesta

1. Preparar Next.js, TypeScript, Tailwind y configuración de URL de API.
2. Definir tipos y `fetchApi`; conectar y comprobar los contratos de auth.
3. Implementar persistencia, `AuthContext`, validación de sesión y protección de rutas.
4. Construir login, registro, navegación y perfil; verificar estados de carga, error, sesión expirada y logout.
5. Construir el inicio y la lista de libros conectados al API; comprobar diseño mobile-first.

Este documento es el plan de trabajo; no implica ejecutar ni crear la aplicación frontend.
