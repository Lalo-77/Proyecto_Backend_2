import { userDao } from "../dao/user.dao.js";
import { createHash, isValidPassword } from "../utils/validar.js";
import jwt from "jsonwebtoken";

class UserController {
  static async register(req, res) {
    try {
      const { first_name, last_name, email, password, age, role } = req.body;
      if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
      }

      const userExists = await userDao.getByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }

      const newUser = await userDao.register({
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        role: role || "usuario",
      });

      res.status(201).json({ message: "✅ Usuario registrado con éxito", user: newUser });
    } catch (error) {
      res.status(500).json({ error: "❌ Error en el registro", details: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
      }

      const user = await userDao.getByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (!isValidPassword(password, user.password)) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ message: "✅ Login exitoso", token });
    } catch (error) {
      res.status(500).json({ error: "❌ Error en el login", details: error.message });
    }
  }

  static async current(req, res) {
    res.json({ user: req.user });
  }

  static async logout(req, res) {
    req.logout();
    res.json({ message: "✅ Logout exitoso" });
  }

  static async admin(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    res.json({ message: "Bienvenido Admin" });
  }
}

export default UserController;
