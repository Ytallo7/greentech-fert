import { useState, useEffect } from 'react';
import NavbarGreen from './components/NavbarGreen';
import SidebarDashboard from './components/SidebarDashboard';
import CardFertilizante from './components/CardFertilizante';
import Login from './components/Login';
import FormNovoFertilizante from './components/FormNovoFertilizante';
import './styles/global.css';
import { IFertilizante } from './types/IFertilizante';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [fertilizantes, setFertilizantes] = useState<IFertilizante[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    if (tokenSalvo) {
      setToken(tokenSalvo);
    }
  }, []);

  useEffect(() => {
    if (token) {
      buscarFertilizantes();
    }
  }, [token]);

  const buscarFertilizantes = async () => {
    try {
      const response = await fetch('http://localhost:8080/fertilizantes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFertilizantes(data);
      }
    } catch (error) {
      console.error("Erro na conexão", error);
    }
  };

  if (!token) {
    return <Login onLogin={(novoToken) => setToken(novoToken)} />;
  }
  const handleVenda = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/fertilizantes/${id}/vender`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        buscarFertilizantes();
      } else {
        const erroMsg = await response.text();
        alert(`Não foi possível realizar a venda: ${erroMsg}`);
      }
    } catch (error) {
      console.error("Erro ao realizar venda", error);
      alert("Erro de conexão com o servidor ao tentar vender.");
    }
  };

  return (
    <div>
      <NavbarGreen />
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3">
             <SidebarDashboard totalEstoque={fertilizantes.length} totalEsgotados={0} />
          </div>
          
          <div className="col-md-9">
            {/* Botão para abrir o cadastro */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-success m-0">Catálogo de Insumos</h3>
              {!mostrarFormulario && (
                <button className="btn btn-success fw-bold" onClick={() => setMostrarFormulario(true)}>
                  + Novo Fertilizante
                </button>
              )}
            </div>

            {/* O formulário aparece aqui se o estado for true */}
            {mostrarFormulario && (
              <FormNovoFertilizante 
                token={token} 
                onCancelar={() => setMostrarFormulario(false)}
                onCadastradoComSucesso={() => {
                  setMostrarFormulario(false);
                  buscarFertilizantes();
                }}
              />
            )}

            <div className="row">
              {fertilizantes.length === 0 ? (
                <div className="col-12 text-center mt-5">
                  <h4 className="text-muted">Nenhum fertilizante cadastrado no estoque ainda.</h4>
                </div>
              ) : (
                fertilizantes.map((fert) => (
                  <CardFertilizante 
                    key={fert.id}
                    item={fert} 
                    onVenda={handleVenda} 
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;