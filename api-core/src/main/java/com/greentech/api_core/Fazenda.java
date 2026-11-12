package com.greentech.api_core;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fazendas")
public class Fazenda{
    @id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;
    private  String cnpj;

    public  long getId() { return id;}
    public void setId(Long id) {this.id = id;}
    public  String getNome() {return  nome;}
    public void setNome(String nome) {this.nome = nome;}
    public  String getCnpj() {return cnpj;}
    public void setCnpj(String cnpj) {this.cnpj = cnpj;}
}