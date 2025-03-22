import { Router } from "express";
import productoModel from "../models/producto.model.js";
import { authRole } from "../middlewares/auth.middleware.js"; // 🔹 Importamos el middleware
import passport from "passport";
const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, query = "", sort } = req.query;

  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: sort === "desc" ? { price: -1 } : { price: 1 },
  };

  let filter = {};
  if (query) {
    filter.category = query;
  }

  try {
    const result = await productoModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort || ""}&query=${query}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort || ""}&query=${query}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productoModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/",
    passport.authenticate("jwt", { session: false }),
    authRole(["admin"]),  
    async (req, res) => {
        try {
            const { title, description, price, category, code  } = req.body;
            const newProduct = await productoModel.create({ title, description, price, category, code });
            res.status(201).json({ status: "success", message: "Producto agregado", product: newProduct });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
});

router.put("/:productId", authRole(["admin"]), async (req, res) => {
  try {
    const updatedProduct = await productoModel.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    res.json({ message: "✅ Producto actualizado", updatedProduct });
  } catch (error) {
    res.status(400).json({ message: "❌ Error al actualizar el producto", error });
  }
});

router.delete("/:productId", authRole(["admin"]), async (req, res) => {
  try {
    await productoModel.findByIdAndDelete(req.params.productId);
    res.json({ message: "✅ Producto eliminado con éxito" });
  } catch (error) {
    res.status(400).json({ message: "❌ Error al eliminar el producto", error });
  }
});

export default router;
