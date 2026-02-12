import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import NewProjectDialog from '@/components/NewProjectDialog';
import { useProjects, useExpenses } from '@/hooks/useStore';
import { formatCurrency, formatDate, statusLabels } from '@/lib/format';
import { ArrowLeft, ArrowRight, FolderKanban, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  em_andamento: 'bg-success/10 text-success',
  concluido: 'bg-accent/10 text-accent',
  pausado: 'bg-muted text-muted-foreground',
};

const Projects = () => {
  const { projects, addProject, deleteProject } = useProjects();
  const { getTotal } = useExpenses();

  return (
    <Layout>
      <Button asChild variant="ghost" size="sm" className="mb-3 gap-1 text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-accent" />
          Projetos
        </h1>
        <NewProjectDialog onAdd={addProject} />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <FolderKanban className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhum projeto cadastrado</p>
          <p className="text-sm mt-1">Crie seu primeiro projeto para começar a controlar os gastos</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map(project => (
            <div key={project.id} className="flex items-center gap-4 rounded-xl border p-4 shadow-card bg-card animate-fade-in">
              <Link to={`/projetos/${project.id}`} className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold font-display">{project.name}</h3>
                    {project.address && <p className="text-xs text-muted-foreground mt-0.5">{project.address}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                      <span className="text-xs text-muted-foreground">Criado em {formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold font-display">{formatCurrency(getTotal(project.id))}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O projeto "{project.name}" e todos os gastos associados serão removidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { deleteProject(project.id); toast.success('Projeto excluído'); }}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Projects;
