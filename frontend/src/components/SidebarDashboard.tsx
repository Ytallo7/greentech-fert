// Interface para garantir a tipagem obrigatória das Props 
interface IDashboardProps {
  totalEstoque: number;
  totalEsgotados: number;
}

export default function SidebarDashboard({ totalEstoque, totalEsgotados }: IDashboardProps) {
  return (
    <aside className="p-4 border rounded bg-white shadow-sm h-100">
      <h4 className="text-success border-bottom pb-3 fw-bold">
        📊 Dashboard Agro
      </h4>
      <div className="mt-4">
        <p className="text-muted mb-1 small uppercase fw-bold">Volume em Estoque:</p>
        <div className="d-flex align-items-baseline">
          <h2 className="fw-bold text-dark mb-0">{totalEstoque}</h2>
          <span className="ms-2 text-muted">sacas</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-top">
        <p className="mb-2 text-muted small fw-bold">Status Crítico:</p>
        <div className="d-flex align-items-center">
          <span className={`badge p-2 w-100 ${totalEsgotados > 0 ? 'bg-danger' : 'bg-success'}`}>
            {totalEsgotados === 0 
              ? 'Estoque Regularizado' 
              : `${totalEsgotados} Produtos Esgotados`}
          </span>
        </div>
      </div>

      <div className="mt-5 small text-muted italic">
        <hr />
        <p className="mb-0">Atualizado em tempo real via State.</p>
      </div>
    </aside>
  );
}