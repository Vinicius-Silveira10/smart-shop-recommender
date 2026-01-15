import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
// IMPORTAÇÃO CORRIGIDA: Utiliza agora a classe de serviço especializada
import { AuthService } from '../services/AuthService';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Chamada ao método estático que já gere o localStorage e o ID do utilizador
            const result = await AuthService.login(formData.username, formData.password);

            if (result.success) {
                // Navega para o dashboard após o sucesso na autenticação
                navigate('/dashboard');
            } else {
                setError("Credenciais inválidas. Verifique o seu utilizador e palavra-passe.");
            }
        } catch (err) {
            setError("Erro de ligação ao servidor Java (8082).");
            console.error("Erro no login:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#3f3bb1] py-12 px-4 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <LogIn className="mx-auto h-12 w-12 text-[#3f3bb1]" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Smart Recommender
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Entre para ver as suas recomendações
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3">
                            <p className="text-red-700 text-sm text-center font-medium">{error}</p>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="pl-10 block w-full border-gray-300 border p-3 rounded-lg focus:ring-[#3f3bb1] focus:border-[#3f3bb1] transition-all"
                                placeholder="Utilizador"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="pl-10 block w-full border-gray-300 border p-3 rounded-lg focus:ring-[#3f3bb1] focus:border-[#3f3bb1] transition-all"
                                placeholder="Palavra-passe"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-[#3f3bb1] text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#332f91]'}`}
                    >
                        {loading ? 'A entrar...' : 'Entrar no Sistema'}
                    </button>
                </form>

                <div className="text-center mt-4 border-t pt-4">
                    <Link to="/register" className="text-[#3f3bb1] font-semibold hover:underline">
                        Não tem conta? Registe-se aqui
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;