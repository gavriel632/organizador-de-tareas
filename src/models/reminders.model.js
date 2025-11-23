import { db } from "./data.js"; 
import { 
    collection, getDocs, getDoc, addDoc, deleteDoc, doc, updateDoc 
} from "firebase/firestore";


// 📌 Colección en Firestore
const remindersCollection = collection(db, "reminders");

//////////////////////////////////////////////////////
// 📌 Obtener todos los recordatorios (modo admin temporal)
//////////////////////////////////////////////////////
export const getAllReminders = async () => {
    try {
        const snapshot = await getDocs(remindersCollection);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getAllReminders error:", error);
        return [];
    }
};

//////////////////////////////////////////////////////
// 📌 Obtener un recordatorio por ID
//////////////////////////////////////////////////////
export const getReminderById = async (id) => {
    try {
        const reminderRef = doc(remindersCollection, id);
        const snapshot = await getDoc(reminderRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error("getReminderById error:", error);
        return null;
    }
};

//////////////////////////////////////////////////////
// 📌 Crear un recordatorio
//////////////////////////////////////////////////////
export const createReminder = async (data) => {
    try {
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear recordatorio.");
        }

        const docRef = await addDoc(remindersCollection, data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("createReminder error:", error);
        throw new Error("No se pudo crear el recordatorio.");
    }
};

//////////////////////////////////////////////////////
// 📌 Actualizar un recordatorio
//////////////////////////////////////////////////////
export const updateReminder = async (id, data) => {
    try {
        const reminderRef = doc(remindersCollection, id);
        const snapshot = await getDoc(reminderRef);

        if (!snapshot.exists()) return null;

        await updateDoc(reminderRef, data);

        const updatedSnapshot = await getDoc(reminderRef);
        return { id: updatedSnapshot.id, ...updatedSnapshot.data() };
    } catch (error) {
        console.error("updateReminder error:", error);
        return null;
    }
};

//////////////////////////////////////////////////////
// 📌 Eliminar un recordatorio
//////////////////////////////////////////////////////
export const deleteReminder = async (id) => {
    try {
        const reminderRef = doc(remindersCollection, id);
        const snapshot = await getDoc(reminderRef);

        if (!snapshot.exists()) return null;

        await deleteDoc(reminderRef);
        return { deleted: true, id };
    } catch (error) {
        console.error("deleteReminder error:", error);
        return { deleted: false };
    }
};
