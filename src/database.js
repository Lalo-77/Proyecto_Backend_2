import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const connectDB = async () => {
   const mongoURI = process.env.MONGO_URL;
  
   if (!mongoURI) {
     console.error("❌ Error: `MONGO_URL` no está definido en el archivo `.env`.");
     process.exit(1);
   }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

