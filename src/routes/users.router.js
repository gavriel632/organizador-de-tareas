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

import { validarToken } from "../middleware/auth.middleware.js";

//////////////////////////////////////////////


/// Rutas GET ///
router.get('/users', validarToken, getAllUsers);
router.get('/users/search', validarToken, searchUser);
router.get('/users/:id', validarToken, getUserById);

//////////////////////////////////////////////
/// Rutas POST ///
router.post('/users', createUser);

//////////////////////////////////////////////
/// Rutas PUT ///

router.put('/users/:id',validarToken, updateUser);

//////////////////////////////////////////////
/// Rutas DELETE ///

router.delete('/users/:id',validarToken, deleteUser);

//////////////////////////////////////////////
export default router;