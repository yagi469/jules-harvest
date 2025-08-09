package com.example.farm_app_backend.controller;

import com.example.farm_app_backend.dto.UserRegistrationDto;
import com.example.farm_app_backend.entity.User;
import com.example.farm_app_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.farm_app_backend.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        // Here you might add validation, check if user already exists, etc.
        User newUser = new User();
        newUser.setUsername(registrationDto.getUsername());
        newUser.setPassword(registrationDto.getPassword());

        User savedUser = userService.save(newUser);

        // For security, it's better not to return the full user object with the hashed password.
        // Returning a simple success message or a different DTO is recommended.
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // UserDetails オブジェクトを取得
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // UserDto に変換
        List<String> roles = userDetails.getAuthorities().stream()
                                        .map(grantedAuthority -> grantedAuthority.getAuthority())
                                        .collect(Collectors.toList());
        UserDto userDto = new UserDto(userDetails.getUsername(), roles);

        return ResponseEntity.ok(userDto);
    }
}
