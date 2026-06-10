import { IFertilizante } from './IFertilizante';

export interface IGreenState {
  inventario: IFertilizante[];
  totalVendasRealizadas: number;
  dataUltimaOperacao: string;
}