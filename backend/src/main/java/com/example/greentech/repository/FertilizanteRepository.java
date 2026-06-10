package com.example.greentech.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.greentech.model.Fertilizante;

public interface FertilizanteRepository extends JpaRepository<Fertilizante, String> {
    
}