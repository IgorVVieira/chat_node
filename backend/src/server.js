const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const nunjucks = require('nunjucks');
const porta = 3000;

const configure = () => {
    // Configurar server p/ apresentar arquivos estáticos(.js, .css ... )
    app.use(express.static('../frontend/public'));

    // Configurando a template engine(nunjucks)
    nunjucks.configure('../frontend', {
        express: app,
        noCache: true,
    });
};

configure();

app.get('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado, id: ${socket.id}`);

    socket.emit('previousMessages', messages);
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('recievedMessage', data);
    });
});

app.listen(porta, () => {
    console.log(`Rodando na porta ${porta}`);
});