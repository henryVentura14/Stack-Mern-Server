const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');


// Crea proyectos
// api/proyectos
router.post('/', 
    auth,
    [
        check('name', 'The project name is mandatory').not().isEmpty()
    ],
    projectController.createProject
);

// Obtener todos los proyectos
router.get('/', 
    auth,
    projectController.getProjects
)

// Actualizar proyecto via ID
router.put('/:id', 
    auth,
    [
        check('name', 'The project name is mandatory').not().isEmpty()
    ],
    projectController.updateProject
);

// Eliminar un Proyecto
router.delete('/:id', 
    auth,
    projectController.deleteProject
);

module.exports = router;