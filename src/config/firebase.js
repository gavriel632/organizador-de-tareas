/**
 * Configuración e inicialización de Firebase Firestore para el proyecto.
 * Esta configuración permite conectarse al backend en la nube y utilizar
 * los servicios de base de datos desde cualquier módulo de la aplicación.
 *
 * ⚠️ Las variables sensibles se cargan desde `.env` para proteger la seguridad.
 */


// ----------------------------------------------------------
// 📌 1) Importar funciones requeridas del SDK de Firebase
// ----------------------------------------------------------

import { initializeApp } from "firebase/app";      // Inicializa la app
import { getFirestore } from "firebase/firestore"; // Conecta a Firestore


// ----------------------------------------------------------
// 🛡️ 2) Configuración del proyecto (Variable de entorno)
// ----------------------------------------------------------
//
// 🔐 IMPORTANTE: Nunca escribir las claves directamente en el código.
// Deben venir desde el archivo `.env` para evitar que se filtren.
// En producción, Firebase las valida del lado del servidor.

const firebaseConfig = {
  apiKey: process.env.FIREBASE_apikey,               // Clave pública del proyecto
  authDomain: process.env.FIREBASE_authDomain,       // Dominio de autenticación
  projectId: process.env.FIREBASE_projectId,         // ID único del proyecto
  storageBucket: process.env.FIREBASE_storageBucket, // Espacio de archivos
  messagingSenderId: process.env.FIREBASE_messagingSenderId, // ID de mensajería
  appId: process.env.FIREBASE_appId                  // Identificador principal (cliente)
};


// ----------------------------------------------------------
// 🚀 3) Inicialización de Firebase App
// ----------------------------------------------------------
//
// Se construye la instancia principal que permite acceder a todos los servicios.
// Esta instancia representará tu proyecto en Firebase.

const app = initializeApp(firebaseConfig);


// ----------------------------------------------------------
// 💾 4) Inicializar la base de datos Firestore
// ----------------------------------------------------------
// A partir de la instancia principal (`app`) obtenemos acceso a la BD.

const db = getFirestore(app);


// ----------------------------------------------------------
// 🔁 5) Exportación pública
// ----------------------------------------------------------
//
// Exportamos la conexión para que cualquier módulo pueda importarla y usar Firestore.
//
// Ejemplo de uso en otro archivo:
//   import { db } from "./firebase.js";
//   const usersCollection = collection(db, "users");

export { db };
