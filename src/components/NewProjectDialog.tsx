import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Camera, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface NewProjectDialogProps {
  onAdd: (project: { name: string; address: string; status: 'em_andamento' | 'concluido' | 'pausado'; coverImageUrl?: string }) => void;
}

const NewProjectDialog = ({ onAdd }: NewProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Selecione apenas imagens');
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome do projeto');
      return;
    }

    let coverImageUrl: string | undefined;

    if (imageFile) {
      setUploading(true);
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        coverImageUrl = publicUrl;
      } catch (err) {
        console.error('Upload error:', err);
        toast.error('Erro ao enviar a imagem. O projeto será criado sem foto.');
      } finally {
        setUploading(false);
      }
    }

    onAdd({ name: name.trim(), address: address.trim(), status: 'em_andamento', coverImageUrl });
    setName('');
    setAddress('');
    setImageFile(null);
    setImagePreview('');
    setOpen(false);
    toast.success('Projeto criado com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Novo Projeto / Obra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project-name">Nome da Obra</Label>
            <Input id="project-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Residência Santos" />
          </div>
          <div>
            <Label htmlFor="project-address">Endereço</Label>
            <Input id="project-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Rua das Flores, 123" />
          </div>

          {/* Photo upload */}
          <div>
            <Label>Foto do Projeto (opcional)</Label>
            <div className="flex gap-2 mt-1">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Galeria
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="h-4 w-4" />
                Câmera
              </Button>
            </div>
            {imagePreview ? (
              <div className="relative mt-3">
                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-40 w-full object-cover border" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-7 text-xs"
                  onClick={removeImage}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Nenhuma foto selecionada</p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? 'Enviando imagem...' : 'Criar Projeto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
