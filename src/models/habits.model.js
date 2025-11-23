// src/models/habits.model.js
import { db } from "./data.js";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// 📌 Colección de Firestore
const habitsCollection = collection(db, "habits");

////////////////////////////////////////////////////
// 📍 Obtener TODOS los hábitos
////////////////////////////////////////////////////
export const getAllHabits = async () => {
    try {
        const snapshot = await getDocs(habitsCollection);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("getAllHabits error:", error);
        return [];
    }
};

////////////////////////////////////////////////////
// 📍 Obtener hábito por ID
////////////////////////////////////////////////////
export const getHabitById = async (id) => {
    try {
        const habitRef = doc(habitsCollection, id);
        const snapshot = await getDoc(habitRef);

        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error("getHabitById error:", error);
        return null;
    }
};

////////////////////////////////////////////////////
// ➕ Crear hábito
////////////////////////////////////////////////////
export const createHabit = async (data) => {
    try {
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear el hábito");
        }

        const docRef = await addDoc(habitsCollection, data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("createHabit error:", error);
        throw new Error("No se pudo crear el hábito");
    }
};

////////////////////////////////////////////////////
// ✏️ Actualizar hábito
////////////////////////////////////////////////////
export const updateHabit = async (id, data) => {
    try {
        const habitRef = doc(habitsCollection, id);
        const snapshot = await getDoc(habitRef);

        if (!snapshot.exists()) return null;

        await updateDoc(habitRef, data);
        const updatedSnap = await getDoc(habitRef);

        return { id: updatedSnap.id, ...updatedSnap.data() };
    } catch (error) {
        console.error("updateHabit error:", error);
        return null;
    }
};

////////////////////////////////////////////////////
// 🗑️ Eliminar hábito
////////////////////////////////////////////////////
export const deleteHabit = async (id) => {
    try {
        const habitRef = doc(habitsCollection, id);
        const snapshot = await getDoc(habitRef);

        if (!snapshot.exists()) return null;

        await deleteDoc(habitRef);
        return { deleted: true, id };
    } catch (error) {
        console.error("deleteHabit error:", error);
        return { deleted: false };
    }
};
