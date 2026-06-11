import { useState } from 'react';

interface IFormProps {
  token: string;
  onCadastradoComSucesso: () => void;
  onCancelar: () => void;
}

export default function FormNovoFertilizante({ token, onCadastradoComSucesso, onCancelar }: IFormProps) {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://localhost:8080/fertilizantes/salvar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          marca,
          preco: parseFloat(preco.replace(',', '.')),
          quantidadeEstoque: parseInt(quantidadeEstoque, 10)
        }),
      });

      if (response.ok) {
        onCadastradoComSucesso();
      } else {
        setErro('Erro ao cadastrar. Verifique os dados ou a permissão do usuário.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="card shadow-sm mb-4 border-success">
      <div className="card-header bg-success text-white fw-bold">
        Cadastrar Novo Fertilizante
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Nome do Produto</label>
              <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Adubo NPK 10-10-10" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Marca</label>
              <input type="text" className="form-control" value={marca} onChange={(e) => setMarca(e.target.value)} required placeholder="Ex: Solo Rico" />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Preço (R$)</label>
              <input type="number" step="0.01" className="form-control" value={preco} onChange={(e) => setPreco(e.target.value)} required placeholder="Ex: 145.90" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Quantidade em Estoque</label>
              <input type="number" className="form-control" value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(e.target.value)} required placeholder="Ex: 50" />
            </div>
          </div>

          {erro && <p className="text-danger small">{erro}</p>}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">Salvar Produto</button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}