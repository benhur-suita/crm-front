// stores/chamadoStore.js
import { defineStore } from 'pinia'

// Store para gerenciar o estado de recarregamento dos chamados
export const useChamadoStore = defineStore('chamados', {
    
    // Estado inicial
    state: () => ({
        precisaRecarregar: false
    }),

    // Ações para modificar o estado
    actions: {

        // Solicita recarregamento dos chamados
        solicitarRecarregamento() {
            this.precisaRecarregar = true
        },

        // Marca que o recarregamento foi concluído
        recarregamentoConcluido() {
            this.precisaRecarregar = false
        }
    }
})