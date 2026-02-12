import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Project, Expense } from '@/types';

// ─── Database row types (snake_case) ───────────────────────────
interface ProjectRow {
  id: string;
  name: string;
  address: string;
  status: string;
  cover_image_url: string | null;
  created_at: string;
}

interface ExpenseRow {
  id: string;
  project_id: string;
  partner: string;
  store_name: string;
  value: number;
  description: string;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
}

// ─── Mappers (DB row ↔ App type) ──────────────────────────────
function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? '',
    status: row.status as Project['status'],
    coverImageUrl: row.cover_image_url ?? undefined,
    createdAt: row.created_at,
  };
}

function mapExpenseRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    projectId: row.project_id,
    partner: row.partner as Expense['partner'],
    storeName: row.store_name,
    value: Number(row.value),
    description: row.description ?? '',
    attachmentUrl: row.attachment_url ?? undefined,
    attachmentName: row.attachment_name ?? undefined,
    createdAt: row.created_at,
  };
}

// ─── useProjects ──────────────────────────────────────────────
export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ProjectRow[]).map(mapProjectRow);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          address: project.address,
          status: project.status,
          cover_image_url: project.coverImageUrl ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapProjectRow(data as ProjectRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.coverImageUrl !== undefined) dbUpdates.cover_image_url = updates.coverImageUrl;

      const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const addProject = useCallback(
    (project: Omit<Project, 'id' | 'createdAt'>) => {
      addMutation.mutate(project);
    },
    [addMutation]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      updateMutation.mutate({ id, updates });
    },
    [updateMutation]
  );

  const deleteProject = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  return { projects, addProject, updateProject, deleteProject };
}

// ─── useExpenses ──────────────────────────────────────────────
export function useExpenses() {
  const queryClient = useQueryClient();

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: async (): Promise<Expense[]> => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ExpenseRow[]).map(mapExpenseRow);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          project_id: expense.projectId,
          partner: expense.partner,
          store_name: expense.storeName,
          value: expense.value,
          description: expense.description,
          attachment_url: expense.attachmentUrl ?? null,
          attachment_name: expense.attachmentName ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapExpenseRow(data as ExpenseRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const addExpense = useCallback(
    (expense: Omit<Expense, 'id' | 'createdAt'>) => {
      addMutation.mutate(expense);
    },
    [addMutation]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const getExpensesByProject = useCallback(
    (projectId: string) => {
      return expenses.filter((e) => e.projectId === projectId);
    },
    [expenses]
  );

  const getExpensesByPartner = useCallback(
    (partner: string) => {
      return expenses.filter((e) => e.partner === partner);
    },
    [expenses]
  );

  const getTotalByPartner = useCallback(
    (partner: string, projectId?: string) => {
      return expenses
        .filter((e) => e.partner === partner && (!projectId || e.projectId === projectId))
        .reduce((sum, e) => sum + e.value, 0);
    },
    [expenses]
  );

  const getTotal = useCallback(
    (projectId?: string) => {
      return expenses
        .filter((e) => !projectId || e.projectId === projectId)
        .reduce((sum, e) => sum + e.value, 0);
    },
    [expenses]
  );

  return {
    expenses,
    addExpense,
    deleteExpense,
    getExpensesByProject,
    getExpensesByPartner,
    getTotalByPartner,
    getTotal,
  };
}
