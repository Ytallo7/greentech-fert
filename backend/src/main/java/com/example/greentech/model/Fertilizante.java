package com.example.greentech.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "fertilizantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")

public class Fertilizante {
    
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private String id;
        private String nome;
        private String marca;
        private Double preco;
        private Integer quantidadeEstoque;

        public Fertilizante(String nome, String marca, Double preco, Integer quantidadeEstoque) {
            this.nome = nome;
            this.preco = preco;
            this.marca = marca;
            this.quantidadeEstoque = quantidadeEstoque;
    }
}