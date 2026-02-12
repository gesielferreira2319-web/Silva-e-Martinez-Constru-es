import { Expense, PARTNERS } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Receipt, Trash2, Store, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  showProject?: boolean;
}

const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Receipt className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-sm">Nenhum gasto lançado ainda</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {expenses.map(expense => {
          const partnerInfo = PARTNERS.find(p => p.name === expense.partner);
          return (
            <div key={expense.id} className="flex items-start gap-4 rounded-xl border p-4 shadow-card animate-fade-in bg-card">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${partnerInfo?.color === 'ivan' ? 'bg-ivan/10 text-ivan' : 'bg-ronaldo/10 text-ronaldo'
                }`}>
                <Store className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{expense.storeName}</p>
                    <p className="text-xs text-muted-foreground">{partnerInfo?.shortName} • {formatDateTime(expense.createdAt)}</p>
                  </div>
                  <p className="font-bold font-display text-sm whitespace-nowrap">{formatCurrency(expense.value)}</p>
                </div>
                {expense.description && <p className="text-xs text-muted-foreground mt-1">{expense.description}</p>}
                {expense.attachmentUrl && (
                  <button
                    onClick={() => setPreviewImage(expense.attachmentUrl!)}
                    className="flex items-center gap-1 mt-2 text-xs text-accent hover:underline"
                  >
                    <Image className="h-3 w-3" />
                    Ver anexo
                  </button>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir gasto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Gasto de {formatCurrency(expense.value)} em {expense.storeName} será removido permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(expense.id)}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-lg p-2">
          <VisuallyHidden>
            <DialogTitle>Visualização do Anexo</DialogTitle>
          </VisuallyHidden>
          {previewImage && <img src={previewImage} alt="Anexo" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseList;
