// Importa o Pinia dentro da função para evitar problemas de ciclo
// Não importe no topo, faça dentro da função

export const useSessionTimeout = () => {

    let inactivityTimer = null
    const TIMEOUT_MINUTES = 30 // 30 minutos de inatividade
    const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000

    // Resetar timer quando houver atividade
    const resetTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer)
        inactivityTimer = setTimeout(logoutDueToInactivity, TIMEOUT_MS)
    }

    // Função de logout por inatividade
    const logoutDueToInactivity = () => {

        // Importa a store dentro da função para evitar problemas de ciclo
        const { useLoginStore } = require('../stores/useLoginStore') // ou import dinâmico
        const loginStore = useLoginStore()
    
        // Verifica se ainda está logado
        if (loginStore.idColaborador) {

            console.log('Sessão expirada por inatividade')
            
            // Verifica se a função existe antes de chamar
            if (window.autorizacaoLogin && typeof window.autorizacaoLogin.deslogar === 'function') {
                window.autorizacaoLogin.deslogar()
            }
        }
    }

    // Eventos de atividade do usuário
    const setupActivityListeners = () => {

        const events = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart',
            'click'
        ]

        events.forEach(event => {
            window.addEventListener(event, resetTimer, { passive: true })
        })
        
        // Inicia o timer
        resetTimer()
    }

    // Remover listeners (limpeza)
    const cleanup = () => {

        const events = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart',
            'click'
        ]

        events.forEach(event => {
            window.removeEventListener(event, resetTimer)
        })
        
        if (inactivityTimer) {
            clearTimeout(inactivityTimer)
            inactivityTimer = null
        }
    }

    return {
        setupActivityListeners,
        resetTimer,
        cleanup
    }
}