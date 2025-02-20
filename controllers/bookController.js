const Book = require("../models/Book");

// Search & Filter Books
exports.searchBooks = async (req, res) => {
    try {
      const { search, filter } = req.body;
      let query = {};
  
      if (search) {
        query.title = { $regex: search, $options: "i" }; // Case-insensitive search
      }
      if (filter === "author") {
        query.author = { $regex: search, $options: "i" };
      }
      if (filter === "department") {
        query.department = { $regex: search, $options: "i" };
      }
  
      const books = await Book.find(query);
      res.render("books", { books, user: req.user });
    } catch (err) {
      res.status(500).send("Error searching books");
    }
  };

  exports.getAddBook = (req, res) => {
    res.render("addBook");
  };
  
  // 📝 Handle Adding a New Book with Cover Image
  exports.postAddBook = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) return res.status(500).send("File upload error");
  
      try {
        const { title, author, department, price, stock, description } = req.body;
  
        const newBook = new Book({
          title,
          author,
          department,
          price,
          stock,
          description,
          coverImage: req.file ? `/uploads/${req.file.filename}` : "", // Save image path
        });
  
        await newBook.save();
        res.redirect("/books"); // Redirect to book list
      } catch (err) {
        res.status(500).send("Error adding book");
      }
    });
  };
  
  module.exports = { getAddBook, postAddBook };