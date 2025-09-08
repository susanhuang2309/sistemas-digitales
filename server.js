// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public')); // Serviremos los archivos del frontend desde una carpeta 'public'
// Configuración segura de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// Endpoint para generar recetas
app.post('/generar-historia', async (req, res) => {
try {
const { pedidos } = req.body;
const prompt = `
Eres un escritor creativo y amigable. Tu tarea es crear una historia
simple y rápida
basada en una lista de pedidos.
Pedidos ah realizar: "${pedidos}".
Por favor, responde con el siguiente formato, y solo con este
formato:
**Nombre del cuento:** [Un nombre creativo para el plato]
**Personajes:** [Una lista corta de 2 o 3
personajes que protagonicen la historia]
**Genero:** [El genero cual compone al mundo]
**Hisotria:** [Desde el inicio hasta el desarrollo pasando por el nudo y terminando con el desenlace]
`;

const result = await model.generateContent(prompt);
const receta = result.response.text();
res.json({ receta: receta.trim() });
} catch (error) {
res.status(500).json({ error: 'Error al generar la receta.' });
}
});
app.listen(port, () => {
console.log(`Escritor IA listo para escribir en
http://localhost:${port}!`);
});