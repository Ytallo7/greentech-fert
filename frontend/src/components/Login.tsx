import { useState } from 'react';
import '../styles/global.css';

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, senha }),
            });

            if (response.ok) {
                const data = await response.json();
                // Salva o token no cofre do navegador
                localStorage.setItem('token', data.token); 
                // Avisa o aplicativo que o login deu certo
                onLogin(data.token); 
            } else {
                setErro('Login ou senha incorretos! Acesso negado (403).');
            }
        } catch (error) {
            setErro('Erro ao conectar com o servidor. O Spring Boot está rodando?');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ color: '#1a7541', textAlign: 'center', marginBottom: '1.5rem' }}>Acesso GreenTech Fert</h2>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Usuário (ex: admin)"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                    
                    {erro && <p style={{ color: 'red', fontSize: '0.9rem', margin: 0 }}>{erro}</p>}
                    
                    <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#1a7541', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Entrar no Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}