// src/models/tasks.model.js

// Importa la instancia de la base de datos (Firestore) inicializada en data.js.
import { db } from "./data.js"; 
// Importa las funciones del SDK de Firebase Firestore necesarias para todas las operaciones CRUD y consultas con filtros.
import { 
    collection,getDocs,getDoc,addDoc,deleteDoc,doc,updateDoc,query,where
} from "firebase/firestore";

/**
 * Colección de Firestore
 */
// Crea una referencia a la colección de Firestore llamada "tasks".
const tasksCollection = collection(db, "tasks");

//////////////////////////////////////////////
// Obtener TODAS las tareas (Read - All - Temporal)
// 🔐 IMPORTANTE: esta función debería filtrar por id_usuario desde el controlador
//////////////////////////////////////////////
// Define y exporta una función asíncrona para obtener todos los documentos de la colección (sin filtro de usuario).
export const getAllTasks = async () => {
    try {
        // Ejecuta la consulta a Firestore y espera a obtener el 'snapshot' de la colección.
        const snapshot = await getDocs(tasksCollection);
        // Mapea los documentos: combina el ID único (doc.id) con los datos del documento (...doc.data()).
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Captura y registra cualquier error.
        console.error("getAllTasks error:", error);
        // Retorna un array vacío en caso de fallo.
        return [];
    }
};

//////////////////////////////////////////////
// Obtener UNA tarea por ID (Read - One)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para buscar una tarea por su ID.
export const getTaskById = async (id) => {
    try {
        // Crea una referencia a un documento específico usando la colección y el ID proporcionado.
        const taskRef = doc(tasksCollection, id);
        // Espera a obtener el 'snapshot' de ese documento.
        const snapshot = await getDoc(taskRef);
        // Si el documento existe, retorna el objeto con ID y datos; si no, retorna null.
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        // Captura y registra el error.
        console.error("getTaskById error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

//////////////////////////////////////////////
// Obtener Tareas por Usuario (Consulta con filtro)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para obtener todas las tareas de un usuario específico.
export const getAllTasksByUser = async (userId) => {
    try {
        // Construye un objeto 'query' para filtrar la colección 'tasks'.
        // El filtro busca documentos donde el campo "id_usuario" sea igual al 'userId' proporcionado.
        const q = query(tasksCollection, where("id_usuario", "==", userId));
        // Ejecuta la consulta filtrada y espera el snapshot.
        const snapshot = await getDocs(q);

        // Mapea y retorna el array de tareas que pertenecen a ese usuario.
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Captura y registra el error.
        console.error("getAllTasksByUser error:", error);
        // Retorna un array vacío en caso de fallo.
        return [];
    }
};

//////////////////////////////////////////////
// Crear una tarea (Create)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para crear una nueva tarea.
export const createTask = async (data) => {
    try {
        // Validación de datos: asegura que se recibió un objeto válido para la tarea.
        if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos para crear una tarea.");
        }

        // addDoc genera un ID único automáticamente.
        // Agrega el nuevo documento a la colección.
        const docRef = await addDoc(tasksCollection, data);
        // Retorna el ID generado junto con los datos guardados.
        return { id: docRef.id, ...data };
    } catch (error) {
        // Captura y registra el error.
        console.error("createTask error:", error);
        // Lanza una excepción al controlador.
        throw new Error("No se pudo crear la tarea.");
    }
};

//////////////////////////////////////////////
// Actualizar tarea por ID (Update)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para actualizar los datos de una tarea existente.
export const updateTask = async (id, taskData) => {
    try {
        // Crea una referencia al documento específico que se va a actualizar.
        const taskRef = doc(tasksCollection, id);
        // Verifica la existencia del documento.
        const snapshot = await getDoc(taskRef);

        // Si el documento no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Aplica la actualización con los datos proporcionados.
        await updateDoc(taskRef, taskData);

        // Obtiene la instantánea final del documento para retornar los datos actualizados.
        const updatedSnapshot = await getDoc(taskRef);
        // Retorna el objeto actualizado.
        return { id: updatedSnapshot.id, ...updatedSnapshot.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("updateTask error:", error);
        // Retorna null en caso de fallo.
        return null;
    } 
};

//////////////////////////////////////////////
// Eliminar tarea por ID (Delete)
//////////////////////////////////////////////
// Define y exporta una función asíncrona para eliminar una tarea.
export const deleteTask = async (id) => {
    try {
        // Crea una referencia al documento específico.
        const taskRef = doc(tasksCollection, id);
        // Verifica la existencia del documento.
        const snapshot = await getDoc(taskRef);

        // Si el documento no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Ejecuta la eliminación del documento en Firestore.
        await deleteDoc(taskRef);
        // Retorna la confirmación de la eliminación.
        return { deleted: true, id };
    } catch (error) {
        // Captura y registra el error.
        console.error("deleteTask error:", error);
        // Retorna un objeto indicando que la eliminación falló.
        return { deleted: false };
    }
};