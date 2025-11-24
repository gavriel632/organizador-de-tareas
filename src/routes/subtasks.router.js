import { Router } from "express"; // Desestructuramos Router de Expres para utilizarlo

const router = Router(); // Es una instancia del Router

//////////////////////////////////////////////
import {
    getAllSubtasks,
    getSubtaskById,
    searchSubtask,
    createSubtask,
    updateSubtask,
    deleteSubtask
} from "../controllers/subtasks.controller.js"

//////////////////////////////////////////////

/// Rutas ///
router.get('/subtasks', getAllSubtasks);
router.get('/subtasks/search', searchSubtask);
router.get('/subtasks/:id', getSubtaskById);
router.post('/subtasks', createSubtask);
router.put('/subtasks/:id', updateSubtask);
router.delete('/subtasks/:id', deleteSubtask);

//////////////////////////////////////////////
export default router;