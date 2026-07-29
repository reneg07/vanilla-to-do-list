# Diagnóstico inicial de Code Smells

## Objetivo

Identificar problemas de diseño, mantenibilidad y legibilidad en la aplicación
antes de iniciar la refactorización mediante principios SOLID y prácticas de
Clean Code.

La funcionalidad original fue probada antes de realizar modificaciones y
funciona correctamente.

## 1. Archivo con demasiadas responsabilidades

El archivo `src/main.js` concentra diferentes responsabilidades:

- Administración del estado de las tareas.
- Lectura y escritura en `localStorage`.
- Validación de datos.
- Manipulación del DOM.
- Manejo de eventos.
- Filtrado de tareas.
- Cálculo de estadísticas.
- Renderizado de la interfaz.

### Problema

El archivo tiene múltiples razones para cambiar, lo cual dificulta su
mantenimiento y viola el principio de responsabilidad única, SRP.

### Mejora propuesta

Separar las responsabilidades en módulos especializados:

- Entidad Task.
- Servicio de tareas.
- Repositorio de almacenamiento.
- Vista.
- Controlador.
- Estrategias de filtrado.

---

## 2. Estado global mutable

La aplicación utiliza variables globales para controlar el estado:

```javascript
let tasks = [];
let taskId = 1;
let currentFilter = 'all';