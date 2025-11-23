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

/// Rutas GET ///
router.get('/subtasks', getAllSubtasks);
router.get('/subtasks/search', searchSubtask);
router.get('/subtasks/:id', getSubtaskById);

//////////////////////////////////////////////
/// Rutas POST ///
router.post('/subtasks', createSubtask);

//////////////////////////////////////////////
/// Rutas PUT ///

router.put('/subtasks/:id', updateSubtask);

//////////////////////////////////////////////
/// Rutas DELETE ///

router.delete('/subtasks/:id', deleteSubtask);

//////////////////////////////////////////////
export default router;