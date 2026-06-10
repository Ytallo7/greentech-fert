package com.example.greentech.dto;

import com.example.greentech.model.UsuarioFuncao;

public record UsuarioDTO(String login, String senha, UsuarioFuncao funcao) {
}