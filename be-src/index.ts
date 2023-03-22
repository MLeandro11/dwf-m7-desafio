import * as path from "path"
import * as express from "express"
import * as cors from "cors"
import * as jwt from "jsonwebtoken"
import { getDataUser, getMyReports, getOneReport, reportMyPet, updateDataUser, updateReport, verifyEmail, deleteReport } from "./controllers/user.controller"
import { signup, SECRET, signin } from "./controllers/auth.controller";
import { lostPets } from "./controllers/pet.controller"
import { createReport, getReports } from "./controllers/report.controller"
import { sequelize } from "./models/conn"

const ruta = path.resolve(__dirname, "../dist");
const port = process.env.PORT || 4000

const app = express()
app.use(cors())
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
  const auth = await signup(req.body)
  res.json(auth)
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
    res.json({ token })
  } catch (error) {
    throw console.error("error", error);
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
  const exists = await verifyEmail(email)
  res.json({ exists: !!exists })
})
// obtener mi data
app.get('/me', authMiddleware, async (req, res) => {
  if (!req._user.user_id) {
    res.status(400).json({
      message: "falta el id"
    })
  }
  const user = await getDataUser(req._user.user_id)
  res.json(user)
})
// actualizar mi data ****resolver****
app.put('/me', authMiddleware, async (req, res) => {
  if (!req._user.user_id) {
    res.status(400).json({
      message: "falta el id"
    })
  }
  await updateDataUser(req._user.user_id, req.body)
  res.json({
    message: "datos actualizados"
  })
})

//reportar mi mascota perdida
app.post('/me/reports', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  if (!req.body && !userId) {
    res.status(400).json({
      message: "error"
    })
  }
  const petReport = await reportMyPet(userId, req.body)
  res.json({
    message: 'mascota reportada'
  })
})

// obtener mis reportes de mascotas
app.get('/me/reports', authMiddleware, async (req, res) => {
  const myReports = await getMyReports(req._user.user_id)
  res.json(myReports)
})

//obtener un report
app.get('/me/reports/:id', authMiddleware, async (req, res) => {
  const myReport = await getOneReport(req._user.user_id, req.params.id)
  res.json(myReport)
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
  await updateReport(userId, petId, req.body)
  res.json({
    message: 'update report'
  })
})
// eliminar mi report
app.delete('/me/reports/:id', authMiddleware, async (req, res) => {
  const userId = req._user.user_id
  const petId = req.params.id
  if (!userId) {
    res.status(400).json({
      message: "error"
    })
  }
  await deleteReport(userId, petId)
  res.json({
    message: 'delete report'
  })
})
// crear un reporte
app.post('/reports', async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "error body"
    })
  }
  const report = await createReport(req.body)
  res.json({
    message: 'reporte creado'
  })
})
// todos los reportes creados
app.get('/reports', async (req, res) => {
  const reports = await getReports()
  res.json(reports)
})

// obtener mascotas cercanas
app.get('/mascotas-cerca-de', async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "falta el body"
    })
  }
  const pets = await lostPets(req.query)

  res.json(pets)
})

app.get('/*', express.static(ruta))
app.get('/*', function (req, res) {
  res.sendFile(ruta + "/index.html")
})



async function main() {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
  /* await sequelize.sync({ force: true }) */

}
main()