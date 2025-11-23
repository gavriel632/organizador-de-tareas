// src/models/subtasks.model.js

// Importa la instancia de la base de datos (Firestore) inicializada en data.js.
import { db } from "./data.js";
// Importa las funciones del SDK de Firebase Firestore necesarias para todas las operaciones CRUD y consultas avanzadas.
import { 
    collection, getDocs, getDoc, addDoc, deleteDoc, 
    doc, updateDoc, query, where 
} from "firebase/firestore";

// 📌 Colección en Firebase
// Crea una referencia a la colección de Firestore llamada "subtasks".
const subtasksCollection = collection(db, "subtasks");

//////////////////////////////////////////////
// 📍 Obtener TODAS las subtareas (Read - All)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para recuperar todos los documentos de la colección 'subtasks'.
export const getAllSubtasks = async () => {
    try {
        // Ejecuta la consulta a Firestore y espera a obtener el 'snapshot' de la colección.
        const snapshot = await getDocs(subtasksCollection);
        // Mapea los documentos del snapshot: extrae el ID (doc.id) y los datos del documento (...doc.data()).
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Captura y registra cualquier error ocurrido durante la lectura.
        console.error("getAllSubtasks error:", error);
        // Retorna un array vacío en caso de fallo.
        return [];
    }
};

//////////////////////////////////////////////
// 📍 Obtener subtarea por ID (Read - One)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para buscar una subtarea específica por su ID.
export const getSubtaskById = async (id) => {
    try {
        // Crea una referencia a un documento específico usando la colección y el ID proporcionado.
        const subRef = doc(subtasksCollection, id);
        // Espera a obtener el 'snapshot' (instantánea) de ese documento.
        const snapshot = await getDoc(subRef);
        // Si el documento existe, retorna el objeto con ID y datos; si no, retorna null.
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        // Captura y registra el error.
        console.error("getSubtaskById error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

//////////////////////////////////////////////
// 📍 Obtener subtareas por tarea (Consulta por FK - Foreign Key)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para obtener todas las subtareas asociadas a una tarea principal.
export const getSubtasksByTask = async (id_tarea) => {
    try {
        // Crea un objeto 'query' para filtrar la colección 'subtasks'.
        // El filtro busca documentos donde el campo "id_tarea" sea igual al 'id_tarea' proporcionado.
        // NOTA: Para que esto funcione eficientemente, podría necesitar un índice en el campo "id_tarea".
        const q = query(subtasksCollection, where("id_tarea", "==", id_tarea));
        // Ejecuta la consulta y espera el snapshot de los resultados filtrados.
        const snapshot = await getDocs(q);
        // Mapea y retorna el array de subtareas que cumplen con el filtro.
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Captura y registra el error.
        console.error("getSubtasksByTask error:", error);
        // Retorna un array vacío en caso de fallo.
        return [];
    }
};

//////////////////////////////////////////////
// 📍 Crear subtarea (Create)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para añadir una nueva subtarea.
export const createSubtask = async (data) => {
    try {
        // Validación de datos: asegura que se recibió un objeto válido.
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear subtarea");
        }

        // Establece el campo 'completado' a 'false' si no se proporciona en los datos de entrada.
        if (data.completado === undefined) data.completado = false;

        // Agrega el nuevo documento a la colección. Firestore genera automáticamente el ID.
        const docRef = await addDoc(subtasksCollection, data);
        // Retorna el ID generado junto con los datos guardados.
        return { id: docRef.id, ...data };
    } catch (error) {
        // Captura y registra el error.
        console.error("createSubtask error:", error);
        // Lanza una excepción al controlador.
        throw new Error("No se pudo crear la subtarea");
    }
};

//////////////////////////////////////////////
// 📍 Actualizar subtarea (Update)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para actualizar los datos de una subtarea.
export const updateSubtask = async (id, data) => {
    try {
        // Crea una referencia al documento específico.
        const subRef = doc(subtasksCollection, id);
        // Verifica la existencia del documento.
        const snapshot = await getDoc(subRef);

        // Si no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Aplica la actualización a los campos especificados en 'data'.
        await updateDoc(subRef, data);
        // Obtiene la instantánea final para confirmar y retornar los datos actualizados.
        const updated = await getDoc(subRef);
        // Retorna el objeto actualizado.
        return { id: updated.id, ...updated.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("updateSubtask error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

//////////////////////////////////////////////
// 📍 Eliminar subtarea (Delete)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para eliminar una subtarea.
export const deleteSubtask = async (id) => {
    try {
        // Crea una referencia al documento.
        const subRef = doc(subtasksCollection, id);
        // Verifica la existencia.
        const snapshot = await getDoc(subRef);

        // Si no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Ejecuta la eliminación del documento.
        await deleteDoc(subRef);
        // Retorna la confirmación de la eliminación.
        return { deleted: true, id };
    } catch (error) {
        // Captura y registra el error.
        console.error("deleteSubtask error:", error);
        // Retorna un objeto indicando que la eliminación falló.
        return { deleted: false };
    }
};