import { response } from "express";
import { User } from "../models/User.js";
import axios from "axios";
import { sequelize } from "../database/database.js";

const captcha_key = require('../config.js')
const captcha_url = 'https://www.google.com/recaptcha/api/siteverify'

export async function login(req, res) {
  res.send("Hola mundo");
}

export async function register(req, res) {
  //Get data from request
  const {name, lastname, id, email} = req.body;
  const captchaToken = req.headers['g-recaptcha-response'];
  const captchaVerification = await verifyCaptcha(captchaToken)
  //Check valid captcha
  if (!captchaVerification){
    return 'Captcha error'
  }
  //Check if user already exist
  const existingUser = await User.findOne({
    where: {
      [sequelize.or]: [{id, email}]
    }
  });
  if (existingUser){
    return 'User already exist'
  }
  //Create new user
  const newUser = await User.create({
    'cc': id,
    'firstname': name,
    'lastname': lastname,
    'email': email,
    'password': '1234',
    'bookings': 0
  });
  return 'User created'
}

async function verifyCaptcha(token){
  try{
    response = axios.post(captcha_url, {
      secret: captcha_key,
      response: token
    })
    return response.data.succes;
  } catch (error){
    return false
  }
}
