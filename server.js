const express = require('express');

const app = express();

app.use(express.static('./dist/Apoteka/'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/Apoteka/'}),
);

app.listen(process.env.PORT || 8080);
