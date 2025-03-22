import CartModel from "../models/carts.model.js";

class CartDao {
    async create() {
        const nuevoCarrito = new CartModel();
        return await nuevoCarrito.save();
    }
}

export default new CartDao();