package com.example.greentech.controller;

import com.example.greentech.dto.AutenticacaoDTO;
import com.example.greentech.dto.LoginResponseDTO;
import com.example.greentech.dto.UsuarioDTO;
import com.example.greentech.model.Usuario;
import com.example.greentech.repository.UsuarioRepository;
import com.example.greentech.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AutenticacaoDTO data) {
        var usuarioLoginSenha = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
        var auth = this.authenticationManager.authenticate(usuarioLoginSenha);

        var token = tokenService.gerarToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody UsuarioDTO data) {
        if (this.usuarioRepository.findByLogin(data.login()) != null) {
            return ResponseEntity.badRequest().build();
        }

        String senhaCriptografada = new BCryptPasswordEncoder().encode(data.senha());
        Usuario novoUsuario = new Usuario(data.login(), senhaCriptografada, data.funcao());

        this.usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok().build();
    }
}