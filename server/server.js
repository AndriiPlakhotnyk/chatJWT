import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import pg from 'pg'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import http from 'http'
import WebSocket, {WebSocketServer} from 'ws'
import 'dotenv/config'
import { log } from 'console'


const port = process.env.PORT || 3001
const Pool = pg.Pool
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}))
const server = http.createServer(app)
const webSocketServer = new WebSocketServer({server})
// console.log("WebSocketServer: ", webSocketServer)

webSocketServer.on('connection', ws => {

    ws.on("error", e => ws.send(e))
    ws.send('Hi there, I am a WebSocket server')
})
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const login = async (username, password) => {
    const sql = `SELECT * FROM "user" WHERE "username" = ($1)`
    const result = await pool.query(sql, [username]) 
    console.log('result.rows[0]: ', result.rows[0])
    let user = null
    if(!result.rows[0]){
        user = await createUser(username, password)
    } else {
        user = result.rows[0]
        const succes = await bcrypt.compare(password.toString(), user.password) 

        if(!succes) {
            return {
                success: false,
                result: [],
                errors: ['Unauthorized'],
            }
        }
    }
    
    const token = jwt.sign({username: user.username}, process.env.JWT , {expiresIn: '1d'})
    
    return {
        success: false,
        result: [{token}],
        errors: ['Unauthorized'],
    }
}

const createUser = async (username, password) => {
    const sql = `INSERT INTO "user" ("username", "password") VALUES ($1, $2) RETURNING "username", "password"`
    
    const hash = await bcrypt.hash(password.toString(), Number(process.env.SALT))

    const values = [
        username,
        hash,
    ]
    
    const result = await pool.query(sql, values)

    return result.rows[0]
}

const verifyUser = async (req, res, next) => {
    const token = JSON.parse(req.headers.token).token
    console.log("VERIFYYYYYY: ", token)
    if(!token) {
        return res.status(401).json({
            success: false,
            result: [],
            errors: ["Unauthorized"] 
        })
    } else {
        jwt.verify(token, process.env.JWT, (err, decoded) => {
            if(err) {
                return res.status(500).json({
                    success: false,
                    result: [],
                    errors: ["Problem with verify:" , err]
                })
            } else {
                req.username = decoded.username
                console.log("decoded: ", decoded)
                console.log("success")
                next()
            }
        })
    }
}

app.get('/home', verifyUser, (req, res) => {
    console.log("username: ", req.username)
    return res.status(200).json({
        success: true,
        result: [req.username],
        errors: [],
    })
})



app.post('/', async (req, res) => {
      
    try {
        const data = await login(req.body.username, req.body.password)
        return res.json(data)
    } catch (error) {
        console.log("Internal server error: ", error)
        return res.status(500).json({
            success: false,
            result: [],
            errors: ["Internal server error"]
        })
    }
})

server.listen(port, () => {
    console.log("Running...", port)
})

// app.post('/register', async (req, res) => {
//     try{
//         const sql = `INSERT INTO "user" ("username", "password") VALUES ($1, $2)`
    
//         const hash = await bcrypt.hash(req.body.password.toString(), Number(process.env.SALT))

//         const values = [
//             req.body.username,
//             hash
//         ]
    
//         await pool.query(sql, values)
//         return res.status(201).json({
//             success: true,
//             result: [],
//             errors: []
//         })
//     } catch (error) {
//         console.log("/register", error)
        
//         return res.status(500).json({
//             success: false,
//             result: [],
//             errors: ["Internal server error"]
//         })
//     } 
// })

// app.post('/', async (req, res) => {
//     try {
//         const sql = `SELECT * FROM "user" WHERE "username" = ($1)`
//         const result = await pool.query(sql, [req.body.username]) 
//         await bcrypt.compare(req.body.password.toString(), result.rows[0].password)
//         const username = result.rows[0].username
//         const token = jwt.sign({username}, process.env.JWT , {expiresIn: '1d'})
//         return res.status(200).json({
//             success: true,
//             result: [{ token }],
//             errors: []
//         })
//     } catch (error) {
//         console.log("/login", error)
        
//         return res.status(500).json({
//             success: false,
//             result: [],
//             errors: ["Internal server error"]
//         })
//     }             
// })










// try {
    //     const token = req.cookies.token
    //     const decode = await jwt.verify(token, process.env.JWT)
    //     req.username = decode.username
    //     next()
    //     return res.status(200).json({
    //         success: true,
    //         result: [],
    //         errors: []
    // })
    // } catch (error) {
    //     return res.status(500).json({
    //         success: false,
    //         result: [],
    //         errors: ["Internal server error"]
    //     })
    // }
