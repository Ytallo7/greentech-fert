export interface IFertilizante {
  id: number;
  nome: string;
  tipo: 'Nitrogenado' | 'Fosfatado' | 'Potássico' | 'Orgânico';
  formulaNPK: string;
  precoSaca: number;
  estoqueSacas: number;
  status: 'Disponível' | 'Esgotado';
}