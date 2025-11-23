import { Router } from "express"; // Desestructuramos Router de Expres para utilizarlo

const router = Router(); // Es una instancia del Router

//////////////////////////////////////////////
import {
    getAllTasks,
    getTaskById,
    searchTask,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/tasks.controller.js"

//////////////////////////////////////////////

/// Rutas GET ///
router.get('/tasks', getAllTasks);
router.get('/tasks/search', searchTask);
router.get('/tasks/:id', getTaskById);

//////////////////////////////////////////////
/// Rutas POST ///
router.post('/tasks', createTask);

//////////////////////////////////////////////
/// Rutas PUT ///
router.put('/tasks/:id', updateTask);

//////////////////////////////////////////////
/// Rutas DELETE ///
router.delete('/tasks/:id', deleteTask);

//////////////////////////////////////////////
export default router;