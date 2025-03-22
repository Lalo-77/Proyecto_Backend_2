import ProductsManager from "../managers/ProductsManager.js";
import __dirname from "../utils.js";

const PM = new ProductsManager(__dirname + "/files/products.json");  

const socketProducts = (socketServer) => {  
    socketServer.on("connection", async (socket) => {  
        console.log("Cliente conectado con el ID:", socket.id);  
        
        try {  
            const listadeproductos = await PM.getProducts();  
            socket.emit("enviodeproductos", listadeproductos); 
        } catch (error) {  
            console.error("Error al obtener productos:", error);  
        }  
        
            socket.on("addProduct", async (obj) => {  
            try {  
                await PM.addProduct(obj);  
                const updatedList = await PM.getProducts();  
                socketServer.emit("enviodeproductos", updatedList);
                console.log(updatedList);  
            } catch (error) {  
                console.error("Error al agregar producto:", error);  
            }  
        }); 
        socket.on("deleteProduct", async (id) => {  
            try {  
                await PM.deleteProduct(id);  
                const updatedList = await PM.getProducts();  
                socketServer.emit("enviodeproductos", updatedList); 
            } catch (error) {  
                console.error("Error al eliminar producto:", error);  
            }  
        });  
    });  
}; 

export default socketProducts;