import { Router } from "express";
import _dirname from "../utils.js";
import ProductsManager from "../managers/ProductsManager.js";
import productoModel from "../models/producto.model.js";

const PM = new ProductsManager(_dirname + "/files/products.json");  

const router = Router();

router.get("/", async (req, res) => {
    try {
        const listadeproductos = await PM.getProducts();

        res.render("home", { listadeproductos });
    } catch (error) {
        console.error("Error en cargar los productos:", error);
        res.status(500).send("Error interno");
    }
});

router.get('/carts/:cid', async (req, res) => {  
    const cartId = req.params.cid;  
    try {  
        
        const cart = await cart.findById(cartId).populate('products');  
        if (!cart) {  
            return res.status(404).send('Carrito no encontrado');  
        }  
        res.render('cart', { products: cart.products }); 
    } catch (error) {  
        console.error(error);  
        res.status(500).send('Hubo un error al obtener el carrito');  
    }  
});  

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/errorRegistro", (req, res) => {
    res.render("errorRegistro");
});

router.get("/errorLogin", (req, res) => {
    res.render("errorLogin");
});

router.get("/profile", (req, res)=> {
    res.render("profile");
    console.log(req.session);
    
})

router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
})

router.get("/products", async (req, res) =>{
    const { page = 1 } = req.query;
    const {  docs, hasPrevPage, prevPage, hasNextPage, nextPage, totalPages } = await productoModel.paginate({}, {limit:5, page: page})
    res.render("products", {docs, hasPrevPage, prevPage, hasNextPage, nextPage, totalPages});
});

export default router;