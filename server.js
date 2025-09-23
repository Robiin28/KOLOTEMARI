const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const express=require('express');
const app=require('./app');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
process.on('uncaughtException', (err) => {
    // console.log(err);
    console.log(err.name, err.message);
    console.log("uncaught exception occurred ! Shutting down...");
    process.exit(1);
})
mongoose.connect(process.env.CONN_STR,{

}).then((conn)=>{
    console.log("database Connected");
})

const port = process.env.PORT || 5000;
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
process.on('unhandledRejection', (err) => {

    console.log(err.name, err.message);
    console.log("unhandled rejection occurred ! Shutting down...");
    server.close();
    process.exit(1);
})