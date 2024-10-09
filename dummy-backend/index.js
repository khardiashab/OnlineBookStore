const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

/**
 * Helper function for standard response format
 */
const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

// Mock data for demonstration purposes
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    provider: "local",
    oauthId: "",
    picture: "",
  },
];

let books = [
  {
    id: "book1",
    name: "Book 1",
    author: "Author 1",
    price: 19.99,
    stock: 10,
    description: "A fascinating book about...",
    image: "url_to_image",
    category: "Fiction",
  },
  {
    id: "book2",
    name: "Book 2",
    author: "Author 2",
    price: 25.99,
    stock: 5,
    description: "Another fascinating book...",
    image: "url_to_image",
    category: "Non-fiction",
  },
];

let cart = {
  userId: 1,
  totalPrice: 0,
  discount: 0,
  totalItems: 0,
  itemList: [],
};

let wishlist = {
  userId: 1,
  bookList: [],
};

/**
 * Authentication Endpoints
 */
app.post("/auth/login", (req, res) => {
  sendResponse(res, 200, "Login successful", users[0]);
});

app.post("/auth/register", (req, res) => {
  const { name, email, provider, oauthId, picture } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    provider,
    oauthId,
    picture,
  };
  users.push(newUser);
  sendResponse(res, 201, "User registered successfully", newUser);
});

/**
 * Books Endpoints
 */
app.get("/books", (req, res) => {
  sendResponse(res, 200, "Fetched all books", books);
});

app.get("/books/search", (req, res) => {
  const { name, author, category } = req.query;
  const filteredBooks = books.filter(
    (book) =>
      (name ? book.name.includes(name) : true) &&
      (author ? book.author.includes(author) : true) &&
      (category ? book.category === category : true)
  );
  sendResponse(res, 200, "Books fetched successfully", filteredBooks);
});

/**
 * Cart Endpoints
 */
app.post("/cart", (req, res) => {
  const { bookId, quantity } = req.body;
  const book = books.find((b) => b.id === bookId);

  if (book && book.stock >= quantity) {
    const cartItem = { id: cart.itemList.length + 1, quantity, book };
    cart.itemList.push(cartItem);
    cart.totalItems += quantity;
    cart.totalPrice += book.price * quantity;
    sendResponse(res, 201, "Book added to cart", cart);
  } else {
    sendResponse(res, 404, "Book not found or insufficient stock");
  }
});

app.delete("/cart/:itemId", (req, res) => {
  const { itemId } = req.params;
  const itemIndex = cart.itemList.findIndex((item) => item.id == itemId);

  if (itemIndex !== -1) {
    const removedItem = cart.itemList[itemIndex];
    cart.totalItems -= removedItem.quantity;
    cart.totalPrice -= removedItem.book.price * removedItem.quantity;
    cart.itemList.splice(itemIndex, 1);
    sendResponse(res, 200, "Item removed from cart", cart);
  } else {
    sendResponse(res, 404, "Item not found in cart");
  }
});

app.get("/cart", (req, res) => {
  sendResponse(res, 200, "Cart details fetched", cart);
});

app.post("/cart/checkout", (req, res) => {
  if (cart.itemList.length > 0) {
    sendResponse(res, 200, "Checkout successful", cart);
    cart = {
      userId: 1,
      totalPrice: 0,
      discount: 0,
      totalItems: 0,
      itemList: [],
    }; // Clear cart after checkout
  } else {
    sendResponse(res, 400, "Cart is empty");
  }
});

/**
 * Wishlist Endpoints
 */
app.post("/wishlist", (req, res) => {
  const { bookId } = req.body;
  const book = books.find((b) => b.id === bookId);

  if (book && !wishlist.bookList.find((b) => b.id === bookId)) {
    wishlist.bookList.push(book);
    sendResponse(res, 201, "Book added to wishlist", wishlist);
  } else {
    sendResponse(res, 404, "Book not found or already in wishlist");
  }
});

app.delete("/wishlist/:bookId", (req, res) => {
  const { bookId } = req.params;
  const bookIndex = wishlist.bookList.findIndex((item) => item.id == bookId);

  if (bookIndex !== -1) {
    wishlist.bookList.splice(bookIndex, 1);
    sendResponse(res, 200, "Book removed from wishlist", wishlist);
  } else {
    sendResponse(res, 404, "Book not found in wishlist");
  }
});

app.get("/wishlist", (req, res) => {
  sendResponse(res, 200, "Wishlist details fetched", wishlist);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
