// Importa la instancia de la base de datos (Firestore) inicializada en data.js.
import { db } from "../config/firebase.js";
// Importa las funciones del SDK de Firebase Firestore necesarias para todas las operaciones CRUD (Leer, Crear, Actualizar, Eliminar).
import { 
    collection, getDocs, getDoc, addDoc, deleteDoc, doc, updateDoc 
} from "firebase/firestore";


// 📌 Colección en Firestore
// Crea una referencia al contenedor principal de datos en Firestore, llamado "reminders".
const remindersCollection = collection(db, "reminders");

//////////////////////////////////////////////////////
// 📌 Obtener todos los recordatorios (Read - All)
//////////////////////////////////////////////////////
// Define y exporta una función asíncrona para recuperar todos los documentos de la colección.
export const getAllReminders = async () => {
    try {
        // Ejecuta la consulta y espera el 'snapshot' (instantánea) de toda la colección.
        const snapshot = await getDocs(remindersCollection);
        // Mapea los documentos del snapshot a un array de objetos JavaScript.
        // Se extrae el ID de Firestore (doc.id) y se combinan los datos del documento (...doc.data()).
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Captura y registra cualquier error ocurrido durante la lectura.
        console.error("getAllReminders error:", error);
        // Retorna un array vacío en caso de fallo.
        return [];
    }
};

//////////////////////////////////////////////////////
// 📌 Obtener un recordatorio por ID (Read - One)
//////////////////////////////////////////////////////
// Define y exporta una función asíncrona para buscar un recordatorio específico por su ID.
export const getReminderById = async (id) => {
    try {
        // Crea una referencia a un documento específico dentro de la colección 'remindersCollection' usando el ID.
        const reminderRef = doc(remindersCollection, id);
        // Espera a obtener el 'snapshot' de ese documento.
        const snapshot = await getDoc(reminderRef);
        // Verifica si el documento existe (snapshot.exists()). 
        // Si existe, retorna el objeto con ID y datos; si no, retorna null.
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        // Captura y registra cualquier error.
        console.error("getReminderById error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

//////////////////////////////////////////////////////
// 📌 Crear un recordatorio (Create)
//////////////////////////////////////////////////////
// Define y exporta una función asíncrona para añadir un nuevo recordatorio.
export const createReminder = async (data) => {
    try {
        // Validación de datos: asegura que se recibió un objeto válido para el recordatorio.
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear recordatorio.");
        }

        // Agrega un nuevo documento a la colección 'remindersCollection'. 
        // Firestore genera automáticamente el ID del documento.
        const docRef = await addDoc(remindersCollection, data);
        // Retorna el ID generado por Firestore junto con los datos que se guardaron.
        return { id: docRef.id, ...data };
    } catch (error) {
        // Captura y registra el error.
        console.error("createReminder error:", error);
        // Lanza una excepción con un mensaje genérico de fallo de creación.
        throw new Error("No se pudo crear el recordatorio.");
    }
};

//////////////////////////////////////////////////////
// 📌 Actualizar un recordatorio (Update)
//////////////////////////////////////////////////////
// Define y exporta una función asíncrona para modificar los datos de un recordatorio existente.
export const updateReminder = async (id, data) => {
    try {
        // Crea una referencia al documento específico que se desea actualizar.
        const reminderRef = doc(remindersCollection, id);
        // Obtiene la instantánea actual para verificar la existencia.
        const snapshot = await getDoc(reminderRef);

        // Si el recordatorio no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Aplica la actualización parcial o total de los campos del documento referenciado.
        await updateDoc(reminderRef, data);

        // Obtiene una nueva instantánea del documento para retornar los datos después de la actualización.
        const updatedSnapshot = await getDoc(reminderRef);
        // Retorna el objeto actualizado.
        return { id: updatedSnapshot.id, ...updatedSnapshot.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("updateReminder error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

//////////////////////////////////////////////////////
// 📌 Eliminar un recordatorio (Delete)
//////////////////////////////////////////////////////
// Define y exporta una función asíncrona para eliminar un recordatorio por su ID.
export const deleteReminder = async (id) => {
    try {
        // Crea una referencia al documento específico que se va a eliminar.
        const reminderRef = doc(remindersCollection, id);
        // Obtiene la instantánea para verificar la existencia.
        const snapshot = await getDoc(reminderRef);

        // Si el recordatorio no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Ejecuta la eliminación del documento en Firestore.
        await deleteDoc(reminderRef);
        // Retorna un objeto confirmando que la operación de eliminación fue exitosa.
        return { deleted: true, id };
    } catch (error) {
        // Captura y registra el error.
        console.error("deleteReminder error:", error);
        // Retorna un objeto indicando que la eliminación falló.
        return { deleted: false };
    }
};