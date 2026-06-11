package com.example.greentech.controller;

import com.example.greentech.dto.FertilizanteDTO;
import com.example.greentech.model.Fertilizante;
import com.example.greentech.repository.FertilizanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("fertilizantes")
public class FertilizanteController {

    @Autowired
    private FertilizanteRepository repository;

    @GetMapping
    public ResponseEntity<List<Fertilizante>> listarTodos() {
        List<Fertilizante> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }
    @PostMapping("/salvar")
    public ResponseEntity<Fertilizante> salvar(@RequestBody FertilizanteDTO data) {
        Fertilizante novoFertilizante = new Fertilizante(
                data.nome(),
                data.marca(),
                data.preco(),
                data.quantidadeEstoque()
        );
        repository.save(novoFertilizante);
        return ResponseEntity.ok(novoFertilizante);
    }

    @PutMapping("/{id}/vender")
    public ResponseEntity<String> realizarVenda(@PathVariable String id) {
        Optional<Fertilizante> fertilizanteOpt = repository.findById(id);

        if (fertilizanteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Fertilizante fertilizante = fertilizanteOpt.get();

        if (fertilizante.getQuantidadeEstoque() <= 0) {
            return ResponseEntity.badRequest().body("Estoque esgotado!");
        }
        fertilizante.setQuantidadeEstoque(fertilizante.getQuantidadeEstoque() - 1);
        repository.save(fertilizante);

        return ResponseEntity.ok("Venda realizada! Estoque atual: " + fertilizante.getQuantidadeEstoque());
    }
}