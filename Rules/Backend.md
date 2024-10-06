## API Creation Rules

### 1. **Send Only HTTP Status Codes for Create, Update (PUT), and Delete**
- For `POST` (create), `PUT` (update), and `DELETE`, return only the status code (`201 Created`, `204 No Content`, etc.) without sending a body.

#### Example Code:
```java
@PostMapping("/books")
@ResponseStatus(HttpStatus.CREATED) // 201 Created
public void createBook(@RequestBody BookRequestDTO bookDTO) {
    bookService.save(bookDTO.toEntity());
}

@PutMapping("/books/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
public void updateBook(@PathVariable Long id, @RequestBody BookRequestDTO bookDTO) {
    bookService.update(id, bookDTO.toEntity());
}

@DeleteMapping("/books/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
public void deleteBook(@PathVariable Long id) {
    bookService.delete(id);
}
```

### 2. **Use DTOs for Request and Response**
- Every request body must have a **Request DTO**.
- Every response must have a **Response DTO**.

#### Example:
```java
@PostMapping("/books")
public ResponseEntity<BookResponseDTO> createBook(@RequestBody BookRequestDTO bookDTO) {
    Book savedBook = bookService.save(bookDTO.toEntity());
    return ResponseEntity.ok(BookResponseDTO.fromEntity(savedBook));
}

@GetMapping("/books/{id}")
public ResponseEntity<BookResponseDTO> getBook(@PathVariable Long id) {
    Book book = bookService.findById(id);
    return ResponseEntity.ok(BookResponseDTO.fromEntity(book));
}
```

### 3. **Error Handling**
- **Frontend-related errors**: Use status codes from `400` to `499`. Provide error codes and messages to give user-friendly feedback.
- **API errors**: Log these internally and return a generic `500 Internal Server Error` to the frontend. Don’t expose detailed error messages to users.

#### Example Error Handling Code:
```java
@RestControllerAdvice
public class ApiExceptionHandler {

    // Frontend-related error handling
    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidRequest(InvalidRequestException ex) {
        ErrorResponseDTO error = new ErrorResponseDTO("400", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST); // 400 Bad Request
    }

    // API-related error (Internal error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Void> handleInternalError(Exception ex) {
        log.error("Internal error occurred", ex); // Log error
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
    }
}
```

- **Frontend-related errors** give user feedback with a relevant message (e.g., validation errors).
- **API-related errors** are logged and return a simple `500` response to the user without exposing details.

### 4. **Documenting Endpoints in `api.md`**

For every API endpoint, add the following details to the `api.md` file:
- **Endpoint URL**: The path for the API (e.g., `/api/v1/books`).
- **Request and Response JSON structure**: Define what the request and response JSON should look like.
- **Error Response**: If there are specific errors, include the error JSON format.

#### Example `api.md` Template:
```md
### API: Create a New Book

- **Endpoint**: `POST /api/v1/books`
- **Request Body**:
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "price": 12.99,
    "stock": 100
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Book Title",
    "author": "Author Name",
    "price": 12.99,
    "stock": 100
  }
  ```
- **Possible Errors**:
  - **400 Bad Request**:
    ```json
    {
      "errorCode": "400",
      "message": "Invalid input data"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "errorCode": "500",
      "message": "Internal server error"
    }
    ```

---

### API: Delete a Book

- **Endpoint**: `DELETE /api/v1/books/{id}`
- **Response**: No content (`204 No Content`)

- **Possible Errors**:
  - **404 Not Found**:
    ```json
    {
      "errorCode": "404",
      "message": "Book not found"
    }
    ```

### 5. **Optional Rule: Use Proper Response Codes**
Ensure every operation sends the right status code:
- `201 Created` for successful resource creation.
- `204 No Content` for successful delete/update with no response body.
- `400 Bad Request` for invalid input.
- `500 Internal Server Error` for server-side issues.

---

### 6. **Template for `api.md` Documentation**

Create a consistent documentation template for each endpoint. Here's a Markdown template that team members can copy and fill in as needed:

```md
### API: [Operation Name]

- **Endpoint**: `[HTTP METHOD] /[endpoint]`
- **Description**: Describe what the endpoint does.

- **Request Body**:
  ```json
  {
    // Request fields go here
  }
  ```

- **Response**:
  ```json
  {
    // Response fields go here
  }
  ```

- **Possible Errors**:
  - **[Status Code]**: Describe the error
    ```json
    {
      "errorCode": "[errorCode]",
      "message": "[error message]"
    }
    ```


### 7. **Improving Collaboration**
- Use clear and consistent naming conventions for endpoints, request DTOs, response DTOs, and error messages.
- Document all API endpoints in a single shared `api.md` file, with all relevant details.
- Use version control to keep `api.md` up-to-date with each new feature or change.
- Use tools like Swagger to auto-generate API documentation for larger projects.

---

### Example `api.md` for Copying

```md
### API: Create a New Book

- **Endpoint**: `POST /api/v1/books`
- **Request Body**:
  ```json
  {
    "title": "Example Book",
    "author": "John Doe",
    "price": 19.99,
    "stock": 50
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Example Book",
    "author": "John Doe",
    "price": 19.99,
    "stock": 50
  }
  ```
- **Possible Errors**:
  - **400 Bad Request**:
    ```json
    {
      "errorCode": "400",
      "message": "Invalid data provided"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "errorCode": "500",
      "message": "Internal server error"
    }
    ```
    

    
---

## DTO Definition Rules

### 1. **Request DTO**:  
The Request DTO is responsible for collecting all the necessary input details required for a particular operation (e.g., creating or updating a resource). The DTO should include:
- Fields representing the necessary input data.
- Input validation annotations if necessary.
- A `toEntity()` method that converts the DTO into an entity.

#### Key Points:
- The **Request DTO** should have all necessary fields for input.
- It should include **validation** annotations (e.g., `@NotNull`, `@Size`, etc.) to ensure the correctness of the data.
- The **`toEntity()`** method should convert the DTO into its corresponding entity.

### 2. **Response DTO**:  
The Response DTO is used to return data back to the client after performing an operation. The DTO should include:
- Fields representing the required response data.
- A static method **`fromEntity()`** that converts an entity to a DTO.

#### Key Points:
- The **Response DTO** should include only fields that need to be sent to the client.
- The **`fromEntity()`** static method converts an entity into a DTO, ensuring the API response is decoupled from the internal structure.

---

## Example Implementation

### 1. **Request DTO** Example (`BookRequestDTO`)

```java
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookRequestDTO {

    @NotNull(message = "Title cannot be null")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotNull(message = "Author cannot be null")
    @Size(min = 3, max = 50, message = "Author must be between 3 and 50 characters")
    private String author;

    @NotNull(message = "Price cannot be null")
    private Double price;

    @NotNull(message = "Stock cannot be null")
    private Integer stock;

    // Getters and setters

    // Converts the DTO to a Book entity
    public Book toEntity() {
        Book book = new Book();
        book.setTitle(this.title);
        book.setAuthor(this.author);
        book.setPrice(this.price);
        book.setStock(this.stock);
        return book;
    }
}
```

### Key Points:
- This **request DTO** contains necessary fields (`title`, `author`, `price`, and `stock`) and validation annotations.
- The **`toEntity()`** method converts the `BookRequestDTO` into a `Book` entity, which is passed to the service layer for processing.

---

### 2. **Response DTO** Example (`BookResponseDTO`)

```java
public class BookResponseDTO {

    private Long id;
    private String title;
    private String author;
    private Double price;
    private Integer stock;

    // Getters and setters

    // Static method to convert an entity to a DTO
    public static BookResponseDTO fromEntity(Book book) {
        BookResponseDTO dto = new BookResponseDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPrice(book.getPrice());
        dto.setStock(book.getStock());
        return dto;
    }
}
```

### Key Points:
- The **response DTO** includes only the fields that are needed for the API response (for example, the book's `id`, `title`, `author`, `price`, and `stock`).
- The static **`fromEntity()`** method is responsible for converting a `Book` entity into a `BookResponseDTO`, thus ensuring the service layer is not directly exposing entity objects.

---

## General Rules for DTOs:

1. **Validation**:  
   Request DTOs should use validation annotations like `@NotNull`, `@Size`, `@Email`, etc., to ensure that incoming data is valid. Response DTOs do not require validation since they only represent outgoing data.

2. **Conversion Methods**:
   - **Request DTO**: Always include a `toEntity()` method to convert the DTO to its corresponding entity.
   - **Response DTO**: Use a static `fromEntity()` method to convert the entity into a response DTO. This keeps the conversion logic in one place and makes the code cleaner.

3. **Immutability** (Optional but Recommended):  
   For some use cases, especially in Response DTOs, it can be beneficial to make the DTO immutable by declaring fields as `final` and removing setters. This ensures that the data once constructed, cannot be altered.

4. **Separation of Concerns**:  
   - Request DTOs should not expose entity-specific details such as `id` fields or timestamps.
   - Response DTOs should not include unnecessary fields that were used in the request.

5. **Minimal Response**:  
   Ensure the **Response DTO** only returns the data that is required for the client. Avoid overloading responses with unnecessary fields to keep the API efficient.

---

### Full Example with Entity Class

Here’s how your entity class might look, which is used in conjunction with the DTOs:

```java
public class Book {

    private Long id;
    private String title;
    private String author;
    private Double price;
    private Integer stock;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
```

---