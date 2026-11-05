// import express from "express";

// import { MongoClient } from 'mongodb';
// import cors from 'cors';
// import 'dotenv/config'

// const app = express()

// const PORT = 5000

// app.use(cors())


// const client = new MongoClient(process.env.MONGODB_URI);
// export async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log("You successfully connected to MongoDB!");
//     return client;
//   } catch (err) {
//     console.dir(err);
//   }
// }

// connectToMongoDB();

// app.post('/add-book',(req,res) => {
//     console.log("api called ")
// res.send('book added successfully !')
// })


// app.get('/', (req, res) => {
//     res.send('server is running !')
// })  


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// })











import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI);

let booksCollection;

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME || "library");

    booksCollection = db.collection("books");

    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Add Book API
app.post("/add-book", async (req, res) => {
  try {
    console.log("API called!");

    const {
      title,
      author,
      category,
      copies,
      image,
      description,
      username,
      email,
    } = req.body;

    // Validate required fields
    if (!title || !author || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, author and category are required",
      });
    }

    // Create book object
    const bookData = {
      title,
      author,
      category,
      copies: Number(copies),
      image,
      description,
      username,
      email,
      createdAt: new Date(),
    };

    // Save book to MongoDB
    const result = await booksCollection.insertOne(bookData);

    console.log("Book added:", result.insertedId);

    // Send JSON response
    return res.status(201).json({
      success: true,
      message: "Book added successfully!",
      insertedId: result.insertedId,
      book: bookData,
    });

  } catch (error) {
    console.error("Error adding book:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add book",
    });
  }
});

// Get All Books API
app.get("/books", async (req, res) => {
  try {
    const books = await booksCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(books);

  } catch (error) {
    console.error("Error fetching books:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
});

// Home API
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
async function startServer() {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();






