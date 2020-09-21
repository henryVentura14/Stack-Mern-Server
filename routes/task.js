const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// crear una tarea
// api/tareas
router.post('/', 
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('project', 'The Project is mandatory').not().isEmpty()
    ],
    taskController.createTask
);

// Obtener las tareas por proyecto
router.get('/',
    auth,
    taskController.getTask
);

// Actualizar tarea
router.put('/:id', 
    auth,
    taskController.updateTask
);

// Eliminar tarea
router.delete('/:id', 
    auth,
    taskController.deleteTask
);

module.exports = router;