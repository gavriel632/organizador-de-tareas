// Importa todas las funciones del modelo de usuario (users.model.js) para interactuar con Firestore.
import * as model from '../models/users.model.js';

////////////////////////////////////////////////////
// 👤 OBTENER TODOS LOS USUARIOS (GET /users)
////////////////////////////////////////////////////
// Función controladora para obtener una lista de todos los usuarios.
export const getAllUsers = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los documentos de usuario.
        const users = await model.getAllUsers();
        // Responde con un código 200 (OK) y el array de usuarios.
        res.json(users);
    } catch (error) {
        // Manejo de errores 500 (Internal Server Error), enviando el mensaje de la excepción.
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
// 🔍 BUSCAR USUARIOS POR NOMBRE (GET /users/search?nombre=...)
////////////////////////////////////////////////////
// Función controladora para buscar usuarios por coincidencia parcial en el nombre.
export const searchUser = async (req, res) => {
    try {
        // Obtiene el parámetro de consulta 'nombre'.
        const { nombre } = req.query;
        // Obtiene todos los usuarios para filtrar en el servidor.
        const users = await model.getAllUsers();

        // Filtra los usuarios en memoria.
        const filteredUsers = users.filter(user =>
            // Implementación robusta: asegura que el campo 'nombre' exista y filtra insensiblemente a mayúsculas/minúsculas.
            (user.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        // Responde con el subconjunto filtrado.
        res.json(filteredUsers);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
// 📌 OBTENER USUARIO POR ID (GET /users/:id)
////////////////////////////////////////////////////
// Función controladora para obtener un usuario específico por su ID.
export const getUserById = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Llama al modelo para buscar el usuario.
        const user = await model.getUserById(id);

        // Si el usuario no se encuentra.
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Responde con el objeto usuario.
        res.json(user);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
// ➕ CREAR USUARIO (POST /users)
////////////////////////////////////////////////////
// Función controladora para manejar la creación de un nuevo usuario.
export const createUser = async (req, res) => {
    try {
        // Desestructura los campos necesarios del cuerpo de la solicitud.
        const { nombre, email, password } = req.body;

        // Validación de datos obligatorios.
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "Nombre, email y password son campos obligatorios." });
        }

        // Llama al modelo para crear el usuario. El modelo se encarga de hashear la contraseña.
        const newUser = await model.createUser({ nombre, email, password });

        // Responde con un código 201 (Created) y el objeto del nuevo usuario.
        res.status(201).json(newUser);
    } catch (error) {
        // Se utiliza 400 (Bad Request) aquí porque los errores del modelo suelen ser de validación (ej. email duplicado).
        res.status(400).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
// ✏️ ACTUALIZAR USUARIO (PUT/PATCH /users/:id)
////////////////////////////////////////////////////
// Función controladora para actualizar la información de un usuario existente.
export const updateUser = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Obtiene los datos a actualizar del cuerpo.
        const userData = req.body;

        // Llama al modelo para actualizar el usuario.
        const updated = await model.updateUser(id, userData);

        // Si el usuario no se encuentra.
        if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Responde con el objeto usuario actualizado.
        res.json(updated);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////
// 🗑️ ELIMINAR USUARIO (DELETE /users/:id)
////////////////////////////////////////////////////
// Función controladora para eliminar un usuario.
export const deleteUser = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;

        // Llama al modelo para eliminar el usuario.
        const result = await model.deleteUser(id);

        // Si la eliminación falló (ej. usuario no encontrado).
        if (!result.deleted) {
            // Retorna un error 404 basado en el mensaje retornado por el modelo.
            return res.status(404).json({ error: result.message });
        }

        // Responde con un código 204 (No Content), indicando éxito sin retornar cuerpo.
        res.status(204).send();
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: error.message });
    }
};