import fs from "fs";

class ProductsManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.codeId = 0;
    this.loadProducts();  
  }

     
    loadProducts() {  
      if (fs.existsSync(this.path)) {  
          const data = fs.readFileSync(this.path, 'utf-8');  
          try {  
              this.products = JSON.parse(data);  
          } catch (error) {  
              console.error("Error al parsear JSON:", error);  
              this.products = []; 
          }  
          this.codeId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 0; // Asigna nuevo ID  
      }  
  }

 
  getProducts = async () => {
    try {
     
      if (fs.existsSync(this.path)) {
      
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
          return productlistJs;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
};
  getProductbyId = async (id) => {
    try {
      const {pid}=id
      if (fs.existsSync(this.path)) {
        const allproducts = await this.getProducts({});
        const found = allproducts.find((element) => element.id === parseInt(pid));
        if (found) {
          return found;
        } else {
          throw new Error("Producto no existe");
        }
      } else {
        throw new Error("Product file not found");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        const counter = productlistJs.length;
        if (counter == 0) {
          return 1;
        } else {
          return productlistJs[counter - 1].id + 1;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  async addProduct(title, description, stock, thumbnail, category, price, code) {  
    if (!title || !description || !stock || !thumbnail || category ||price || !code) {
      throw new Error("INGRESE TODOS LOS DATOS DEL PRODUCTO");
    } 
      if (this.products.some(product => product.code === code)) {
        throw new error("EL CODIGO DEL PRODUCTO QUE DESEA AGREGAR ES REPETIDO");
      }
        const product = {
          id: this.codeId++,
          title,
          description,
          stock,
          thumbnail,
          category,
          price,
          code,
        };

        this.products.push(product);
        await this.save.Products();
  };

  updateProduct = async (id,obj) => {
    const {pid}=id
    const {title, description, stock, thumbnail, category, price, code,}=obj
         if(title===undefined || description===undefined || price===undefined || category===undefined || status===undefined || code===undefined||stock===undefined){
      console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO PARA SU ACTUALIZACION");
      return;
    } else {
      const listadoProductos = await this.getProducts({});
      const codigorepetido = listadoProductos.find( (i) => i.code === code);
      if (codigorepetido) {
        console.error(
          "EL CODIGO DEL PRODUCTO QUE DESEA ACTUALIZAR ES REPETIDO"
        );
        return;
      } else {
        const listadoProductos = await this.getProducts({});
        const newProductsList = listadoProductos.map((elemento) => {
          if (elemento.id === parseInt(pid)) {
                    const updatedProduct = {
                      ...elemento,
                      title,
                      description,
                      stock,
                      thumbnail,
                      category,
                      price,
                      code,
                    };
            return updatedProduct;
          } else {
            return elemento;
          }
        });
        await fs.promises.writeFile(this.path,JSON.stringify(newProductsList, null, 2));
     
      }
    }
  };

  deleteProduct = async (id) => {
    const allproducts = await this.getProducts({});
    const productswithoutfound = allproducts.filter(
 (elemento) => elemento.id !==  parseInt(id)
    );
    await fs.promises.writeFile(this.path,JSON.stringify(productswithoutfound, null, 2)
    );
      return "Producto Eliminado"

  };
}

export default ProductsManager;