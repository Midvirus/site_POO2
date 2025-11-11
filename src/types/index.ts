export interface Usuario {
  id: string;
  nome: string;
  dataNas: string;
  email: string;
  peso: number;
  altura: number;
  imc: number;
  genero: 'M' | 'F' | 'Outro';
  gorduraCorp?: number;
  nivelAtiv: 'Sedentário' | 'Leve' | 'Moderado' | 'Intenso' | 'Muito Intenso';
}

export interface Objetivo {
  id: string;
  foco: string;
  pesoIni: number;
  pesoFim: number;
  dataIni: string;
  dataFim: string;
  status: 'Ativo' | 'Concluído' | 'Pausado';
}

export interface Exercicio {
  id: string;
  nome: string;
  categoria: string;
  grupoMusc: string;
  totalCalorias: number;
  totalProteinas: number;
}

export interface Comida {
  id: string;
  nome: string;
  calorias: number;
  carbs: number;
  gords: number;
  proteinas: number;
}

export interface Treino {
  id: string;
  nome: string;
  dataHora: string;
  exercicios: Exercicio[];
}

export interface Refeicao {
  id: string;
  tipo: 'Café da Manhã' | 'Almoço' | 'Jantar' | 'Lanche' | 'Ceia';
  dataHora: string;
  comidas: Comida[];
  totalCalorias: number;
  totalCarbs: number;
  totalGord: number;
  totalProteinas: number;
}

export interface Rotina {
  id: string;
  diaSem: string;
  treinos: Treino[];
  refeicoes: Refeicao[];
  objetivo?: Objetivo;
}

export interface CaloriesSummary {
  consumed: number;
  spent: number;
  basal: number;
}

export interface Projection {
  status: 'ALINHADO' | 'FORA_DO_ALVO';
  mediaConsumo7dias: number;
  mediaGasto7dias: number;
  tendencia: string;
}
