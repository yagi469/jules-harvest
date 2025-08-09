package com.example.farm_app_backend.service;

import com.example.farm_app_backend.entity.Farm;
import com.example.farm_app_backend.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmService {

    @Autowired
    private FarmRepository farmRepository;

    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    public Optional<Farm> getFarmById(Long id) {
        return farmRepository.findById(id);
    }

    public Farm saveFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    public void deleteFarm(Long id) {
        farmRepository.deleteById(id);
    }

    public List<Farm> getFarmsByOwner(Long ownerId) {
        return farmRepository.findByOwnerId(ownerId);
    }
}
