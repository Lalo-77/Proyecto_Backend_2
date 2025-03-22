import CartDao from "../dao/cart.dao.js";

class CartRepository {
    async createcart()  {
         return await CartDao.create();
    }
}


export default new CartRepository();