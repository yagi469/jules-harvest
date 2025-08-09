package com.example.farm_app_backend.controller;

import com.example.farm_app_backend.entity.Farm;
import com.example.farm_app_backend.entity.User;
import com.example.farm_app_backend.repository.UserRepository;
import com.example.farm_app_backend.service.FarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    @Autowired
    private FarmService farmService;

    @Autowired
    private UserRepository userRepository; // To fetch the current user

    @GetMapping
    public List<Farm> getAllFarms() {
        return farmService.getAllFarms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Long id) {
        return farmService.getFarmById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();

        Optional<User> userOptional = userRepository.findByUsername(currentUserName);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // In a real app, check for "FARMER" role
        // if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_FARMER"))) {
        //     return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        // }

        farm.setOwner(userOptional.get());
        Farm savedFarm = farmService.saveFarm(farm);
        return new ResponseEntity<>(savedFarm, HttpStatus.CREATED);
    }

    @GetMapping("/my-farms")
    public ResponseEntity<List<Farm>> getMyFarms(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String currentUserName = authentication.getName();

        Optional<User> userOptional = userRepository.findByUsername(currentUserName);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Farm> farms = farmService.getFarmsByOwner(userOptional.get().getId());
        return ResponseEntity.ok(farms);
    }
}
