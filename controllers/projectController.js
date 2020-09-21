const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {

    // Revisar si hay error
    const error = validationResult(req);
    if( !error.isEmpty() ) {
        return res.status(400).json({error: error.array() })
    }


    try {
        // Crear un nuevo proyecto
        const project = new Project(req.body);

        // Guardar el creator via JWT
        project.creator = req.user.id;

        // guardamos el proyecto
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
}

// Obtiene todos los proyectos del user actual
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.user.id }).sort({ created: -1 });
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
}

// Actualiza un proyecto
exports.updateProject = async (req, res) => {

    // Revisar si hay error
    const error = validationResult(req);
    if( !error.isEmpty() ) {
        return res.status(400).json({error: error.array() })
    }

    // extraer la información del proyecto
    const { name } = req.body;
    const newProject = {};
    
    if(name) {
        newProject.name = name;
    }

    try {

        // revisar el ID 
        let project = await Project.findById(req.params.id);

        // si el project existe o no
        if(!project) {
            return res.status(404).json({msg: 'Project no encontrado'})
        }

        // verificar el creator del proyecto
        if(project.creator.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Not authorized'});
        }

        // actualizar
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set : newProject}, { new: true });

        res.json({project});

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
}

// Elimina un proyecto por su id
exports.deleteProject = async (req, res ) => {
    try {
        // revisar el ID 
        let project = await Project.findById(req.params.id);

        // si el proyecto existe o no
        if(!project) {
            return res.status(404).json({msg: 'Project no encontrado'})
        }

        // verificar el creador del proyecto
        if(project.creator.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Not authorized'});
        }

        // Eliminar el Proyecto
        await Project.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: 'Project deleted '})

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
}
