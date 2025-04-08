
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  stock: number;
  status: 'Ativo' | 'Inativo' | 'Estoque Baixo';
  isPublished: boolean;
  is_published?: boolean;
  image?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  screenSize?: string;
  screen_size?: string;
  operatingSystem?: string;
  operating_system?: string;
  graphics?: string;
}

export const determineStatus = (stock: number): 'Ativo' | 'Inativo' | 'Estoque Baixo' => {
  if (stock === 0) return 'Inativo';
  if (stock <= 3) return 'Estoque Baixo';
  return 'Ativo';
};
