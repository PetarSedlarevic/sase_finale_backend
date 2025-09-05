import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { UserService } from './services/user.service'
import { configDotenv } from 'dotenv'
import { AppDataSource } from './db'
import { UserRoute } from './routers/user.route'

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.use(UserService.verifyToken)
app.use('/api/user', UserRoute)

// app.get('/', (req, res) => {     // had to use a / because * was giving me erros 
//     res.status(404).json({
//         message: 'NOT_FOUND',
//         timestamp: new Date()
//     })
// })

configDotenv()
AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database')
        const port = process.env.SERVER_PORT || 3000
        app.listen(port, () => console.log(`Application started on port ${port}`))
    })
    .catch(e=>{
        console.log('Failed to connect to the database')
        console.log(e)
    })