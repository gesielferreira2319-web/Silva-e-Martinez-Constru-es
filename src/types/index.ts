export type PartnerName = 'Ivan da Silva Oliveira' | 'Ronaldo de Lima Martinez';

export interface Expense {
  id: string;
  projectId: string;
  partner: PartnerName;
  storeName: string;
  value: number;
  description: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  status: 'em_andamento' | 'concluido' | 'pausado';
  coverImageUrl?: string;
  createdAt: string;
}

export const PARTNERS: { name: PartnerName; shortName: string; color: string }[] = [
  { name: 'Ivan da Silva Oliveira', shortName: 'Ivan', color: 'ivan' },
  { name: 'Ronaldo de Lima Martinez', shortName: 'Ronaldo', color: 'ronaldo' },
];
