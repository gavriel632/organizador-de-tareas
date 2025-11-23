import "dotenv/config";

// import dotenv from 'dotenv';

// 1. Cargar variables de entorno al inicio
// dotenv.config()

import express from "express";
const app = express();

import cors from "cors";
////////////////////////////////////////////////////
// MIDDLEWARE DE EXPRESS

app.use(cors());
// para parsear JSON //
app.use(express.json()); // Nos permite recibir y enviar objetos JSON

////////////////////////////////////////////////////
/// IMPORTAR RUTAS ///
import tasksRouter from './src/routes/tasks.router.js'; // importar tasks.router.js y lo llamo tasksRouter
app.use('/api', tasksRouter); // Le digo a la aplicacion que use ese tasksRouter pero antes le pongo un prefijo

import remindersRouter from './src/routes/reminders.router.js';
app.use('/api', remindersRouter);

import categoriesRouter from './src/routes/categories.router.js';
app.use('/api', categoriesRouter);

import subtasksRouter from './src/routes/subtasks.router.js';
app.use('/api', subtasksRouter);

import habitsRouter from './src/routes/habits.router.js';
app.use('/api', habitsRouter);


////////////////////////////////////////////////////
import usersRouter from './src/routes/users.router.js';
app.use('/api', usersRouter);

import authRouter from "./src/routes/auth.router.js";
app.use('/api/auth', authRouter);

////////////////////////////////////////////////////



/// Rutas GET - RAIZ ///

app.get('/', (req, res)=>{
    res.json({mensaje:'¡API REST en Node.js funcionando correctamente desde la URL: / !!!'});
});


////////////////////////////////////////////////////

/// MIDDLEWARE ///

app.use((req, res, next)=>{
    // Middleware para menejar rutas no difinidas (404).
    // Sirve para cualquier metodo.
    // Next, no lo voy a usar, pero en necesario ponerlo.

    res.status(404).json({error: "MIDDLE: Ruta no encontrada"})
});


////////////////////////////////////////////////////


const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
    console.log(`Servidor escuchando el puerto http://localhost:${PORT}`);
});