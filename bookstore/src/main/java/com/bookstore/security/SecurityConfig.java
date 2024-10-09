package com.bookstore.security;

import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import com.bookstore.entities.Role;
import com.bookstore.entities.User;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable();
        http.httpBasic();
        http.sessionManagement(
                sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    UserDetailsService userDetailsService() {
        User admin = User.builder()
                .id(1L)
                .name("admin")
                .email("fLqFP@example.com")
                .provider("google")
                .oauthId("123")
                .picture("")
                .username("admin")
                .password("{noop}admin")
                .authorities(Set.of(Role.ADMIN))
                .build();

        User user = User.builder()
                .id(2L)
                .name("user")
                .email("fLqFP@example.com")
                .provider("google")
                .oauthId("123")
                .picture("")
                .username("user")
                .password("{noop}user")
                .authorities(Set.of(Role.USER))
                .build();

        return new InMemoryUserDetailsManager(admin, user);
    }

}
