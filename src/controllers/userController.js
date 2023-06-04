import { User } from "../models/User.js";
import { Parking } from "../models/Parking.js";
import { Reservations } from "../models/Reservations.js";
import SHA1 from "crypto-js/sha1.js";
import { generateRandomPassword } from "../util.js";
import { Op } from "sequelize";
import sgMail from "@sendgrid/mail";

export const updateUser = async (req, res) => {
  try {
    const { identityCard } = req.params;
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = SHA1(password).toString();

    const user = await User.findByPk(identityCard);
    if (!user) {
      return res.status(401).json({ message: "No se encontro el usuario" });
    }

    await user.update({
      firstName: firstName,
      lastName: lastName,
      email,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const { identityCard } = req.params;
    const user = await User.findByPk(identityCard);
    if (!user) {
      return res.status(401).json({ message: "No se encontro el usuario" });
    }
    const reservations = await Reservations.findAll({
      where: {
        identityCard: identityCard,
      },
    });
    res.status(201).json({ reservations: reservations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { identityCard } = req.params;
    const user = await User.findByPk(identityCard);
    if (!user) {
      return res.status(401).json({ message: "No se encontro el usuario" });
    }
    await user.destroy();
    res.status(201).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const createUser = async (req, res) => {
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

    console.log(password);
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const usersByReservations = async (req, res) => {
  const { limit } = req.params;
  try {
    const users = await User.findAll({
      attributes: ["userName", "bookings"],
      where: {
        bookings: {
          [Op.not]: 0,
        },
      },
      order: [["bookings", "ASC"]],
      limit: limit,
    });
    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const userByParkingId = async (req, res) => {
  const { parkingId } = req.params;
  try {
    const usersId = await Reservations.findAll({
      where: { parkingId: parkingId },
      attributes: ["identityCard"],
      raw: true,
    });
    const users = await User.findAll({
      where: {
        identityCard: usersId.map((user) => user.identityCard),
      },
      attributes: ["identityCard", "userName"],
      raw: true,
    });
    res.status(201).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const monthlyUserReservations = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const usersByMonth = [];
    for (const [i, month] of months.entries()) {
      const usersId = await Reservations.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(`${currentYear}-${i + 1}-01`),
              new Date(`${currentYear}-${i + 1}-31`),
            ],
          },
        },
        attributes: ["identityCard"],
      });
      const users = await User.findAll({
        where: {
          identityCard: usersId.map((user) => user.identityCard),
        },
        attributes: ["identityCard", "bookings"],
        raw: true,
      });
      usersByMonth.push({ month, users });
    }
    res.status(201).json({ usersByMonth });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
