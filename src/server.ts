import app from './app';
import 'dotenv/config';
// 🚀 Isso permite que o JSON.stringify aceite BigInt automaticamente em todo o sistema
(BigInt.prototype as any).toJSON = function () { return this.toString(); };
/** * 🚀 CORREÇÃO CRÍTICA PARA BIGINT
 * Este bloco impede o Erro 500 (Internal Server Error) ao enviar
 * produtos ou itens do carrinho que possuem IDs muito grandes.
 */
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
    console.log(`🚀 Server Node.js rodando na porta ${PORT}`);
    console.log(`🔗 Banco de Dados: ${process.env.DATABASE_URL?.split('@')[1] || 'Verifique o .env'}`);
});