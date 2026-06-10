package com.example.greentech.controller;

import com.example.greentech.dto.FertilizanteDTO;
import com.example.greentech.model.Fertilizante;
import com.example.greentech.repository.FertilizanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/fertilizantes")
public class FertilizanteController {
    @Autowired
    private FertilizanteRepository repository;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody FertilizanteDTO data){
        Fertilizante novoFertilizante = new Fertilizante(data.nome(), data.marca(), data.preco(), data.quantidadeEstoque());
        repository.save(novoFertilizante);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Fertilizante>> ListarTodos(){
        List<Fertilizante> Lista = repository.findAll();
        return ResponseEntity.ok(Lista);
    }
}