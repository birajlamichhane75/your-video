import dotenv from 'dotenv';
import { connectDB } from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server listining on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Fail to connect Database ${err}`);
})

// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.error("Db connection failed");
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`Listining to port ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.log(`Failed to connect ${error}`);   
//         process.exit(1);
//     }
// })()