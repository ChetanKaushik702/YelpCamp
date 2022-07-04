const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render('home');
})

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})