import { Employee } from "../models/Employee.js";
import SHA1 from "crypto-js/sha1.js";
import jwt from "jsonwebtoken";
import { generateRandomPassword } from "../util.js";
import sgMail from "@sendgrid/mail";

export const employeeRegister = async (req, res) => {
  try {
    const { firstName, lastName, identityCard, email, parkingId } = req.body;
    const existingUser = await Employee.findByPk(identityCard);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Ya existe un empleado con la cedula de ciudadania" });
    }

    // Crear hash de la contraseña
    const password = generateRandomPassword();

    console.log(password);

    const hashedPassword = SHA1(password).toString();

    const employee = await Employee.create({
      firstName,
      lastName,
      identityCard,
      parkingId,
      email,
      password: hashedPassword,
    });

    // Enviar la contraseña por correo electrónico
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: employee.email,
      from: "parkud.udcode@outlook.com", // Reemplaza con tu dirección de correo electrónico
      subject: "Contraseña empleado",
      text: `Hola, tu contraseña para empleado es: ${password}`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res
      .status(201)
      .json({ message: "Empleado creado correctamente", employee: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(201).json({ employees: employees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getEmployeeById = async (req, res) => {
  const { identityCard } = req.params;
  try {
    const employee = await Employee.findByPk(identityCard);
    res.status(201).json({ employee: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateEmployee = async (req, res) => {
  const { identityCard } = req.params;
  const { firstName, lastName, email, password, parkingId } = req.body;
  hashedPassword = SHA1(password);
  try {
    const employee = await Employee.findByPk(identityCard);
    employee.set({
      firstName,
      lastName,
      identityCard,
      parkingId,
      email,
      password: hashedPassword,
    });
    await employee.save();
    res.status(200).json({ employee: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteEmployee = async (req, res) => {
  const { identityCard } = req.params;
  try {
    const employee = await Employee.findByPk(identityCard);
    await employee.destroy();
    res.status(200).json({ message: "Empleado eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const employeeLogin = async (req, res) => {
  try {
    const { identityCard, password } = req.body;

    // Verificar si el usuario existe
    const employee = await Employee.findByPk(identityCard);
    if (!employee) {
      return res.status(401).json({ message: "No existe el empleado." });
    }

    // Generar el hash SHA-1 de la contraseña ingresada
    const hashedPassword = SHA1(password).toString();

    // Verificar la contraseña
    if (hashedPassword !== employee.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { employeeId: employee.identityCard },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Enviar la respuesta con el token
    res.status(200).json({ employee, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
