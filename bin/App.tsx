import { useState } from 'react';
import { IFertilizante } from './types/IFertilizante';
import './styles/global.css';

import NavbarGreen from './components/NavbarGreen';
import SidebarDashboard from './components/SidebarDashboard';
import CardFertilizante from './components/CardFertilizante';
import FooterAddress from './components/FooterAddress';


const inicial: IFertilizante[] = [
  { id: 1, nome: "Ureia Nitro-X", tipo: "Nitrogenado", formulaNPK: "46-00-00", precoSaca: 180.50, estoqueSacas: 10, status: 'Disponível' },
  { id: 2, nome: "Fosfato Grow", tipo: "Fosfatado", formulaNPK: "00-20-00", precoSaca: 145.00, estoqueSacas: 5, status: 'Disponível' },
  { id: 3, nome: "Potássio Plus", tipo: "Potássico", formulaNPK: "00-00-60", precoSaca: 210.00, estoqueSacas: 8, status: 'Disponível' },
];

export default function App() {
  const [fertilizantes, setFertilizantes] = useState<IFertilizante[]>(inicial);

  const realizarVenda = (id: number) => {
    setFertilizantes(prev => prev.map(item => {
      if (item.id === id && item.estoqueSacas > 0) {
        const novoEstoque = item.estoqueSacas - 1;
        return { 
          ...item, 
          estoqueSacas: novoEstoque,
          status: novoEstoque === 0 ? 'Esgotado' : 'Disponível'
        };
      }
      return item;
    }));
  };

  const totalSacas = fertilizantes.reduce((acc, f) => acc + f.estoqueSacas, 0);
  const itensEsgotados = fertilizantes.filter(f => f.status === 'Esgotado').length;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarGreen />
      <main className="container my-4 flex-grow-1">
        <div className="row">
          <aside className="col-12 col-md-3 mb-4">
            <SidebarDashboard 
              totalEstoque={totalSacas} 
              totalEsgotados={itensEsgotados} 
            />
          </aside>
          <section className="col-12 col-md-9">
            <div className="row g-3">
              {fertilizantes.map(fert => (
                <CardFertilizante 
                  key={fert.id} 
                  item={fert} 
                  onVenda={realizarVenda} 
                />
              ))}
            </div>
          </section>

        </div>
      </main>
      <FooterAddress />

    </div>
  );
}