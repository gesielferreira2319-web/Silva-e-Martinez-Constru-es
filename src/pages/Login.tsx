import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from '@/assets/logo.png';

const Login = () => {
    const { signIn, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If already authenticated, redirect to home
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);
        if (error) {
            setError('Email ou senha inválidos');
            setLoading(false);
        } else {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Silva e Martinez" className="h-20 w-20 rounded-2xl shadow-lg" />
                    </div>
                    <h1 className="text-2xl font-bold font-display text-slate-800">
                        Silva e Martinez
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Gestão de Obras</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border p-6 space-y-5">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Acesso ao Sistema</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                autoComplete="email"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full gap-2" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Entrando...
                                </span>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Entrar
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    © {new Date().getFullYear()} Silva e Martinez Construções
                </p>
            </div>
        </div>
    );
};

export default Login;
