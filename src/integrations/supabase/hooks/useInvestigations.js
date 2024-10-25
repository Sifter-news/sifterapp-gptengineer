import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('investigations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  enabled: !!id,
});

export const useInvestigations = ({ select, filter } = {}) => {
  return useQuery({
    queryKey: ['investigations', { select, filter }],
    queryFn: async () => {
      let query = supabase
        .from('investigations')
        .select(select || '*');
      
      // Only apply filter if it's a valid user ID
      if (filter && filter.includes('owner_id.eq.')) {
        const userId = filter.split('owner_id.eq.')[1];
        if (userId && userId !== 'undefined') {
          query = query.eq('owner_id', userId);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newInvestigation) => {
      const { data, error } = await supabase
        .from('investigations')
        .insert([newInvestigation])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};

export const useUpdateInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('investigations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};

export const useDeleteInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};