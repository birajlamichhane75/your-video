import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useRouter from './routes/user.router.js'
const app = express();

app.use(cors({
    origin:process.env.CROS_ORIGIN
}))
app.use(express.json({limit:'16kb'}));  // return res.json in json format
app.use(express.urlencoded());      // return res.json in urlencoded form ( username?=name )
app.use(cookieParser())           // we can access cookie from req.cookies

app.use('/api/v1/user',useRouter)   // middleware which refer to useRouter method when /api/v1/user/../.. is called

export {app}