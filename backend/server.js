import express from 'express'
import prisma from './database/db.js'

const app = express()

app.get('/test', async (req, res) => {
  const data = await prisma.users.findMany()
  res.json(data)
})

app.listen(3000, () => {
  console.log('Server running...')
})