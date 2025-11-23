import "dotenv/config";  // 👈 OBLIGATORIO
import { db } from "../src/models/data.js"; 
import { collection, addDoc } from "firebase/firestore";

// 📌 Subtareas a cargar (6 ejemplos)
const subtareas = [
    { nombre: "Investigar APIs", id_tarea: "TAREA_1", completado: false },
    { nombre: "Crear endpoints CRUD", id_tarea: "TAREA_1", completado: false },

    { nombre: "Diseñar iconos", id_tarea: "TAREA_2", completado: true },
    { nombre: "Seleccionar paleta de colores", id_tarea: "TAREA_2", completado: false },

    { nombre: "Comprar ingredientes", id_tarea: "TAREA_3", completado: false },
    { nombre: "Cocinar receta", id_tarea: "TAREA_3", completado: false }
];

// ⚠️ NOTA IMPORTANTE:
// Sustituí "TAREA_1", "TAREA_2", etc. con los IDs reales de tu colección `tasks`.
// Los obtenés desde Firebase o haciendo GET /tasks.

async function cargarSubtareas() {
    try {
        console.log("📌 Cargando subtareas en Firebase...");

        const subCollection = collection(db, "subtasks");

        for (const subtask of subtareas) {
            console.log("📨 Enviando a Firebase:", subtask);
            await addDoc(subCollection, subtask);
        }

        console.log("✨ Subtareas cargadas con éxito!");
    } catch (error) {
        console.error("❌ Error al cargar subtareas:", error);
    }
}

cargarSubtareas();
