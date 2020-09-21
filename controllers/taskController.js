const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.createTask = async (req, res) => {

    // Revisar si hay errores
    const error = validationResult(req);
    if( !error.isEmpty() ) {
        return res.status(400).json({error: error.array() })
    }
    

    try {

        // Extraer el proyecto y comprobar si existe
        const { project } = req.body;

        const projectExists = await Project.findById(project);
        if(!projectExists) {
            return res.status(404).json({msg: 'Project not found'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExists.creator.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Not authorized'});
        }

        // Creamos la tarea
        const task = new Task(req.body);
        await task.save();
        res.json({ task });
    
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred')
    }

}

// Obtiene las tareas por proyecto
exports.getTask = async (req, res) => {

        try {
            // Extraer el proyecto y comprobar si existe
            const { project } = req.query;


            const projectExists = await Project.findById(project);
            if(!projectExists) {
                return res.status(404).json({msg: 'Project not found'})
            }

            // Revisar si el proyecto actual pertenece al usuario autenticado
            if(projectExists.creator.toString() !== req.user.id ) {
                return res.status(401).json({msg: 'Not authorized'});
            }

            // Obtener las tareas por proyecto
            const task = await Task.find({ project }).sort({ created: -1 });
            res.json({ task });

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
}

// Actualizar una tarea
exports.updateTask = async (req, res ) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { project, name, state } = req.body;


        // Si la tarea existe o no
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({msg: 'There is no such task'});
        }

        // extraer proyecto
        const projectExists = await Project.findById(project);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExists.creator.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Not authorized'});
        }
        // Crear un objeto con la nueva información
        const newTask = {};
        newTask.name = name;
        newTask.state = state;

        // Guardar la tarea
        task = await Task.findOneAndUpdate({_id : req.params.id }, newTask, { new: true } );

        res.json({ task });

    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred')
    }
}


// Elimina una tarea
exports.deleteTask = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { project  } = req.query;

        // Si la tarea existe o no
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({msg: 'There is no such task'});
        }

        // extraer proyecto
        const projectExists = await Project.findById(project);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExists.creator.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Not authorized'});
        }

        // Eliminar
        await Task.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Task deleted'})

    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred')
    }
}