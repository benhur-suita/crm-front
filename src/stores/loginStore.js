import { defineStore } from 'pinia'
import { useSessionTimeout } from '@/composables/useSessionTimeout'
import { useAuthStore } from '@/stores/authStore'

export const useLoginStore = defineStore('chamado', {

    state: () => ({
        idColaborador: null,    
        idEmpresa: null,
        nomeFantasia: null,    
        nomeColaborador: '',  
        loginColaborador: '',
        departamentoColaborador: '',    
        emailColaborador: '',    
        empresaManutencao: '',
        // Adicione timestamp do último acesso
        lastActivity: null
    }),

    actions: {
        setDadosChamado(dados) {
            this.idColaborador = dados.idColaborador ?? null
            this.idEmpresa = dados.idEmpresa ?? null
            this.nomeFantasia = dados.nomeFantasia
            this.departamentoColaborador = dados.departamentoColaborador ?? ''
            this.loginColaborador = dados.loginColaborador
            this.nomeColaborador = dados.nomeColaborador ?? ''
            this.emailColaborador = dados.emailColaborador ?? ''
            this.empresaManutencao = dados.empresaManutencao ?? ''
            // Atualiza timestamp ao logar
            this.updateActivity()
            
            // Inicia monitoramento de atividade
            this.startActivityMonitoring()
        },
        
        updateActivity() {
            this.lastActivity = Date.now()
        },
        
        startActivityMonitoring() {
            const { setupActivityListeners, resetTimer } = useSessionTimeout()
            setupActivityListeners()
            resetTimer() // Inicia o timer
        },
        
        // Método para logout manual
        logout() {
            
            const { cleanup } = useSessionTimeout()

            // Acessa a store de auth
            const authStore = useAuthStore()
            
             // Limpa listeners
            cleanup()

            // Chama rotina para limpar as sessions de login
            authStore.deslogar()
        },
        
        // Verificar se a sessão expirou (útil ao recarregar a página)
        checkSessionExpiry() {
            const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutos
            
            if (this.lastActivity && (Date.now() - this.lastActivity > SESSION_TIMEOUT)) {
                this.logout()
                return true
            }
            return false
        }
  },
  persist: {
        
        enabled: true,
        // Especifica quais campos serão persistidos
        strategies: [
            {
                key: 'chamado-storage',
                storage: localStorage,
                paths: [
                    'idColaborador',
                    'idEmpresa',
                    'nomeFantasia',
                    'nomeColaborador',
                    'loginColaborador',
                    'departamentoColaborador',
                    'emailColaborador',
                    'empresaManutencao',
                    'lastActivity' // ← IMPORTANTE: incluir este campo
                ]
            }
        ]
    }
})