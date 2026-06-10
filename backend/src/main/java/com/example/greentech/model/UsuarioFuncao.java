package com.example.greentech.model;

public enum UsuarioFuncao{
    ADMIN("admin"),
    USUARIO("usuario");

    private String funcao;
    UsuarioFuncao(String f){
        this.funcao = f;
    }

    public String getFuncao(){
        return funcao;
    }
}