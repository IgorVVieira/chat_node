const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const porta = process.env.PORT || 3001;

// Configurar server p/ apresentar arquivos estáticos(.js, .css ... )
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
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