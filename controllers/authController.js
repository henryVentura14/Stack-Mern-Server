const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
    // revisar si hay errores
    const error = validationResult(req);
    if( !error.isEmpty() ) {
        return res.status(400).json({error: error.array() })
    }

    // extraer el email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({msg: 'Username does not exist'});
        }

        // Revisar el password
        const passOk = await bcryptjs.compare(password, user.password);
        if(!passOk) {
            return res.status(400).json({msg: 'incorrect password ' })
        }

        // Si todo es correcto Crear y firmar el JWT
         const payload = {
            user: {
                id: user.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRET_WORD, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmación
            res.json({ token  });
        });

    } catch (error) {
        console.log(error);
    }
}


// Obtiene que usuario esta autenticado
exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'There was a mistake'});
    }
}