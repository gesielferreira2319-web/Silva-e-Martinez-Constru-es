import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Plus, Receipt } from 'lucide-react';
import { PARTNERS, type PartnerName } from '@/types';
import { toast } from 'sonner';

interface AddExpenseDialogProps {
  projectId: string;
  onAdd: (expense: {
    projectId: string;
    partner: PartnerName;
    storeName: string;
    value: number;
    description: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }) => void;
}

const AddExpenseDialog = ({ projectId, onAdd }: AddExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [partner, setPartner] = useState<PartnerName | ''>('');
  const [storeName, setStoreName] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      const url = URL.createObjectURL(file);
      setAttachmentUrl(url);
      toast.info(`Arquivo "${file.name}" anexado`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) { toast.error('Selecione o sócio'); return; }
    if (!storeName.trim()) { toast.error('Informe o nome do comércio'); return; }
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue) || numValue <= 0) { toast.error('Informe um valor válido'); return; }

    onAdd({
      projectId,
      partner: partner as PartnerName,
      storeName: storeName.trim(),
      value: numValue,
      description: description.trim(),
      attachmentUrl,
      attachmentName,
    });

    // Reset
    setPartner('');
    setStoreName('');
    setValue('');
    setDescription('');
    setAttachmentName('');
    setAttachmentUrl('');
    setOpen(false);
    toast.success('Gasto lançado com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Gasto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Receipt className="h-5 w-5 text-accent" />
            Lançar Gasto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Sócio Responsável</Label>
            <Select value={partner} onValueChange={(v) => setPartner(v as PartnerName)}>
              <SelectTrigger>
                <SelectValue placeholder="Quem está lançando?" />
              </SelectTrigger>
              <SelectContent>
                {PARTNERS.map(p => (
                  <SelectItem key={p.name} value={p.name}>{p.shortName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="store-name">Nome do Comércio</Label>
            <Input id="store-name" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Ex: Depósito Pereira" />
          </div>

          <div>
            <Label htmlFor="expense-value">Valor (R$)</Label>
            <Input id="expense-value" value={value} onChange={e => setValue(e.target.value)} placeholder="500,00" inputMode="decimal" />
          </div>

          <div>
            <Label htmlFor="expense-desc">Descrição (opcional)</Label>
            <Textarea id="expense-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Cimento, areia, tijolos" rows={2} />
          </div>

          {/* Attachment */}
          <div>
            <Label>Anexar NF / Recibo / Foto</Label>
            <div className="flex gap-2 mt-1">
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Arquivo
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="h-4 w-4" />
                Câmera
              </Button>
            </div>
            {attachmentName && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <Receipt className="h-3 w-3" />
                {attachmentName}
              </p>
            )}
            {attachmentUrl && attachmentUrl.startsWith('blob:') && (
              <img src={attachmentUrl} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover border" />
            )}
          </div>

          <Button type="submit" className="w-full">Lançar Gasto</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
