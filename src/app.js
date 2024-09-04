import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useRouter from './routes/user.router.js'
const app = express();

app.use(cors({
    origin:process.env.CROS_ORIGIN
}))
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded());
app.use(cookieParser())

app.use('/api/v1/user',useRouter)

export {app}