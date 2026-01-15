// src/services/ShippingService.ts

export class ShippingService {

    /**
     * Calcula o frete e identifica o endereço.
     * @param cep String de 8 dígitos.
     * @param cartTotal Valor atual do carrinho para validar frete grátis.
     */
    static async calculateShipping(cep: string, cartTotal: number = 0) {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            throw new Error("CEP Inválido");
        }

        try {
            // Consulta real de endereço
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) throw new Error("CEP não encontrado");

            // APLICAÇÃO DAS REGRAS DE NEGÓCIO

            // Regra 1: Frete Grátis por Valor (> R$ 500)
            const isFreeByValue = cartTotal > 500;

            // Regra 2: Frete Grátis e Entrega Rápida para Fortaleza/CE
            const isLocal = data.uf === 'CE' && data.localidade.toLowerCase() === 'fortaleza';

            let finalPrice = this.mockPriceByRegion(data.uf);
            let finalDays = this.mockDaysByRegion(data.uf);

            if (isLocal) {
                finalPrice = 0; // Grátis para Fortaleza
                finalDays = 1;  // Entrega em 24h
            } else if (isFreeByValue) {
                finalPrice = 0; // Promoção Frete Grátis Nacional
            }

            return {
                address: `${data.logradouro || 'Rua não informada'}, ${data.bairro} - ${data.localidade}/${data.uf}`,
                price: finalPrice,
                days: finalDays
            };
        } catch (error) {
            console.error("Erro no ShippingService:", error);
            throw error;
        }
    }

    private static mockPriceByRegion(uf: string): number {
        const regions: { [key: string]: number } = {
            'SP': 15.0,
            'RJ': 22.0,
            'MG': 25.0,
            'SC': 35.0,
            'CE': 20.0 // Valor padrão para o Ceará fora de Fortaleza
        };
        return regions[uf] || 45.0;
    }

    private static mockDaysByRegion(uf: string): number {
        if (uf === 'SP') return 2;
        if (uf === 'CE') return 3; // Padrão Ceará
        return 5;
    }
}