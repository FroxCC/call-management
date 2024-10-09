# Proyecto Call Management

Este documento te guiará a través de la configuración e instalación del entorno de desarrollo para el proyecto XYZ. A continuación, se detallan los pasos para instalar las herramientas necesarias y poner en funcionamiento el proyecto.

## Prerrequisitos

Antes de comenzar, asegúrate de tener las siguientes herramientas instaladas:

### 1. Node.js (versión LTS)
- Descarga la versión LTS de Node.js desde su [página oficial](https://nodejs.org/).
- Siga las instrucciones de instalación correspondientes a su sistema operativo.

### 2. Docker Desktop
- Descarga Docker Desktop desde su [página oficial](https://www.docker.com/products/docker-desktop/).
- Instala Docker Desktop y verifica que esté funcionando correctamente después de la instalación.

### 3. Git
- Descarga Git desde su [página oficial](https://git-scm.com/downloads).
- Siga las instrucciones de instalación y configura Git en tu terminal para poder clonar repositorios.

### 4. Visual Studio Code (VSCode)
- Descarga VSCode desde su [página oficial](https://code.visualstudio.com/).
- Instala VSCode y considera añadir las extensiones recomendadas para facilitar el desarrollo.

## Pasos para iniciar el proyecto

Sigue estos pasos para configurar y levantar el entorno de desarrollo:

### 1. Clonar el proyecto
Abre una terminal y navega a la carpeta donde deseas clonar el proyecto. Luego, ejecuta el siguiente comando:


git clone <URL_DEL_REPOSITORIO>
### 2. Navegar al directorio del proyecto
Una vez clonado el proyecto, accede al directorio del proyecto con el siguiente comando:

Copiar código

```cd <NOMBRE_DEL_PROYECTO>```

### 3. Instalar las dependencias
Dentro del directorio del proyecto, instala las dependencias necesarias ejecutando:

Copiar código
```npm install```
### 4. Verificar Docker Desktop
Asegúrate de que Docker Desktop esté abierto y funcionando. Esto es necesario para levantar la base de datos.

### 5. Levantar la Base de Datos
En la raíz del proyecto, monta la base de datos usando Docker Compose:

```docker compose up -d```

Esto levantará los contenedores necesarios en segundo plano.

### 6. Generar el esquema de la base de datos
Una vez que la base de datos esté lista, genera las tablas y relaciones con Prisma ejecutando:

```npx prisma generate```

### 7. Ejecutar el proyecto en modo desarrollo
Finalmente, levanta el entorno de desarrollo ejecutando:

```npm run dev```

Esto iniciará el servidor y podrás acceder a la aplicación en el navegador en la dirección indicada (normalmente http://localhost:3000).

Notas adicionales
Asegúrate de tener Docker Desktop abierto y en ejecución antes de levantar la base de datos.
Si hay cambios en el esquema de la base de datos, asegúrate de correr nuevamente npx prisma generate para mantener la sincronización.
Puedes configurar variables de entorno si tu proyecto lo requiere, asegurándote de seguir el formato en .env.example si está disponible.