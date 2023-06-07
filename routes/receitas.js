const express = require('express');
const { createReceita, updateReceita, deleteReceita, viewById } = require('../database/receitas');
const auth = require('../middleware/auth');
const z = require('zod');
const router = express.Router();

const regex = /^\d(\.\d)?$/;
const ReceitaSchema = z.object({
    name: z.string({
        required_error: 'Name must be required',
        invalid_type_error: 'Name must be a string',
    }),
    description: z.string().min(3),
    tempPreparo: z.string(),
})

router.get('/view/receitas', auth, async (req, res) => {
    try {
        const receitas = await viewById(req.idUser);
        res.json({
            data: receitas,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({ message: "Server error" });
    }
})

router.post('/create/receitas', auth, async (req, res) => {
    try {
        const newReceita = ReceitaSchema.parse(req.body);
        const user = req.idUser;
        const savedReceita = await createReceita(newReceita, user);
        res.status(201).json({
            data: savedReceita,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({ message: "Server error" });
    }
})

router.put('/update/receitas/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const receitas = ReceitaSchema.parse(req.body);
        const receitaUpdated = await updateReceita(id, receitas, req.idUser);
        res.json({
            data: receitaUpdated,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        } else if (error.message === "You not authorized to update this") {
            return res.status(401).json({
                message: error.message,
            });
        }
        res.status(500).json({ message: "Server error" });
    }

})

router.delete('/delete/receitas/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        await deleteReceita(id, req.idUser);
        res.status(204).send('Receita deletada com sucesso');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        } else if (error.message === "You not authorized to update this") {
            return res.status(401).json({
                message: error.message,
            });
        }
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = { router, };