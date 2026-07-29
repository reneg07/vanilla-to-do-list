# Vanilla To-Do List — Refactorización SOLID y Clean Code

Refactorización del proyecto académico `Kodigo-academic/vanilla-to-do-list` manteniendo la funcionalidad original de la aplicación.

## Funcionalidades conservadas

- Agregar tareas mediante el botón **Agregar**.
- Agregar tareas presionando **Enter**.
- Validar tareas vacías.
- Completar y reactivar tareas.
- Eliminar tareas.
- Filtrar todas, activas y completadas.
- Mostrar estadísticas.
- Persistir las tareas en `localStorage`.

## Instalación

```bash
npm install
npm run dev
```

Para comprobar la compilación:

```bash
npm run build
```

## Estructura

```text
src/
├── application/
│   ├── filters/
│   │   └── TaskFilterRegistry.js
│   └── services/
│       └── TaskService.js
├── domain/
│   ├── errors/
│   │   ├── StorageError.js
│   │   ├── TaskNotFoundError.js
│   │   └── TaskValidationError.js
│   ├── repositories/
│   │   └── TaskRepository.js
│   └── Task.js
├── infrastructure/
│   └── storage/
│       └── LocalStorageTaskRepository.js
├── presentation/
│   ├── TaskController.js
│   └── TaskView.js
├── shared/
│   └── constants.js
├── main.js
└── style.css
```

## Principios SOLID aplicados

### SRP — Single Responsibility Principle

Cada componente posee una responsabilidad principal:

- `Task`: reglas y representación de una tarea.
- `TaskService`: casos de uso y estado de las tareas.
- `LocalStorageTaskRepository`: persistencia.
- `TaskView`: renderizado y eventos del DOM.
- `TaskController`: coordinación entre vista y servicio.
- `TaskFilterRegistry`: estrategias de filtrado.

### OCP — Open/Closed Principle

Los filtros se gestionan mediante estrategias. Es posible inyectar filtros nuevos al `TaskFilterRegistry` sin modificar `TaskService` ni `TaskController`.

### LSP — Liskov Substitution Principle

`LocalStorageTaskRepository` implementa el contrato `TaskRepository`. Puede sustituirse por otro repositorio compatible, por ejemplo uno en memoria o conectado a una API, sin modificar el servicio.

### ISP — Interface Segregation Principle

El contrato de persistencia solo expone las operaciones que el servicio necesita: `findAll` y `saveAll`. No mezcla responsabilidades de interfaz, validación o presentación.

### DIP — Dependency Inversion Principle

`TaskService` recibe el repositorio y el registro de filtros mediante su constructor. No crea implementaciones concretas internamente. Las dependencias se ensamblan en `main.js`.

## Clean Code aplicado

- Nombres descriptivos.
- Funciones pequeñas y enfocadas.
- Eliminación de duplicación.
- Comparaciones estrictas.
- Validación centralizada.
- Manejo específico de errores.
- Estado encapsulado.
- Uso seguro de `textContent` en lugar de insertar texto del usuario con `innerHTML`.
- Delegación de eventos para las acciones de tareas.
- Formato consistente.

## Compatibilidad de datos

Se conserva la clave `tasks` de `localStorage` y la misma estructura de datos (`id`, `text`, `completed`, `createdAt`), por lo que las tareas existentes siguen siendo utilizables.
