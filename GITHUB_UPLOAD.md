# Guía para subir el proyecto a GitHub

## Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com
2. Haz clic en "New repository"
3. Nombre: `ants-simulation`
4. Descripción: `A real-time simulation of ants and ant eaters behavior`
5. Público o Privado (tu elección)
6. NO inicialices con README (ya tenemos uno)
7. Haz clic en "Create repository"

## Paso 2: Conectar repositorio local con GitHub
Ejecuta estos comandos en la terminal desde la carpeta del proyecto:

```bash
# Agregar el origen remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/ants-simulation.git

# Cambiar nombre de rama principal a main (estándar de GitHub)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

## Paso 3: Verificar que se subió correctamente
1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. El README.md debería mostrarse automáticamente

## Comandos completos (copia y pega, reemplazando TU_USUARIO):

```bash
cd "C:\Users\kevoe\Desktop\ANTS\ants-simulation"
git remote add origin https://github.com/TU_USUARIO/ants-simulation.git
git branch -M main
git push -u origin main
```

## ¡Listo!
Tu proyecto ya estará en GitHub y podrás:
- Compartir el enlace con otros
- Conectarlo con Render para el despliegue
- Colaborar con otros desarrolladores
- Hacer seguimiento de cambios
