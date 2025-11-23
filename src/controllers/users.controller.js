import * as model from '../models/users.model.js';

////////////////////////////////////////////////////
export const getAllUsers = async (req, res) => {
    try {
        const users = await model.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
export const searchUser = async (req, res) => {
    try {
        const { nombre } = req.query;
        const users = await model.getAllUsers();

        const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(nombre.toLowerCase())
        );

        res.json(filteredUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await model.getUserById(id);

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
export const createUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const newUser = await model.createUser({ nombre, email, password });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        const updated = await model.updateUser(id, userData);

        if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await model.deleteUser(id);

        if (!result.deleted) {
        return res.status(404).json({ error: result.message });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
