require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDb = require('./db')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const app = express()
const port = 3000


connectDb()

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.ORIGIN,
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})