
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

### Conclusion

Using **Request DTOs** with a `toEntity()` method and **Response DTOs** with a `fromEntity()` static method is a good practice to decouple the internal structure of your entity models from the external representation of your API. This separation makes your code more maintainable, testable, and scalable.

- **Request DTO**: Validates and transforms client data into an entity.
- **Response DTO**: Presents a simplified, read-only version of your entity to the client, using a static method for conversion.

