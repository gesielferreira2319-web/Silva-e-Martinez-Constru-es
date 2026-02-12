import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, KeyRound, LogOut, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const { user, signOut, updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        setLoading(true);
        const { error } = await updatePassword(newPassword);
        setLoading(false);

        if (error) {
            toast.error('Erro ao alterar senha: ' + error);
        } else {
            toast.success('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleLogout = async () => {
        await signOut();
        toast.success('Você saiu do sistema');
    };

    return (
        <Layout>
            <div className="max-w-lg mx-auto space-y-6">
                <h1 className="text-2xl font-bold font-display">Configurações</h1>

                {/* User info */}
                <div className="rounded-xl border bg-card shadow-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Logado como</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Sair do Sistema
                    </Button>
                </div>

                {/* Change password */}
                <div className="rounded-xl border bg-card shadow-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Alterar Senha</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="new-password"
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="confirm-password"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Repita a nova senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full gap-2" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Salvando...
                                </span>
                            ) : (
                                <>
                                    <KeyRound className="h-4 w-4" />
                                    Alterar Senha
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
