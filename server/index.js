const PORT = 5000

const express = require('express')
const app = express()


app.use(express.json())
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})