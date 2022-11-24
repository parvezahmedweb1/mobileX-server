const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// ? middle ware
app.use(cors());
app.use(express.json());
// ? db connected
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbConnected = async () => {
  try {
    await client.connect();
    console.log("Database Connected...");
  } catch (error) {
    console.log("Database Error", error.message);
  }
};
dbConnected();
// ? db collection
const Categories = client.db("MobileX").collection("Categories");
// ? get the all categories
app.get("/categories", async (req, res) => {
  try {
    const result = await Categories.find({}).toArray();
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: "Can't found the Categories!!!",
    });
  }
});

// !-------------------------------------------------------------
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "MobileX Server is Running...",
  });
});
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
