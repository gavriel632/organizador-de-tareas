import { Router } from "express"; // Desestructuramos Router de Expres para utilizarlo

const router = Router(); // Es una instancia del Router

//////////////////////////////////////////////
import {
    getAllHabits,
    getHabitById,
    searchHabit,
    createHabit,
    updateHabit,
    deleteHabit
} from "../controllers/habits.controller.js"

//////////////////////////////////////////////

/// Rutas ///
router.get('/habits', getAllHabits);
router.get('/habits/search', searchHabit);
router.get('/habits/:id', getHabitById);
router.post('/habits', createHabit);
router.put('/habits/:id', updateHabit);
router.delete('/habits/:id', deleteHabit);

//////////////////////////////////////////////
export default router;