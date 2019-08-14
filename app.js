class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    // Create tr element
    const row = document.createElement("tr");

    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  // Custom alert because professional

  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    // Insert into dom
    const parent = document.querySelector(".container");
    const child = document.querySelector("#book-form");

    parent.insertBefore(div, child);

    // Disappear after 3 seconds
    setTimeout(function() {
      document.querySelector(".alert ").remove();
    }, 3000);
  }

  deleteBook(target) {
    console.log(target);

    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Local storage class

// The static keyword defines a static method for a class. Static methods aren't called on
// instances of the class. Instead, they're called on the class itself. These are often utility
// functions, such as functions to create or clone objects.

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new UI();

      // Add book to UI
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    // Need something unique in the UI to remove.
    const books = Store.getBooks();

    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOM load event

document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event listener for addbookl

// Add book to list w/ validation checks/alert boxes.
document.getElementById("book-form").addEventListener("submit", function(e) {
  //   Get form values

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // Instantiate book object

  const book = new Book(title, author, isbn);

  //   Instantiate UI object

  const ui = new UI();

  if (title === "" || author === "" || isbn === "") {
    // Error alert div
    ui.showAlert("Please fill in all fields", "error");
  } else {
    ui.addBookToList(book);

    // Add book to local storage

    Store.addBook(book);

    ui.clearFields();

    ui.showAlert("Book added!", "success");
  }

  e.preventDefault();
});

// Event listener for delete - need delegation b/c dynamic!

document.getElementById("book-list").addEventListener("click", function(e) {
  // Target the delete class and delete

  const ui = new UI();

  ui.deleteBook(e.target);

  //   Remove book from local storage (grabbing isbn#)

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert("Book deleted!", "success");
});
