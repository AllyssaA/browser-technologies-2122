const express = require("express");

const app = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", "views");

app.set(express.static("static"));

app.get("/", (req, res) => {
    res.render("home", {
        pageTitle: "Enquete | Minor Web Development"
    })
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })