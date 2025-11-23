import { Router } from "express"; // Desestructuramos Router de Expres para utilizarlo

const router = Router(); // Es una instancia del Router

//////////////////////////////////////////////
import {
    getAllReminders,
    getReminderById,
    searchReminder,
    createReminder,
    updateReminder,
    deleteReminder
} from "../controllers/reminders.controller.js"

//////////////////////////////////////////////

/// Rutas GET ///
router.get('/reminders', getAllReminders);
router.get('/reminders/search', searchReminder);
router.get('/reminders/:id', getReminderById);

//////////////////////////////////////////////
/// Rutas POST ///
router.post('/reminders', createReminder);

//////////////////////////////////////////////
/// Rutas PUT ///
router.put('/reminders/:id', updateReminder);

//////////////////////////////////////////////
/// Rutas DELETE ///
router.delete('/reminders/:id', deleteReminder);

//////////////////////////////////////////////
export default router;