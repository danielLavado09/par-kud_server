import axios from "axios";
import sha1 from "sha1";
import { User } from "../models/User.js";
import { sequelize } from "../database/database.js";
import { captcha_key } from "../config.js";

const captcha_url = 'https://www.google.com/recaptcha/api/siteverify'

export async function register(req, res) {
  try{
    //Get data from request
    const {name, lastname, id, email} = req.body;
    const captchaToken = req.headers['g-recaptcha-response'];
    const captchaVerification = await verifyCaptcha(captchaToken);
    //Check valid captcha
    if (!captchaVerification){
      res.status(500).json({
        message: "Captcha error"
      })
    }
    //Generate password
    password = generatePassword()
    //Create new user
    const newUser = await User.create({
      'cc': id,
      'firstname': name,
      'lastname': lastname,
      'email': email,
      'password': sha1(password),
      'bookings': 0
    });
    //Send succes status
    console.log("New user: "+id+" "+password);
    res.status(201).json({
      message: "Usuario resgistrado exitosamente"
    })
  } catch (error){
    console.log(error)
    res.status(500).json({
      message: "Error al registrar el usuario"
    })
  }
}

export async function login(req, res){
  const {id, password} = req.body;
  const user = User.findByPk(id);
  if (user && user.password == sha1(password)){
    res.status(200).json({
      message: "Login succesful",
      token: ""
    })
  } else{
    res.status(404).json({
      message: "User/password not found"
    })
  }
}

async function verifyCaptcha(token){
  try{
    response = axios.post(captcha_url, {
      secret: captcha_key,
      response: token
    })
    return response.data.succes;
  } catch (error){
    console.log(error)
    return false;
  }
}

function verifyPassword(password){
  const hasNumber = /\d/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const lengthRange = /^.{5,8}$/;
  const validPasword = 
  hasNumber.test(password) &&
  hasUpperCase.test(password) &&
  hasLowerCase.test(password) &&
  lengthRange.test(password);
  return validPasword;
}

function generatePassword(){
  let password = "";
  const numbers = "0123456789";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  
  const getRandomCharacter = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  };
  //Generate a 9 length random password
  for (let i=0; i<3;i++){
    password+= getRandomCharacter(upperCaseLetters);
    password+= getRandomCharacter(lowerCaseLetters);
    password+= getRandomCharacter(numbers);
  }
  //Shuffle the password
  const passwordArray = password.split("");
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  //Return the first 8 characters
  password = (passwordArray.join("")).substring(0, 7);
  return password;
}