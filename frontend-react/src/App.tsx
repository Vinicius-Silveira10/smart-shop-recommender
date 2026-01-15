import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação de Componentes e Páginas
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutSuccess from './pages/CheckoutSuccess';

// Contexto Global
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
    // Monitora o token para proteção de rotas
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    /**
     * 🔐 handleLoginSuccess: Salva o token limpando aspas extras.
     * Isso evita que o cabeçalho Bearer seja enviado de forma inválida ao Java.
     */
    const handleLoginSuccess = (newToken: string) => {
        const cleanToken = newToken.replace(/"/g, '');
        localStorage.setItem('token', cleanToken);
        setToken(cleanToken);
    };

    /**
     * 🚪 handleLogout: Limpa o estado e o armazenamento.
     * Agora passado para as páginas que possuem o botão de sair.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
    };

    return (
        <Router>
            <Routes>
                {/* 1. Rotas Públicas */}
                <Route
                    path="/login"
                    element={!token ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />}
                />
                <Route path="/register" element={<RegisterForm />} />

                {/* 2. Rotas Protegidas (Todas dentro do CartProvider)
                   Garante que o contador do carrinho e o logout funcionem em qualquer tela protegida.
                */}
                <Route
                    path="/dashboard"
                    element={
                        token ? (
                            <CartProvider>
                                <Dashboard onLogout={handleLogout} />
                            </CartProvider>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        token ? (
                            <CartProvider>
                                <CheckoutPage />
                            </CartProvider>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/checkout-success"
                    element={
                        token ? (
                            <CartProvider>
                                <CheckoutSuccess />
                            </CartProvider>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/orders"
                    element={
                        token ? (
                            <CartProvider>
                                <OrdersPage onLogout={handleLogout} />
                            </CartProvider>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* 3. Redirecionamentos de Segurança */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;