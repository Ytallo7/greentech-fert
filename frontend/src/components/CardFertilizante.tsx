import { IFertilizante } from '../types/IFertilizante';

interface ICardFertilizanteProps {
  item: IFertilizante;
  onVenda: (id: string) => void;
}

export default function CardFertilizante({ item, onVenda }: ICardFertilizanteProps) {
  const isEsgotado = !item.quantidadeEstoque || item.quantidadeEstoque <= 0;

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className={`card h-100 shadow-sm ${isEsgotado ? 'bg-light opacity-75' : 'border-success'}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-success fw-bold">{item.nome}</h5>
          <div className="mb-2">
            <span className="badge bg-secondary me-1">Marca: {item.marca}</span>
          </div>
          
          <p className="card-text mt-2">
            <strong>Preço:</strong> R$ {item.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
          </p>
          
          <p className={`fw-bold ${item.quantidadeEstoque < 5 ? 'text-danger' : 'text-muted'}`}>
            Estoque: {item.quantidadeEstoque || 0} unidades
          </p>
          
          <button 
            className={`btn mt-auto w-100 ${isEsgotado ? 'btn-outline-secondary' : 'btn-success'}`}
            onClick={() => onVenda(item.id)}
            disabled={isEsgotado}
          >
            {isEsgotado ? 'Sem Estoque' : 'Realizar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
}