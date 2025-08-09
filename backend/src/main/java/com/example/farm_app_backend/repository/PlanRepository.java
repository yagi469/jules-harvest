package com.example.farm_app_backend.repository;

import com.example.farm_app_backend.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByFarmId(Long farmId);
}
