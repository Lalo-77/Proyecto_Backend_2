const ProductoModel = require('../models/Product'); 

class ProductsService {  
    static async getPaginatedProducts(page, limit) {  
        const options = {  
            page,  
            limit,  
        };  

        const products = await ProductoModel.paginate({}, options); 
        return {  
            products: products.docs,  
            totalProducts: products.totalDocs,  
        };  
    }  
}  

module.exports = ProductsService;