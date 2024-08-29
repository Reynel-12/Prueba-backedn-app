const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());  // Middleware para procesar JSON

app.post('/', async (req, res) => {
  try {
    const { token, data } = req.body;

    // Verifica que 'data' y sus campos 'title' y 'body' existan
    if (!data || !data.title || !data.body) {
      return res.status(400).json({ error: 'Faltan los campos title o body en la solicitud' });
    }

    if (!token || token.length === 0) {
      return res.status(400).json({ error: 'Token inválido o faltante' });
    }

    const message = {
      token: token,
      notification: {
        title: data.title,
        body: data.body
      },
      data: {
        key1: 'value1',  // Puedes agregar más datos si es necesario
        key2: 'value2'
      }
    };

    try {
      const response = await admin.messaging().send(message);
      res.json({ message: 'Notificación enviada exitosamente', response });
    } catch (error) {
      console.error('Error enviando la notificación:', error);
      res.status(500).json({ error: 'Error enviando la notificación' });
    }
  } catch (err) {
    console.error('Error en el servidor:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(port, () => {
  console.log('Servidor corriendo en el puerto ' + port);
});
