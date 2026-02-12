import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PartnerCard from '@/components/PartnerCard';
import { useProjects } from '@/hooks/useStore';
import { useExpenses } from '@/hooks/useStore';
import { PARTNERS } from '@/types';
import { formatCurrency, statusLabels } from '@/lib/format';
import { FolderKanban, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import constructionHero from '@/assets/construction-hero.jpg';

const Index = () => {
  const { projects } = useProjects();
  const { expenses, getTotalByPartner, getTotal } = useExpenses();

  const activeProjects = projects.filter(p => p.status === 'em_andamento');

  return (
    <Layout>
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-2xl">
        <img src={constructionHero} alt="Construção" className="h-48 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50 flex items-center">
          <div className="p-8">
            <h1 className="text-3xl font-bold font-display text-primary-foreground">Silva e Martinez Construções</h1>
            <p className="text-primary-foreground/70 mt-1">Controle financeiro de obras</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {PARTNERS.map(p => (
          <PartnerCard
            key={p.name}
            name={p.name}
            shortName={p.shortName}
            total={getTotalByPartner(p.name)}
            expenseCount={expenses.filter(e => e.partner === p.name).length}
            colorClass={p.color as 'ivan' | 'ronaldo'}
          />
        ))}
        <div className="rounded-xl border p-6 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Geral</p>
              <p className="text-2xl font-bold font-display mt-1">{formatCurrency(getTotal())}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">{expenses.length} lançamento{expenses.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {/* Active Projects */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-accent" />
          Projetos Ativos
        </h2>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/projetos">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {activeProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          <p>Nenhum projeto ativo. Crie um novo projeto para começar!</p>
          <Button asChild className="mt-4">
            <Link to="/projetos">Ir para Projetos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {activeProjects.slice(0, 4).map(project => (
            <Link
              key={project.id}
              to={`/projetos/${project.id}`}
              className="flex items-center justify-between rounded-xl border p-4 shadow-card hover:shadow-elevated transition-shadow bg-card"
            >
              <div>
                <h3 className="font-semibold font-display">{project.name}</h3>
                {project.address && <p className="text-xs text-muted-foreground">{project.address}</p>}
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                  {statusLabels[project.status]}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold font-display">{formatCurrency(getTotal(project.id))}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Index;
