import { NavLink } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../features/auth/hooks/useAuth.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/progress', label: 'Progress' }
];

function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="font-display text-xl font-bold text-ink">Dyslexia Platform</p>
          <p className="text-sm text-slate-500">
            {user?.name ? `Signed in as ${user.name}` : 'Frontend scaffold'}
          </p>
        </div>
        <nav className="hidden items-center gap-3 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  isActive ? 'bg-sea text-white' : 'text-slate-600 hover:bg-slate-100'
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Button type="button" variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;
