const express = require('express')
const cors = require("cors");
const app = express()
const port = 3000
const connecToMongo = require('./db')

connecToMongo();
app.options('*', cors())
app.use(cors({
  origin: '*'
}));
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})