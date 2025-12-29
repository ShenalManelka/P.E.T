import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path" // Import path
import { fileURLToPath } from "url" // Required for ES modules
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"

// Set up __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// --- ADD THIS LINE TO SERVE UPLOADED IMAGES ---
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})