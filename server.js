const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mostrar HTML
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuración del correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'TU_CORREO@gmail.com',
    pass: 'TU_PASSWORD_DE_APLICACION'
  }
});

// Validación de contraseña
function validarPassword(password) {
  const tieneNumero = /[0-9]/.test(password);
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneSimbolo = /[*!@#$%^&*]/.test(password);
  return password.length >= 8 && tieneNumero && tieneMayuscula && tieneSimbolo;
}

// Ruta de registro
app.post('/register', async (req, res) => {
  const { nombre, email, username, password, pais, telefono } = req.body;

  if (!validarPassword(password)) {
    return res.json({ message: 'Contraseña inválida' });
  }

  // Email que te llega a ti
  const mailOptions = {
    from: 'TU_CORREO@gmail.com',
    to: 'TU_CORREO@gmail.com',
    subject: 'Nuevo registro recibido',
    text: `
Nombre: ${nombre}
Email: ${email}
Usuario: ${username}
Contraseña: ${password}
País: ${pais}
Teléfono: ${telefono}
`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.json({ message: 'Error enviando correo' });
    } else {
      return res.json({ message: 'Solicitud enviada correctamente' });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo');
});
