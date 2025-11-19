// Helper functions for role management (development mode)

export const setUserRole = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', 'USER');
    console.log('✅ Role set to USER - Access /dashboard');
  }
};

export const setAdminRole = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', 'ADMIN');
    console.log('✅ Role set to ADMIN - Access /admin/dashboard');
  }
};

export const getUserRole = (): 'USER' | 'ADMIN' | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole') as 'USER' | 'ADMIN' | null;
  }
  return null;
};

export const clearRole = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole');
    console.log('✅ Role cleared');
  }
};

// Quick access functions for console
if (typeof window !== 'undefined') {
  (window as any).setUserRole = setUserRole;
  (window as any).setAdminRole = setAdminRole;
  (window as any).clearRole = clearRole;
  
  console.log(`
🎯 Role Helper Functions Available:
   
   setUserRole()  - Set role to USER (access /dashboard)
   setAdminRole() - Set role to ADMIN (access /admin/dashboard)
   clearRole()    - Clear current role
  `);
}
