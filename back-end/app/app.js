const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

require("./routes/common.routes")(app);

const URL = "http://localhost:";
const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port : ${PORT}`);
});
