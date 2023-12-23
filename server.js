const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/favicon.ico', (req, res) => res.status(204));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
