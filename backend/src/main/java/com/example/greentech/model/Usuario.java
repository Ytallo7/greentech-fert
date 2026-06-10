package com.example.greentech.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "usuario")
@Entity(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String login;
    
    @Column(nullable = false)
    private String senha;
    
    @Enumerated(EnumType.STRING)
    private UsuarioFuncao funcao;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.funcao == UsuarioFuncao.ADMIN) {
            return List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_USER")
            );
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
    }
    public Usuario(String login, String senha, UsuarioFuncao funcao) {
        this.login = login;
        this.senha = senha;
        this.funcao = funcao;
    }

    @Override
    public String getPassword() { return this.senha; }

    @Override
    public String getUsername() { return this.login; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}