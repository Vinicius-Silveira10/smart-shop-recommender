import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
import { AuthService } from '../services/AuthService';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '', // Adicionado para bater com sua tabela 'users'
        segment_tag: 'TECH' // Valor padrão para evitar erro no banco
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Agora o AuthService aceita o objeto completo
            const response = await AuthService.register(formData);

            if (response) {
                alert("Conta criada com sucesso!");
                navigate('/login');
            }
        } catch (err: any) {
            setError("Erro ao criar conta. Tente outro nome de usuário.");
            console.error("Erro no cadastro:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#3f3bb1] py-12 px-4 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-[#3f3bb1]" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                        Criar Nova Conta
                    </h2>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="pl-10 block w-full border-gray-300 border p-3 rounded-xl focus:ring-2 focus:ring-[#3f3bb1] outline-none transition-all"
                                placeholder="Nome Completo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="pl-10 block w-full border-gray-300 border p-3 rounded-xl focus:ring-2 focus:ring-[#3f3bb1] outline-none transition-all"
                                placeholder="Username (ex: vinicius_dev)"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="pl-10 block w-full border-gray-300 border p-3 rounded-xl focus:ring-2 focus:ring-[#3f3bb1] outline-none transition-all"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="pl-10 block w-full border-gray-300 border p-3 rounded-xl focus:ring-2 focus:ring-[#3f3bb1] outline-none transition-all"
                                placeholder="Senha"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#3f3bb1] text-white font-bold rounded-xl hover:bg-[#332f91] transition-all transform hover:scale-[1.01] shadow-lg mt-4"
                    >
                        Finalizar Cadastro
                    </button>
                </form>

                <div className="text-center mt-6 border-t pt-4">
                    <Link to="/login" className="text-[#3f3bb1] font-semibold hover:text-indigo-800 transition-colors">
                        Já possui uma conta? Entre agora
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;