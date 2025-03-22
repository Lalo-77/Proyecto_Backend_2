import express from "express"
import { Server } from "socket.io";
import { engine } from "express-handlebars";  
import __dirname from "./utils.js"; 
import viewsRouter from "./routes/views.router.js"; 
import sessionRouter from "./routes/session.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import socketProducts from "./listeners/socketProducts.js";
import path from "path";
import productoModel from "./models/producto.model.js";
import mongoose from "mongoose";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { initMongoDB } from "./config/dbConfig.js";
import "dotenv/config";
// import "./database.js";
import apiRouter from "./routes/index.js";
import smsRouter from "./routes/sms.router.js";
import ticketRouter from "./routes/ticket.router.js";
import mailRouter from "./routes/mail.router.js";
import cartsRouter from "./routes/carts.router.js"
import connectDB from "./database.js";  

const app = express();
const PUERTO = 8080;
const HOST = "localhost";

connectDB();

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "public"));
app.use(cookieParser());
// app.use(passport.initialize());
// initializePassport();

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views"); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api", apiRouter);
app.use("/sms", smsRouter);
app.use("/tickets", ticketRouter);
app.use("/mail", mailRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PUERTO, () => {
    try {
        console.log(`Escuchando en el puerto http://${HOST}:${PUERTO}`);
   
    } catch (error) {
        console.log(error);
    }
})

const socketServer = new Server(httpServer);
socketProducts(socketServer);