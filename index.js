const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// ? middle ware
app.use(cors());
app.use(express.json());
// ? db connected
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const Bookings = client.db("MobileX").collection("Bookings");
const Users = client.db("MobileX").collection("Users");

// ? add product
app.post("/addProduct", async (req, res) => {
  try {
    const product = req.body;
    const result = await Products.insertOne(product);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? get seller add products
app.get("/seller/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const filter = { email: email };
    const result = await Products.find(filter).toArray();
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? admin user
app.get("/users/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email };
    const user = await Users.findOne(query);
    res.send({ isAdmin: user?.role === "admin" });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? seller user
app.get("/users/seller/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email };
    const user = await Users.findOne(query);
    res.send({ isSeller: user?.role === "seller" });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? buyer user
app.get("/users/buyer/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email };
    const user = await Users.findOne(query);
    res.send({ isBuyer: user?.role === "buyer" });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? get all users
app.get("/users", async (req, res) => {
  try {
    const result = await Users.find({}).toArray();
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await Users.deleteOne(query);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? get user
app.get("/user", async (req, res) => {
  try {
    const email = req.query;
    console.log(email);
    const filter = { email: email };
    const result = await Users.findOne(filter);
    console.log(result);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// ? put user
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
// ? user booking
app.post("/bookings", async (req, res) => {
  try {
    const booking = req.body;
    const result = await Bookings.insertOne(booking);
    res.send(result);
  } catch (error) {
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
