import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Ajuste de caminho: Agora estamos em components/, então subimos uma pasta para achar services/
import { AuthService } from '../services/AuthService';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Chama o serviço de registro configurado no seu AuthService
            await AuthService.register(formData);
            alert("Conta criada com sucesso! Agora você pode realizar o login.");
            navigate('/login');
        } catch (err) {
            console.error("Erro no cadastro:", err);
            alert("Erro ao criar conta. Verifique os dados e tente novamente.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-10 bg-white rounded-[40px] shadow-2xl space-y-6 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                        CRIAR <span className="text-[#3f3bb1]">CONTA</span>
                    </h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
                        SmartShop Experience 2026
                    </p>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome de Usuário"
                        required
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#3f3bb1]/20 font-bold transition-all"
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#3f3bb1]/20 font-bold transition-all"
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        required
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#3f3bb1]/20 font-bold transition-all"
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-5 bg-[#3f3bb1] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#332f91] transition-all shadow-lg shadow-indigo-100"
                >
                    Finalizar Cadastro
                </button>

                <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-tighter">
                    Já possui uma conta? <Link to="/login" className="text-[#3f3bb1] hover:underline">Entrar agora</Link>
                </p>
            </form>
        </div>
    );
};

// ESSA LINHA É A MAIS IMPORTANTE: Resolve o erro "does not provide an export named 'default'"
export default RegisterForm;