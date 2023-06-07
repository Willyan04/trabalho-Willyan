const express = require('express');
const { createUser, findByEmail, findById } = require('../database/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const z = require('zod');
const router = express.Router();

const userValidInfo = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
})
const loginValidInfo = z.object({
    email: z.string().email(),
    password: z.string(),
})

router.post('/register/user', async (req, res) => {
    try {
        const user = userValidInfo.parse(req.body);
        const isEmailUsed = await findByEmail(user.email);
        if (isEmailUsed) {
            return res.status(400).json({ message: 'Email already in used' });
        }
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        user.password = hashedPassword;
        const createdUser = await createUser(user);
        delete createdUser.password;
        res.status(201).json({
            user: createdUser,
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({
                message: err.errors,
            });
        }
        res.status(500).json({
            message: 'Server error',
        });
    }

});

router.post('/login', async (req, res) => {
    try {
        const infoLogin = loginValidInfo.parse(req.body);
        const user = await findByEmail(infoLogin.email);
        if (!user) return res.status(401).send();
        const validPassword = bcrypt.compare(infoLogin.password, user.password);
        if (!validPassword) return res.status(401).send();
        const token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.SECRET,
        );
        res.status(200).json({
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: 'Server error',
        });
    }

});

module.exports = { router };