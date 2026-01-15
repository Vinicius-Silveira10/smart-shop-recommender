import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await AuthService.login(username, password);

            if (data.token) {
                // ✅ GARANTIA: O token deve ser uma string pura aqui
                onLoginSuccess(data.token);
                navigate('/dashboard');
            }
        } catch (err: any) {
            // Melhora a exibição do erro para debug
            setError(err.response?.data?.message || 'Usuário ou senha inválidos. Verifique a conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] font-sans">
            <div className="w-full max-w-md p-10 bg-white rounded-[25px] shadow-2xl border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[#1a1a1a]">
                        SMART<span className="text-[#3f3bb1]">SHOP</span>
                    </h1>
                    <p className="text-gray-400 text-[11px] font-bold mt-2 uppercase">
                        Entre na sua conta para continuar
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">Usuário</label>
                        <input
                            type="text"
                            placeholder="Ex: vinicius"
                            required
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3f3bb1]/20 font-medium text-sm transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">Senha</label>
                        <input
                            type="password"
                            placeholder="••••••"
                            required
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3f3bb1]/20 font-medium text-sm transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center italic">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-[#3f3bb1] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#332f91] transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:bg-gray-300"
                    >
                        {loading ? 'Entrando...' : 'Entrar no Sistema'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Ainda não tem uma conta?
                        <Link to="/register" className="text-[#3f3bb1] ml-1 hover:underline">
                            Cadastre-se aqui
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;