import { Router } from "express";
import passport from "passport";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/validar.js";
import { userDao } from "../dao/user.dao.js";
import UserController from "../controllers/User.Controller.js";
import UsuarioModel from "../models/usuarios.model.js";

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', passport.authenticate("jwt", { session: false }), UserController.current);
router.post('/logout', UserController.logout);
router.get('/admin', passport.authenticate("jwt", { session:false }), UserController.admin);



export default router;