// Importa la instancia de la base de datos (Firestore) inicializada en data.js.
import { db } from "../config/firebase.js";
// Importa las funciones necesarias del SDK de Firebase Firestore para interactuar con la base de datos.
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// 📌 Colección de Firestore
// Crea una referencia a la colección de Firestore llamada "habits".
// Esta referencia se reutilizará en todas las funciones CRUD.
const habitsCollection = collection(db, "habits");

////////////////////////////////////////////////////
// 📍 Obtener TODOS los hábitos (Read - All)
////////////////////////////////////////////////////
// Define y exporta una función asíncrona para obtener todos los documentos de la colección.
export const getAllHabits = async () => {
    try {
        // Ejecuta la consulta a Firestore y espera a obtener el 'snapshot' (una instantánea de la colección).
        const snapshot = await getDocs(habitsCollection);
        // Mapea los documentos del snapshot a un array de objetos JavaScript.
        // d.id: Agrega el ID único de Firestore a cada objeto.
        // ...d.data(): Desempaqueta los campos del documento (título, descripción, etc.) en el objeto.
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
        // Captura cualquier error ocurrido durante la operación.
        console.error("getAllHabits error:", error);
        // En caso de error, retorna un array vacío.
        return [];
    }
};

////////////////////////////////////////////////////
// 📍 Obtener hábito por ID (Read - One)
////////////////////////////////////////////////////
// Define y exporta una función asíncrona para buscar un hábito por su ID.
export const getHabitById = async (id) => {
    try {
        // Crea una referencia a un documento específico dentro de 'habitsCollection' usando el 'id' proporcionado.
        const habitRef = doc(habitsCollection, id);
        // Espera a obtener el 'snapshot' (instantánea) de ese documento específico.
        const snapshot = await getDoc(habitRef);

        // Verifica si el documento existe (snapshot.exists()).
        // Si existe, retorna el objeto incluyendo su ID y sus datos; si no, retorna null.
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        // Captura cualquier error ocurrido durante la operación.
        console.error("getHabitById error:", error);
        // En caso de error, retorna null.
        return null;
    }
};

////////////////////////////////////////////////////
// ➕ Crear hábito (Create)
////////////////////////////////////////////////////
// Define y exporta una función asíncrona para crear un nuevo hábito con los datos proporcionados.
export const createHabit = async (data) => {
    try {
        // Validación básica: asegura que se recibieron datos y que son un objeto.
        if (!data || typeof data !== "object") {
            throw new Error("Datos inválidos para crear el hábito");
        }

        // Agrega un nuevo documento a la colección. Firestore genera automáticamente un ID.
        // 'docRef' contiene la referencia al documento recién creado.
        const docRef = await addDoc(habitsCollection, data);
        // Retorna el ID generado y los datos que se guardaron.
        return { id: docRef.id, ...data };
    } catch (error) {
        // Captura y registra el error en la consola.
        console.error("createHabit error:", error);
        // Lanza un nuevo error con un mensaje genérico para el controlador/capa superior.
        throw new Error("No se pudo crear el hábito");
    }
};

////////////////////////////////////////////////////
// ✏️ Actualizar hábito (Update)
////////////////////////////////////////////////////
// Define y exporta una función asíncrona para actualizar un hábito existente por su ID.
export const updateHabit = async (id, data) => {
    try {
        // Crea una referencia al documento específico que se va a actualizar.
        const habitRef = doc(habitsCollection, id);
        // Verifica si el documento existe antes de intentar actualizar.
        const snapshot = await getDoc(habitRef);

        // Si el documento no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Aplica la actualización a los campos especificados en 'data' del documento referenciado.
        await updateDoc(habitRef, data);
        // Obtiene una nueva instantánea del documento actualizado.
        const updatedSnap = await getDoc(habitRef);

        // Retorna el objeto actualizado, incluyendo su ID y los datos frescos.
        return { id: updatedSnap.id, ...updatedSnap.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("updateHabit error:", error);
        // En caso de error, retorna null.
        return null;
    }
};

////////////////////////////////////////////////////
// 🗑️ Eliminar hábito (Delete)
////////////////////////////////////////////////////
// Define y exporta una función asíncrona para eliminar un hábito por su ID.
export const deleteHabit = async (id) => {
    try {
        // Crea una referencia al documento específico que se va a eliminar.
        const habitRef = doc(habitsCollection, id);
        // Verifica si el documento existe antes de intentar eliminar.
        const snapshot = await getDoc(habitRef);

        // Si el documento no existe, retorna null.
        if (!snapshot.exists()) return null;

        // Elimina el documento de Firestore.
        await deleteDoc(habitRef);
        // Retorna un objeto confirmando la eliminación y el ID.
        return { deleted: true, id };
    } catch (error) {
        // Captura y registra el error.
        console.error("deleteHabit error:", error);
        // En caso de error, retorna un objeto indicando que no se eliminó.
        return { deleted: false };
    }
};