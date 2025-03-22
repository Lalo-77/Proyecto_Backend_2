import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schemaProduct = new mongoose.Schema({  
    title: {  
        type: String,
        index: true,  
        required: true,  
        unique: true
    },
    description: {
       type: String,
       required: true
    },
    price: {  
        type: Number,  
        required: true,  
        min: 0 
    },  
    category: {  
        type: String,  
        required: true  
    },  
    code: {  
        type: Number,  
        required: true   
    },
});

schemaProduct.plugin(mongoosePaginate);

const productoModel = mongoose.model(collection, schemaProduct);
export default productoModel;  