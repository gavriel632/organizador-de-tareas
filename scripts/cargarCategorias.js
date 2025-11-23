import "dotenv/config";  // 👈 OBLIGATORIO
import { db } from "../src/models/data.js";
import { collection, addDoc } from "firebase/firestore";

console.log("📌 Cargando categorías en Firebase...");

const categories = [
    { nombre: "Trabajo", color: "#FF5733", icono: "" },
    { nombre: "Estudio", color: "#33FF57", icono: "" },
    { nombre: "Salud", color: "#3375FF", icono: "" },
    { nombre: "Personal", color: "#FF33A8", icono: "" },
    { nombre: "Finanzas", color: "#FFC300", icono: "" },
    { nombre: "Otros", color: "#CCCCCC", icono: "" }
];

async function cargar() {
    const ref = collection(db, "categories");

    for (const cat of categories) {
    try {
        console.log("📌 Enviando a Firebase:", cat); // <--- AGREGA ESTO
        await addDoc(ref, cat);
        console.log(`✔ Categoria agregada: ${cat.nombre}`);
    } catch (err) {
        console.error(`❌ Error agregando ${cat.nombre}`, err);
    }
    }


    console.log("🎉 ¡Carga finalizada!");
}

cargar();
