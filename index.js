const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());

app.post('/', async (req, res) => {
    const token = req.body.token;
    const data = req.body.data;

    if (token && token.length > 0) {
        try {
            await admin.messaging().sendEachForMulticast({
                tokens: Array.isArray(token) ? token : [token],
                notification: {
                    title: data.title,
                    body: data.body,
                },
                data: {
                    title: data.title,
                    body: data.body,
                }
            });
            res.json('Notification sent successfully');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to send notification' });
        }
    } else {
        res.status(400).json({ error: 'Invalid token' });
    }
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});
