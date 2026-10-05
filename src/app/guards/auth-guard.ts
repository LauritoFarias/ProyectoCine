import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService).cliente;
  const router = inject(Router);

  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
