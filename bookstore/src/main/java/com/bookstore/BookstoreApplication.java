package com.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BookstoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookstoreApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "home page.";
	}

	@PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
	@GetMapping("/user")
	public String user() {
		return "user page.";

	}

	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/admin")
	public String admin() {
		return "admin page.";
	}

}
