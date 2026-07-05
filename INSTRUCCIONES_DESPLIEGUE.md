# Instrucciones para Despliegue Automático en Vercel

## Paso 1: Configurar Secrets en GitHub

Necesitas agregar los siguientes secrets en tu repositorio de GitHub:

1. Ve a tu repositorio en GitHub
2. Click en **Settings** > **Secrets and variables** > **Actions**
3. Click en **New repository secret** y agrega:

### Secretos necesarios:

1. **VERCEL_TOKEN**
   - Ve a [Vercel Account Settings](https://vercel.com/account/tokens)
   - Crea un nuevo token con el nombre "GitHub Actions"
   - Copia el token y pégalo como valor del secret

2. **VERCEL_ORG_ID**
   - Ve a tu proyecto en Vercel
   - Click en **Settings** > **General**
   - Copia el "Project ID" (esto es tu VERCEL_PROJECT_ID)
   - Para obtener el ORG_ID, ve a [Vercel](https://vercel.com/account/settings) y copia el ID de tu organización

3. **VERCEL_PROJECT_ID**
   - Ve a tu proyecto en Vercel
   - Click en **Settings** > **General**
   - Copia el "Project ID"

## Paso 2: Configurar Vercel para GitHub Integration

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Git**
4. Asegúrate de que esté conectado a tu repositorio de GitHub
5. Configura:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

## Paso 3: Hacer commit y push de los cambios

```bash
git add .
git commit -m "Configurar despliegue automático con GitHub Actions"
git push origin main
```

## Paso 4: Verificar el despliegue

1. Ve a la pestaña **Actions** en tu repositorio de GitHub
2. Verás el workflow "Deploy to Vercel" ejecutándose
3. Si todo está configurado correctamente, el despliegue será automático

## Cómo funciona ahora:

- Cada vez que hagas `git push` a la rama `main` o `master`, el workflow se ejecutará automáticamente
- El workflow construirá el proyecto y lo desplegará en Vercel
- Tu sitio web se actualizará automáticamente en https://vetcontrol360-web.vercel.app

## Solución de problemas:

Si el workflow falla:
1. Verifica que los secrets estén correctamente configurados
2. Asegúrate de que el token de Vercel tenga los permisos necesarios
3. Revisa los logs del workflow en GitHub Actions para ver el error específico
