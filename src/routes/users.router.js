import { Router } from "express";
const router = Router();

//////////////////////////////////////////////
import {
    getAllUsers,
    getUserById,
    searchUser,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/users.controller.js";


//////////////////////////////////////////////
// 🔐 MIDDLEWARE DE AUTENTICACIÓN
import { validarToken } from "../middleware/auth.middleware.js";

//////////////////////////////////////////////

/// Rutas protegidas con JWT (solo si el usuario está logueado) ///
router.get('/users', validarToken, getAllUsers);
router.get('/users/search', validarToken, searchUser);
router.get('/users/:id', validarToken, getUserById);
router.put('/users/:id',validarToken, updateUser);
router.delete('/users/:id',validarToken, deleteUser);

//////////////////////////////////////////////
/// Rutas NO protegidas con JWT  ///
router.post('/users', createUser);


//////////////////////////////////////////////
export default router;