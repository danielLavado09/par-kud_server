import { Router } from "express";
import { employeeRegister, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, employeeLogin, getByParkingId } from "../controllers/employeeController.js";

const router = Router();

router.post("/employees/register", employeeRegister);
router.get("/employees/getEmployees", getEmployees)
router.post("/employess/update/:identityCard", updateEmployee)
router.post("/employess/delete/:identityCard", deleteEmployee);
router.get("/employees/:identityCard", getEmployeeById);
router.post("/employee/login", employeeLogin)
router.get("/employee/getByParkingId/:parkingId", getByParkingId)

export default router;
