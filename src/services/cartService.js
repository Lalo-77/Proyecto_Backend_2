import Ticket from "../models/ticket.model.js"; 
import CartModel from "../models/cart.model.js"; 
import ProductoModel from "../models/producto.model.js"; 
import { v4 as uuidv4 } from "uuid";

class CartService {
  async purchaseCart(cartId, purchaserEmail) {
    try {
      const cart = await CartModel.findById(cartId).populate("products.product");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      let productsWithoutStock = [];
      let productsToBuy = [];

      for (let item of cart.products) {
        const product = item.product;
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          productsToBuy.push(item);
        } else {
          productsWithoutStock.push({
            productId: product._id,
            title: product.title,
            stockDisponible: product.stock,
            quantityRequested: item.quantity
          });
        }
      }

      if (productsToBuy.length === 0) {
        return {
          success: false,
          message: "No hay stock suficiente para ninguno de los productos.",
          missingProducts: productsWithoutStock
        };
      }

      const totalAmount = productsToBuy.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

   
      const ticket = new Ticket({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: purchaserEmail
      });

      await ticket.save();

   
      cart.products = cart.products.filter(
        item => !productsToBuy.includes(item)
      );
      await cart.save();

      return {
        success: true,
        message: "Compra realizada con éxito",
        ticket,
        missingProducts: productsWithoutStock.length > 0 ? productsWithoutStock : null
      };

    } catch (error) {
      console.error("Error en la compra:", error);
      throw new Error(error.message);
    }
  }
}

export default new CartService();
