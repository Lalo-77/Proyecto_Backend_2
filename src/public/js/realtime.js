const socket = io(); 

//cliente
let enviodeproductos = [];  

socket.on("enviodeproductos", (obj) => {
  updateProductList(obj);
})

socket.on("enviodeproductos", (obj) => {  
  enviodeproductos = obj; 
  updateProductList(enviodeproductos);   
}); 
socket.on("addProduct", async (productData) => {  
  try {  
      await productsManager.addProduct(  
          productData.title,  
          productData.description,  
          productData.stock,  
          productData.category,  
          productData.price,  
          productData.code,
          productData.thumbnail,  
      );  
  } catch (error) {  
      console.error(`Error al agregar producto: ${error.message}`);  
  }  
});
function updateProductList(productList) {  
  const productosHome = document.getElementById("list-products");  
  let productosHTML = "";  

  productList.forEach((product) => {  
    productosHTML += `<div class="card">  
        <div class="card-header"> code: ${product.code}</div>  
        <div class="card-body">  
            <h4>${product.title}</h4>  
            <p class="card-text">  
            <ul>  
            <li>title: ${product.title}</li>  
            <li>description: ${product.description}</li>  
            <li>stock: ${product.stock}</li>  
            <li>category: ${product.category}</li>  
            <li>price: ${product.price}</li>
            <li>code: ${product.code}</li>
            <li>thumbnail: <img src="${product.thumbnail}"></li>  
            </ul>  
            </p>  
            </div>  
            <div>  
            <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>  
            </div>  
        </div>  
    </div>`;  
  });  

  productosHome.innerHTML = productosHTML;  
}  

let form = document.getElementById("formProduct");  
form.addEventListener("submit", (evt) => {  
  evt.preventDefault();  

  let title = form.elements.title.value;  
  let description = form.elements.description.value;  
  let stock = form.elements.stock.value;
  let category = form.elements.category.value;  
  let price = form.elements.price.value;  
  let code = form.elements.code.value;
  let thumbnail = form.elements.thumbnail.value;  

  socket.emit("addProduct", {  
    title,  
    description,  
    stock,  
    category,  
    price,  
    code,
    thumbnail,  
  });  

  form.reset();  
});  
 
document.getElementById("delete-btn").addEventListener("click", function () {  
  const deleteIdInput = document.getElementById("id-prod");  
  const deleteId = parseInt(deleteIdInput.value);  
  socket.emit("deleteProduct", deleteId);  
  deleteIdInput.value = "";  
});  
   
function deleteProduct(productId) {  
  socket.emit("deleteProduct", productId);  
}