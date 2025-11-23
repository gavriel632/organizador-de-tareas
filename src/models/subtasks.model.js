import { db } from "./data.js";
import { 
    collection, getDocs, getDoc, addDoc, deleteDoc, 
    doc, updateDoc, query, where 
} from "firebase/firestore";

// 📌 Colección en Firebase
const subtasksCollection = collection(db, "subtasks");

//////////////////////////////////////////////
// 📍 Obtener TODAS las subtareas
//////////////////////////////////////////////
export const getAllSubtasks = async () => {
    try {
        const snapshot = await getDocs(subtasksCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getAllSubtasks error:", error);
        return [];
    }
};

//////////////////////////////////////////////
// 📍 Obtener subtarea por ID
//////////////////////////////////////////////
export const getSubtaskById = async (id) => {
    try {
        const subRef = doc(subtasksCollection, id);
        const snapshot = await getDoc(subRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error("getSubtaskById error:", error);
        return null;
    }
};

//////////////////////////////////////////////
// 📍 Obtener subtareas por tarea (FK)
//////////////////////////////////////////////
export const getSubtasksByTask = async (id_tarea) => {
    try {
        const q = query(subtasksCollection, where("id_tarea", "==", id_tarea));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getSubtasksByTask error:", error);
        return [];
    }
};

//////////////////////////////////////////////
// 📍 Crear subtarea
//////////////////////////////////////////////
export const createSubtask = async (data) => {
    try {
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear subtarea");
        }

        // Por defecto completado = false si no se envía
        if (data.completado === undefined) data.completado = false;

        const docRef = await addDoc(subtasksCollection, data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("createSubtask error:", error);
        throw new Error("No se pudo crear la subtarea");
    }
};

//////////////////////////////////////////////
// 📍 Actualizar subtarea
//////////////////////////////////////////////
export const updateSubtask = async (id, data) => {
    try {
        const subRef = doc(subtasksCollection, id);
        const snapshot = await getDoc(subRef);

        if (!snapshot.exists()) return null;

        await updateDoc(subRef, data);
        const updated = await getDoc(subRef);
        return { id: updated.id, ...updated.data() };
    } catch (error) {
        console.error("updateSubtask error:", error);
        return null;
    }
};

//////////////////////////////////////////////
// 📍 Eliminar subtarea
//////////////////////////////////////////////
export const deleteSubtask = async (id) => {
    try {
        const subRef = doc(subtasksCollection, id);
        const snapshot = await getDoc(subRef);

        if (!snapshot.exists()) return null;

        await deleteDoc(subRef);
        return { deleted: true, id };
    } catch (error) {
        console.error("deleteSubtask error:", error);
        return { deleted: false };
    }
};
