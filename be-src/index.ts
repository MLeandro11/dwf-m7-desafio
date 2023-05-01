import * as path from "path"
import * as express from "express"
import * as cors from "cors"
import * as jwt from "jsonwebtoken"
import { getDataUser, getMyReports, getOneReport, reportMyPet, updateDataUser, updateReport, verifyEmail, deleteReport } from "./controllers/user.controller"
import { signup, SECRET, signin } from "./controllers/auth.controller";
import { lostPets } from "./controllers/pet.controller"
import { createReport, getReports } from "./controllers/report.controller"

const ruta = path.resolve(__dirname, "../dist");
const port = process.env.PORT || 4000

const app = express()
app.use(cors({
  origin: "*",
}))
app.use(express.json({
  limit: "50mb",
  extended: true,
}))


function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1]
  try {
    const data = jwt.verify(token, SECRET);
    req._user = data
    next()
  } catch (e) {
    res.status(401).json({ error: true })
  }
}

//signup
app.post('/auth', async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "falta el body"
    })
  }
  try {
    const auth = await signup(req.body)
    res.status(200).json(auth)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

//signin
app.post('/auth/token', async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "falta el body"
    })
  }
  try {
    const token = await signin(req.body)
    res.status(200).json({ token })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})
// verificar email
app.get('/users/email/:email', async (req, res) => {
  const email = req.params.email
  if (!email) {
    res.status(400).json({
      message: "falta email"
    })
  }
  try {
    const exists = await verifyEmail(email)
    res.status(200).json({ exists: !!exists })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})
// obtener data usuario
app.get('/me', authMiddleware, async (req, res) => {
  if (!req._user.user_id) {
    res.status(400).json({
      message: "falta el id"
    })
  }
  try {
    const user = await getDataUser(req._user.user_id)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})
// actualizar data usuario 
app.put('/me', authMiddleware, async (req, res) => {
  if (!req._user.user_id) {
    res.status(400).json({
      message: "falta el id"
    })
  }
  try {
    await updateDataUser(req._user.user_id, req.body)
    res.status(200).json({
      message: "datos actualizados"
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

//reportar mi mascota perdida
app.post('/me/reports', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  if (!req.body && !userId) {
    res.status(400).json({
      message: "error"
    })
  }
  try {
    const petReport = await reportMyPet(userId, req.body)
    res.status(200).json({
      message: 'mascota reportada'
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

// obtener mis reportes de mascotas
app.get('/me/reports', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  if (!userId) {
    res.status(400).json({
      message: "error"
    })
  }
  try {
    const myReports = await getMyReports(userId)
    res.status(200).json(myReports)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

//obtener un report
app.get('/me/reports/:id', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  const petId = req.params.id
  if (!userId && !petId) {
    res.status(400).json({
      message: "error"
    })
  }
  try {
    const myReport = await getOneReport(userId, petId)
    res.status(200).json(myReport)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

//actualizar mi report 
app.put('/me/reports/:id', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  const petId = req.params.id
  if (!req.body && !userId) {
    res.status(400).json({
      message: "error"
    })
  }
  try {
    await updateReport(userId, petId, req.body)
    res.status(200).json({
      message: 'update report'
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})
// eliminar mi report
app.delete('/me/reports/:id', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  const petId = req.params.id
  if (!userId && !petId) {
    res.status(400).json({
      message: "error"
    })
  }
  try {
    await deleteReport(userId, petId)
    res.status(200).json({
      message: 'delete report'
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})
// crear un reporte
app.post('/reports', async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "error body"
    })
  }
  try {
    await createReport(req.body)
    res.status(200).json({
      message: 'reporte creado'
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})
// todos los reportes creados
app.get('/reports', async (req, res) => {
  try {
    const reports = await getReports()
    res.status(200).json(reports)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

// obtener mascotas cercanas
app.get('/mascotas-cerca-de', async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "falta el body"
    })
  }
  try {
    const pets = await lostPets(req.query)
    res.status(200).json(pets)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.get('/*', express.static(ruta))
app.get('/*', function (req, res) {
  res.sendFile(ruta + "/index.html")
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
