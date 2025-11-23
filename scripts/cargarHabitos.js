import "dotenv/config";
import { db } from "../src/models/data.js";
import { collection, addDoc } from "firebase/firestore";

// 👉 Colección de Firebase
const habitsCollection = collection(db, "habits");

// 👉 Hábitos de ejemplo
const habits = [
    { nombre: "Leer 10 minutos", periodo: "diario", id_usuario: null, id_recordatorio: null },
    { nombre: "Beber 2 litros de agua", periodo: "diario", id_usuario: null, id_recordatorio: null },
    { nombre: "Ejercicio 20 minutos", periodo: "diario", id_usuario: null, id_recordatorio: null },
    { nombre: "Estudiar programación", periodo: "semanal", id_usuario: null, id_recordatorio: null },
    { nombre: "Meditar 5 minutos", periodo: "diario", id_usuario: null, id_recordatorio: null },
    { nombre: "Limpiar espacio de trabajo", periodo: "semanal", id_usuario: null, id_recordatorio: null }
];

console.log("⏳ Cargando hábitos en Firebase...");

(async () => {
    try {
        for (const habit of habits) {
        console.log("➡️ Enviando:", habit);
        await addDoc(habitsCollection, habit);
        }

        console.log("🎉 ¡Hábitos cargados con éxito!");
        process.exit(0);
    } catch (error) {
        console.error("⚠️ Error cargando hábitos:", error);
        process.exit(1);
    }
})();
