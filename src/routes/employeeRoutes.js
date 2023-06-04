import { Router } from "express";
import {
  employeeRegister,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  employeeLogin,
} from "../controllers/employeeController.js";

const router = Router();

router.post("/employee/register", employeeRegister);
router.get("/employee/getEmployees", getEmployees);
router.post("/employee/update/:identityCard", updateEmployee);
router.post("/employee/delete/:identityCard", deleteEmployee);
router.get("/employee/:identityCard", getEmployeeById);
router.post("/employee/login", employeeLogin);

export default router;
