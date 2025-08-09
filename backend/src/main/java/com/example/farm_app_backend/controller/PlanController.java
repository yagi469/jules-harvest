package com.example.farm_app_backend.controller;

import com.example.farm_app_backend.entity.Farm;
import com.example.farm_app_backend.entity.Plan;
import com.example.farm_app_backend.service.FarmService;
import com.example.farm_app_backend.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    @Autowired
    private PlanService planService;

    @Autowired
    private FarmService farmService;

    @GetMapping
    public List<Plan> getAllPlans() {
        return planService.getAllPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
        return planService.getPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody Plan plan) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
        }
        String currentUserName = authentication.getName();

        if (plan.getFarm() == null || plan.getFarm().getId() == null) {
            return new ResponseEntity<>("Farm ID is required.", HttpStatus.BAD_REQUEST);
        }

        Long farmId = plan.getFarm().getId();
        Farm farm = farmService.getFarmById(farmId).orElse(null);

        if (farm == null) {
            return new ResponseEntity<>("Farm not found.", HttpStatus.NOT_FOUND);
        }

        if (farm.getOwner() == null || !Objects.equals(farm.getOwner().getUsername(), currentUserName)) {
            return new ResponseEntity<>("User is not the owner of this farm.", HttpStatus.FORBIDDEN);
        }

        plan.setFarm(farm);
        Plan savedPlan = planService.savePlan(plan);
        return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
    }
}
