import { User } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface PartnerCardProps {
  name: string;
  shortName: string;
  total: number;
  expenseCount: number;
  colorClass: 'ivan' | 'ronaldo';
}

const PartnerCard = ({ shortName, total, expenseCount, colorClass }: PartnerCardProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 shadow-card transition-shadow hover:shadow-elevated`}>
      <div className={`absolute top-0 left-0 h-1 w-full ${colorClass === 'ivan' ? 'bg-ivan' : 'bg-ronaldo'}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Gastos de</p>
          <h3 className="text-xl font-bold font-display mt-1">{shortName}</h3>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass === 'ivan' ? 'bg-ivan/10 text-ivan' : 'bg-ronaldo/10 text-ronaldo'}`}>
          <User className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold font-display">{formatCurrency(total)}</p>
      <p className="text-sm text-muted-foreground mt-1">{expenseCount} lançamento{expenseCount !== 1 ? 's' : ''}</p>
    </div>
  );
};

export default PartnerCard;
