require('dotenv').config();

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const Denuncia = require('./app/models/denunciasModel');

const app = express();

const port = process.env.PORT || '3000';

app.listen(port, () => console.log('Open Server'));

// ======================== Configurações Gerais ======================= //

app.use(cors({
  origin: "*",
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  methods: "GET,PUT,POST,DELETE",
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: '8918c014d3fc7c0ad0721fe825371b76',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use(express.static(__dirname + '/www'));

// ==================================================================== //

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/www'));
});

require('./app/controllers/index.js')(app);

setInterval(async () => {
  const lista = await Denuncia.find({}).select('+expires');
  lista.forEach(async (element) => {
    const now = new Date();
    if (now > element.expires) {
      await Denuncia.findByIdAndRemove(element._id);
    }
  });
}, 7200);
