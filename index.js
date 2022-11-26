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
const Products = client.db("MobileX").collection("Products");
const Users = client.db("MobileX").collection("Users");
// ? all users
app.put("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await Users.updateOne(filter, updateDoc, options);
    console.log(result);
    res.send({
      status: "success",
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ? filter products
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Products.find({ categoriesId: id }).toArray();
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: "Can't found the Products!!!",
    });
  }
});
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
