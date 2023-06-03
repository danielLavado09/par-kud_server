import { User } from "../models/User.js";
import SHA1 from "crypto-js/sha1.js";
import { generateRandomPassword } from "../util.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import sgMail from "@sendgrid/mail";

// Registro de usuarios
export const register = async (req, res) => {
  try {
    const { firstName, lastName, userName, identityCard, email } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ identityCard }, { userName }, { email }],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Ya hay un usuario con esos datos." });
    }

    // Crear hash de la contraseña
    const password = generateRandomPassword();

    const hashedPassword = SHA1(password).toString();

    // Crear nuevo usuario
    const user = await User.create({
      firstName,
      lastName,
      userName,
      identityCard,
      email,
      password: hashedPassword,
    });

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user.identityCard },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Enviar la contraseña por correo electrónico
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: "parkud.udcode@outlook.com", // Reemplaza con tu dirección de correo electrónico
      subject: "Contraseña de registro",
      text: `Tu contraseña de registro es: ${password}`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    // Enviar la respuesta con el token
    console.log(password);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(401).json({ message: "No existe el usuario." });
    }

    // Generar el hash SHA-1 de la contraseña ingresada
    const hashedPassword = SHA1(password).toString();

    // Verificar la contraseña
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user.identityCard },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Enviar la respuesta con el token
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updatePassword = async (req, res) => {
  const { identityCard } = req.params;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(identityCard);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (user.password != SHA1(currentPassword).toString()) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const hashedPassword = SHA1(newPassword).toString();
    await user.update({
      password: hashedPassword,
      passwordChanged: true,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
