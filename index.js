









// import express from "express";
// import { MongoClient } from "mongodb";
// import cors from "cors";
// import "dotenv/config";

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const client = new MongoClient(process.env.MONGODB_URI);

// let booksCollection;

// async function connectDB() {
//     try {
//         await client.connect();

//         const db = client.db("library");

//         booksCollection = db.collection("books");

//         console.log("MongoDB connected successfully!");
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         process.exit(1);
//     }
// }

// // Home API
// app.get("/", (req, res) => {
//     res.send("BookNook API is running!");
// });

// // GET all books from MongoDB
// app.get("/books", async (req, res) => {
//     try {
//         const books = await booksCollection
//             .find({})
//             .sort({ createdAt: -1 })
//             .toArray();

//         res.status(200).json({
//             success: true,
//             totalBooks: books.length,
//             books: books,
//         });

//     } catch (error) {
//         console.error("Error fetching books:", error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch books",
//         });
//     }
// });

// // Start server
// async function startServer() {
//     await connectDB();

//     app.listen(PORT, () => {
//         console.log(`Server running at http://localhost:${PORT}`);
//     });
// }

// startServer();





import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

let booksCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();

    const db = client.db("library");

    booksCollection = db.collection("books");

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Home API
app.get("/", (req, res) => {
  res.send("BookNook API is running!");
});

// GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await booksCollection
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      totalBooks: books.length,
      books,
    });

  } catch (error) {
    console.error("Error fetching books:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
});

// Start server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
