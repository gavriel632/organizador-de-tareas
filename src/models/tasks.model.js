import { db } from "./data.js"; // conexión a Firestore
import { collection,getDocs,getDoc,addDoc,deleteDoc,doc,updateDoc,query,where} from "firebase/firestore";

/**
 * Colección de Firestore
 */
const tasksCollection = collection(db, "tasks");

//////////////////////////////////////////////
// Obtener TODAS las tareas
// 🔐 IMPORTANTE: esta función debería filtrar por id_usuario desde el controlador
//////////////////////////////////////////////
export const getAllTasks = async () => {
    try {
        const snapshot = await getDocs(tasksCollection);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getAllTasks error:", error);
        return [];
    }
};

//////////////////////////////////////////////
// Obtener UNA tarea por ID
//////////////////////////////////////////////
export const getTaskById = async (id) => {
    try {
        const taskRef = doc(tasksCollection, id);
        const snapshot = await getDoc(taskRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error("getTaskById error:", error);
        return null;
    }
};

export const getAllTasksByUser = async (userId) => {
    try {
        const q = query(tasksCollection, where("id_usuario", "==", userId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getAllTasksByUser error:", error);
        return [];
    }
};

//////////////////////////////////////////////
// Crear una tarea
//////////////////////////////////////////////
export const createTask = async (data) => {
    try {
        if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos para crear una tarea.");
        }

        // addDoc genera un ID único automáticamente
        const docRef = await addDoc(tasksCollection, data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("createTask error:", error);
        throw new Error("No se pudo crear la tarea.");
    }
};

//////////////////////////////////////////////
// Actualizar tarea por ID
//////////////////////////////////////////////
export const updateTask = async (id, taskData) => {
    try {
        const taskRef = doc(tasksCollection, id);
        const snapshot = await getDoc(taskRef);

        if (!snapshot.exists()) return null;

        await updateDoc(taskRef, taskData);

        const updatedSnapshot = await getDoc(taskRef);
        return { id: updatedSnapshot.id, ...updatedSnapshot.data() };
    } catch (error) {
        console.error("updateTask error:", error);
        return null;
    } 
};

//////////////////////////////////////////////
// Eliminar tarea por ID
//////////////////////////////////////////////
export const deleteTask = async (id) => {
    try {
        const taskRef = doc(tasksCollection, id);
        const snapshot = await getDoc(taskRef);

        if (!snapshot.exists()) return null;

        await deleteDoc(taskRef);
        return { deleted: true, id };
    } catch (error) {
        console.error("deleteTask error:", error);
        return { deleted: false };
    }
};
