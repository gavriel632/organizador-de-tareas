import "dotenv/config";
import { Timestamp } from "firebase/firestore";
import { createTask } from "../src/models/tasks.model.js";

// ⚠️ Cambiá este ID por el usuario que exista en Firestore (el que creaste con /users)
const USER_ID = "fiUEWBKx2R0tU1KYjP6v";

// ✨ Lista de 7 tareas
const tareas = [
  { titulo: "Comprar verduras", prioridad: "media", estado: "pendiente" },
  { titulo: "Estudiar Node.js", prioridad: "alta", estado: "pendiente" },
  { titulo: "Sacar turno médico", prioridad: "alta", estado: "pendiente" },
  { titulo: "Ir al gimnasio", prioridad: "baja", estado: "pendiente" },
  { titulo: "Pagar internet", prioridad: "alta", estado: "pendiente" },
  { titulo: "Leer 20 páginas", prioridad: "media", estado: "pendiente" },
  { titulo: "Ordenar escritorio", prioridad: "baja", estado: "pendiente" }
];

async function cargar() {
  try {
    for (const t of tareas) {
      await createTask({
        ...t,
        fecha_creacion: Timestamp.now(),
        fecha_vencimiento: null,
        id_categoria: null,
        descripcion: "",
        id_usuario: USER_ID
      });
    }

    console.log("🎉 7 tareas agregadas correctamente a Firestore");
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  } finally {
    process.exit();
  }
}

cargar();
