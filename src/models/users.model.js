import { db } from "./data.js";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";

const usersCollection = collection(db, "users");

/* ====================
    OBTENER TODOS
==================== */
export const getAllUsers = async () => {
    try {
        const snapshot = await getDocs(usersCollection);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getAllUsers error:", error);
        return [];
    }
};

/* ====================
    BUSCAR POR ID
==================== */
export const getUserById = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error("getUserById error:", error);
        return null;
    }
};

/* ====================
    BUSCAR POR EMAIL
==================== */
export const getUserByEmail = async (email) => {
    try {
        const q = query(usersCollection, where("email", "==", email));
        const result = await getDocs(q);
        if (result.empty) return null;
        const userDoc = result.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        console.error("getUserByEmail error:", error);
        return null;
    }
};

/* ====================
    CREAR USUARIO
==================== */
export const createUser = async ({ nombre, email, password }) => {
    console.log("DATA RECIBIDA EN createUser:", { nombre, email, password });
    try {
        // Validación básica
        if (!nombre || !email || !password) {
        throw new Error("Nombre, email y contraseña son obligatorios");
        }

        // Validar email único
        const exists = await getUserByEmail(email);
        if (exists) {
        throw new Error("El email ya está registrado");
        }

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar en Firestore
        const docRef = await addDoc(usersCollection, {
        nombre,
        email,
        contraseña: passwordHash,
        fecha_creacion: new Date(),
        });

        return { id: docRef.id, nombre, email };
    } catch (error) {
        console.error("createUser error:", error);
        throw error;
    }
    
};

/* ====================
    ACTUALIZAR
==================== */
export const updateUser = async (id, userData) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
        return null;
        }

        await updateDoc(userRef, userData);
        const updated = await getDoc(userRef);

        return { id: updated.id, ...updated.data() };
    } catch (error) {
        console.error("updateUser error:", error);
        return null;
    }
};

/* ====================
    ELIMINAR
==================== */
export const deleteUser = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
        return { deleted: false, message: "Usuario no encontrado" };
        }

        await deleteDoc(userRef);
        return { deleted: true, data: snapshot.data() };
    } catch (error) {
        console.error("deleteUser error:", error);
        return { deleted: false, message: "Error del servidor" };
    }
};
