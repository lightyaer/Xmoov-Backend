import "./config/config";
import express from "express";
import { json } from "body-parser";
import { mongoose } from "../db/mongoose";
import driverRoutes from "./routes/user/driver";
import retailerRoutes from "./routes/user/retailer";
import salesOrderRoutes from "./routes/user/salesOrder";
import adminRoutes from "./routes/admin/admin";



var app = express();
var PORT = process.env.PORT;

app.use(json());

app.use('/admin', adminRoutes);

app.use('/drivers', driverRoutes);

app.use('/retailers', retailerRoutes);

app.use('/salesorders', salesOrderRoutes);

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}`);
})

export default {
    app
};