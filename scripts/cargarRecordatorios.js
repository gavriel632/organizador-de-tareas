// data/testCrearRecordatorios.js
import "dotenv/config"; 
import { createReminder } from "../src/models/reminders.model.js";
import { Timestamp } from "firebase/firestore";

// 👇 Array con 6 recordatorios
const recordatorios = [
    {
        nombre: "Beber agua",
        cuerpo: "Tomar 2 vasos de agua",
        fecha_hora: Timestamp.fromDate(new Date("2025-03-10T08:00:00")),
        id_usuario: "1",
        id_habito: "1"
    },
    {
        nombre: "Estudiar Node.js",
        cuerpo: "Repasar controladores y JWT",
        fecha_hora: Timestamp.fromDate(new Date("2025-03-10T18:00:00")),
        id_usuario: "1",
        id_habito: "2"
    },
    {
        nombre: "Caminar",
        cuerpo: "20 minutos de caminata",
        fecha_hora: Timestamp.fromDate(new Date("2025-03-11T07:45:00")),
        id_usuario: "1",
        id_habito: "3"
    },
    {
        nombre: "Desayuno saludable",
        cuerpo: "Incluir fruta y proteína",
        fecha_hora: Timestamp.fromDate(new Date("2025-03-11T09:00:00")),
        id_usuario: "1",
        id_habito: "4"
    },
    {
        nombre: "Leer libro",
        cuerpo: "Leer 20 páginas",
        fecha_hora: Timestamp.fromDate(new Date("2025-03-11T21:00:00")),
        id_usuario: "1",
        id_habito: "5"
    },
    {
        nombre: "Dormir temprano",
        cuerpo: "Evitar pantallas desde las 22:00",
        fecha_hora: Timestamp.fromDate(new Date("2025-03-11T23:00:00")),
        id_usuario: "1",
        id_habito: "6"
    }
];

async function main() {
    try {
        for (const rec of recordatorios) {
        const nuevo = await createReminder(rec);
        console.log("Recordatorio agregado:", nuevo);
        }
        console.log("\n🎉 ¡Se agregaron 6 recordatorios exitosamente!");
    } catch (error) {
        console.error("❌ Error al crear recordatorios:", error);
    }
}

main();
