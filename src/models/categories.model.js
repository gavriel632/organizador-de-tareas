// src/models/categories.model.js
import { db } from "./data.js";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// 📌 Colección de Firestore
const categoriesCollection = collection(db, "categories");

//////////////////////////////////////////////
// 📍 Obtener TODAS las categorías
//////////////////////////////////////////////
export const getAllCategories = async () => {
    try {
        const snapshot = await getDocs(categoriesCollection);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("getAllCategories error:", error);
        return [];
    }
};

//////////////////////////////////////////////
// 📍 Obtener categoría por ID
//////////////////////////////////////////////
export const getCategoryById = async (id) => {
    try {
        const categoryRef = doc(categoriesCollection, id);
        const snapshot = await getDoc(categoryRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error("getCategoryById error:", error);
        return null;
    }
};

//////////////////////////////////////////////
// 📍 Crear categoría
//////////////////////////////////////////////
export const createCategory = async (data) => {
    try {
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear categoría");
        }

        const docRef = await addDoc(categoriesCollection, data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("createCategory error:", error);
        throw new Error("No se pudo crear la categoría");
    }
};

//////////////////////////////////////////////
// 📍 Actualizar categoría
//////////////////////////////////////////////
export const updateCategory = async (id, data) => {
    try {
        const categoryRef = doc(categoriesCollection, id);
        const snapshot = await getDoc(categoryRef);

        if (!snapshot.exists()) return null;

        await updateDoc(categoryRef, data);
        const updatedSnap = await getDoc(categoryRef);

        return { id: updatedSnap.id, ...updatedSnap.data() };
    } catch (error) {
        console.error("updateCategory error:", error);
        return null;
    }
};

//////////////////////////////////////////////
// 📍 Eliminar categoría
//////////////////////////////////////////////
export const deleteCategory = async (id) => {
    try {
        const categoryRef = doc(categoriesCollection, id);
        const snapshot = await getDoc(categoryRef);

        if (!snapshot.exists()) return null;

        await deleteDoc(categoryRef);
        return { deleted: true, id };
    } catch (error) {
        console.error("deleteCategory error:", error);
        return { deleted: false };
    }
};
