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

/// Rutas ///
router.get('/tasks', getAllTasks);
router.get('/tasks/search', searchTask);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

//////////////////////////////////////////////
export default router;