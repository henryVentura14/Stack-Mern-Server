const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    // revisar si hay errores
    const error = validationResult(req);
    if( !error.isEmpty() ) {
        return res.status(400).json({error: error.array() })
    }

    // extraer email y password
    const { email, password } = req.body;


    try {
        // Revisar que el user registrado sea unico
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // crea el nuevo user
        user = new User(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt );

        // guardar user
        await user.save();

        // Crear y firmar el JWT
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
        res.status(400).send('An error occurred');
    }
}