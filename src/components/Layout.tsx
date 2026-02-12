import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings } from 'lucide-react';
import logo from '@/assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projetos', label: 'Projetos', icon: FolderKanban },
  { to: '/configuracoes', label: 'Config.', icon: Settings },
];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Silva e Martinez Construções" className="h-10 w-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-lg font-bold font-display leading-tight">Silva e Martinez</h1>
              <p className="text-xs opacity-70">Construções</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
