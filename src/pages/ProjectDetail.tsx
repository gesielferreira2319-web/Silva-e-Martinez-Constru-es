import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PartnerCard from '@/components/PartnerCard';
import AddExpenseDialog from '@/components/AddExpenseDialog';
import ExpenseList from '@/components/ExpenseList';
import { useProjects, useExpenses } from '@/hooks/useStore';
import { PARTNERS } from '@/types';
import { formatCurrency, statusLabels } from '@/lib/format';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, updateProject } = useProjects();
  const { addExpense, deleteExpense, getExpensesByProject, getTotalByPartner } = useExpenses();
  const [filterPartner, setFilterPartner] = useState<string>('all');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Projeto não encontrado</p>
          <Button asChild className="mt-4">
            <Link to="/projetos">Voltar</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const projectExpenses = getExpensesByProject(project.id);
  const filteredExpenses = filterPartner === 'all'
    ? projectExpenses
    : projectExpenses.filter(e => e.partner === filterPartner);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3 gap-1 text-muted-foreground">
          <Link to="/projetos">
            <ArrowLeft className="h-4 w-4" />
            Projetos
          </Link>
        </Button>

        {/* Cover Image */}
        {project.coverImageUrl ? (
          <div className="relative mb-4 overflow-hidden rounded-2xl">
            <img
              src={project.coverImageUrl}
              alt={project.name}
              className="h-48 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="mb-4 rounded-2xl bg-muted/50 border border-dashed flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-30" />
              <p className="text-xs">Sem foto do projeto</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.coverImageUrl ? (
              <img src={project.coverImageUrl} alt={project.name} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold font-display">{project.name}</h1>
              {project.address && <p className="text-sm text-muted-foreground">{project.address}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={project.status} onValueChange={(v) => updateProject(project.id, { status: v as any })}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
            <AddExpenseDialog projectId={project.id} onAdd={addExpense} />
          </div>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {PARTNERS.map(p => (
          <PartnerCard
            key={p.name}
            name={p.name}
            shortName={p.shortName}
            total={getTotalByPartner(p.name, project.id)}
            expenseCount={projectExpenses.filter(e => e.partner === p.name).length}
            colorClass={p.color as 'ivan' | 'ronaldo'}
          />
        ))}
      </div>

      {/* Total */}
      <div className="rounded-xl border p-4 mb-6 bg-card shadow-card">
        <div className="flex items-center justify-between">
          <p className="font-medium text-muted-foreground">Total do Projeto</p>
          <p className="text-2xl font-bold font-display">{formatCurrency(
            getTotalByPartner(PARTNERS[0].name, project.id) + getTotalByPartner(PARTNERS[1].name, project.id)
          )}</p>
        </div>
      </div>

      {/* Expense list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-display">Lançamentos</h2>
        <Select value={filterPartner} onValueChange={setFilterPartner}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {PARTNERS.map(p => (
              <SelectItem key={p.name} value={p.name}>{p.shortName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
    </Layout>
  );
};

export default ProjectDetail;
