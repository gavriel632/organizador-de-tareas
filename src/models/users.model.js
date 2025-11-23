// Importa la instancia de la base de datos (Firestore) inicializada en data.js.
import { db } from "./data.js";
// Importa las funciones del SDK de Firebase Firestore necesarias para todas las operaciones CRUD y consultas filtradas.
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
// Importa la librería Bcryptjs para la encriptación segura de contraseñas.
import bcrypt from "bcryptjs";

// Crea una referencia a la colección de Firestore llamada "users".
const usersCollection = collection(db, "users");

/* ====================
    OBTENER TODOS (Read - All)
==================== */
// Define y exporta una función asíncrona para obtener todos los usuarios.
export const getAllUsers = async () => {
    try {
        // Ejecuta la consulta y espera el 'snapshot' de la colección.
        const snapshot = await getDocs(usersCollection);
        // Mapea y retorna el array de usuarios, incluyendo el ID de Firestore y los datos.
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Captura y registra cualquier error.
        console.error("getAllUsers error:", error);
        // Retorna un array vacío en caso de fallo.
        return [];
    }
};

/* ====================
    BUSCAR POR ID (Read - One)
==================== */
// Define y exporta una función asíncrona para buscar un usuario por su ID único.
export const getUserById = async (id) => {
    try {
        // Crea una referencia al documento específico.
        const userRef = doc(usersCollection, id);
        // Espera a obtener el 'snapshot' del documento.
        const snapshot = await getDoc(userRef);
        // Si existe, retorna el objeto; si no, retorna null.
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        // Captura y registra el error.
        console.error("getUserById error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

/* ====================
    BUSCAR POR EMAIL (Consulta con filtro)
==================== */
// Define y exporta una función asíncrona para buscar un usuario por su email (utilizado para login y validación de unicidad).
export const getUserByEmail = async (email) => {
    try {
        // Construye un objeto 'query' para filtrar la colección 'users'.
        // El filtro busca documentos donde el campo "email" sea igual al 'email' proporcionado.
        const q = query(usersCollection, where("email", "==", email));
        // Ejecuta la consulta filtrada.
        const result = await getDocs(q);
        // Si el resultado está vacío (no hay documentos), retorna null.
        if (result.empty) return null;
        // Si se encuentra, toma el primer documento (asumiendo que el email es único).
        const userDoc = result.docs[0];
        // Retorna el objeto usuario con ID y datos.
        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("getUserByEmail error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

/* ====================
    CREAR USUARIO (Create)
==================== */
// Define y exporta una función asíncrona para registrar un nuevo usuario.
export const createUser = async ({ nombre, email, password }) => {
    // Muestra los datos recibidos en la consola antes del procesamiento.
    console.log("DATA RECIBIDA EN createUser:", { nombre, email, password });
    try {
        // Validación básica: comprueba que los campos obligatorios existan.
        if (!nombre || !email || !password) {
        throw new Error("Nombre, email y contraseña son obligatorios");
        }

        // Validar email único: comprueba si ya existe un usuario con ese email.
        const exists = await getUserByEmail(email);
        if (exists) {
        throw new Error("El email ya está registrado");
        }

        // Encriptar contraseña: Usa Bcrypt para hashear la contraseña.
        // El '10' es el factor de costo (número de rondas de hash). Cuanto mayor, más seguro y más lento.
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar en Firestore
        const docRef = await addDoc(usersCollection, {
        nombre,
        email,
        // Almacena el hash seguro, NO la contraseña original de texto plano.
        contraseña: passwordHash, 
        fecha_creacion: new Date(), // Guarda la fecha de creación.
        });

        // Retorna el ID del nuevo usuario junto con su nombre y email (excluyendo el hash).
        return { id: docRef.id, nombre, email };
    } catch (error) {
        // Captura y registra el error.
        console.error("createUser error:", error);
        // Vuelve a lanzar el error para que sea manejado por el controlador.
        throw error;
    }
    
};

/* ====================
    ACTUALIZAR (Update)
==================== */
// Define y exporta una función asíncrona para actualizar los datos de un usuario.
export const updateUser = async (id, userData) => {
    try {
        // Crea una referencia al documento específico.
        const userRef = doc(usersCollection, id);
        // Verifica la existencia del documento.
        const snapshot = await getDoc(userRef);

        // Si el usuario no existe, retorna null.
        if (!snapshot.exists()) {
        return null;
        }

        // Aplica la actualización. (Nota: si se actualiza la contraseña, debe ser hasheada primero).
        await updateDoc(userRef, userData);
        // Obtiene la instantánea final del documento actualizado.
        const updated = await getDoc(userRef);

        // Retorna el objeto actualizado.
        return { id: updated.id, ...updated.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("updateUser error:", error);
        // Retorna null en caso de fallo.
        return null;
    }
};

/* ====================
    ELIMINAR (Delete)
==================== */
// Define y exporta una función asíncrona para eliminar un usuario por su ID.
export const deleteUser = async (id) => {
    try {
        // Crea una referencia al documento.
        const userRef = doc(usersCollection, id);
        // Verifica la existencia del documento.
        const snapshot = await getDoc(userRef);

        // Si el usuario no existe.
        if (!snapshot.exists()) {
        return { deleted: false, message: "Usuario no encontrado" };
        }

        // Ejecuta la eliminación del documento.
        await deleteDoc(userRef);
        // Retorna la confirmación de la eliminación junto con los datos del usuario eliminado (para logs o confirmación).
        return { deleted: true, data: snapshot.data() };
    } catch (error) {
        // Captura y registra el error.
        console.error("deleteUser error:", error);
        // Retorna un objeto indicando el fallo.
        return { deleted: false, message: "Error del servidor" };
    }
};