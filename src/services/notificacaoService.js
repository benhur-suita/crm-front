import axios from 'axios';
import { useErroStore } from '@/stores/erroStore'

// Carrega o endereço da API
const API_BASE_URL = import.meta.env.VITE_API_URL;
const TEMPO_MONITORAMENTO = import.meta.env.VITE_TEMPO_MONITORAMENTO || 120000; // Padrão 2 minutos

// Serviço de Notificações
class NotificacaoService {

    // Construtor da classe de serviço
    constructor() {
        this.contadorAnterior = 0
        this.intervalId = null
        this.audio = null
        this.audioContext = null
        this.audioHabilitado = false
    }

    // Método para habilitar áudio (deve ser chamado por um clique do usuário)
    habilitarAudio() {

        if (!this.audioHabilitado) {
        
            try {

                const AudioContext = window.AudioContext || window.webkitAudioContext
                this.audioContext = new AudioContext()
                this.audioHabilitado = true
                console.log('🔊 Áudio habilitado pelo usuário')
                return true

            } catch (erro) {
                
                const erroStore = useErroStore()            
                erroStore.exibirErro(erro)
                return false
            }
        }
        return true
    }

    // Iniciar o monitoramento periódico
    iniciarMonitoramento(callback) {

        // Parar monitoramento anterior se existir
        this.pararMonitoramento()
        
        // Iniciar verificação a cada 2 minutos
        this.intervalId = setInterval(async () => {
            await this.verificarChamados(callback)
        }, TEMPO_MONITORAMENTO)

        // Fazer uma verificação imediata ao iniciar
        this.verificarChamados(callback, true)
    }

    // Verificar chamados abertos
    async verificarChamados(callback, primeiraVerificacao = false) {

        try {

            // Busca as quantidades de chamados abertos
            const response = await axios.get(
                `${API_BASE_URL}/operacao/buscaQuantidadesChamadosAberto`
            )

            // Com axios, os dados já vêm em response.data
            const data = response.data
            
            // Diferentes possíveis estruturas - ajuste conforme sua API
            let totalAbertos = 0
            
            // Buscar total de chamados abertos
            totalAbertos = data.data.totalChamadosAbertos
            
            if (totalAbertos != 0) {
                
                // Executa callback para notificar a aplicação app.vue que existem novos chamados
                if (callback && typeof callback === 'function') {
                    callback(totalAbertos)
                }
                
                this.habilitarAudio()
                
                // Tocar som de notificação
                this.tocarSomNotificacao()
            }            

        } catch (erro) {
            
            const erroStore = useErroStore()            
            erroStore.exibirErro(erro)
        }
    }

    // Tocar som de notificação
    tocarSomNotificacao() {

        try {

            // Verificar se o navegador suporta AudioContext
            const AudioContext = window.AudioContext || window.webkitAudioContext
            
            if (!AudioContext) {
                console.warn('⚠️ AudioContext não suportado neste navegador')
                return
            }
            
            // Criar contexto de áudio
            const context = new AudioContext()
            
            // Criar oscilador para o som
            const oscillator = context.createOscillator()
            const gainNode = context.createGain()
            
            // Configurar oscilador
            oscillator.connect(gainNode)
            gainNode.connect(context.destination)
            
            // Som de sino/notificação (frequências mais agradáveis)
            oscillator.frequency.value = 800
            oscillator.type = 'sine'
            
            // Envelope de volume (sobe e desce suavemente)
            const now = context.currentTime
            gainNode.gain.setValueAtTime(0, now)
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.15)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0)
            
            // Tocar o som
            oscillator.start(now)
            oscillator.stop(now + 1.2)
            
        } catch (erro) {
            const erroStore = useErroStore()            
            erroStore.exibirErro(erro)
        }
    } 

    pararMonitoramento() {

        if (this.intervalId) {
            console.log('🛑 Monitoramento parado')
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    // Método para buscar a contagem atual de chamados
    async buscarContagemAtual() {

        try {
        
            const response = await axios.get(
                `${API_BASE_URL}/operacao/buscaQuantidadesChamadosAberto`
            )
            
            if (response.status === 200) {

                const data = response.data
                
                // Mesma lógica de extração do totalAbertos
                let totalAbertos = 0
                
                if (data.data && data.data.totalChamadosAbertos !== undefined) {
                    totalAbertos = data.data.totalChamadosAbertos
                }
                
                this.contadorAnterior = totalAbertos
                console.log('🔍 Contagem atual buscada:', totalAbertos)
                return totalAbertos
            }
            
            return 0

        } catch (error) {
            
            const erroStore = useErroStore()            
            erroStore.exibirErro(erro)
            return 0
        }
    }

    // Método para resetar o contador (quando usuário visualiza notificações)
    resetarContador() {
        console.log('🔄 Contador resetado para 0')
        this.contadorAnterior = 0
    }

    // Método para definir o contador manualmente
    definirContador(valor) {
        console.log(`🔢 Contador definido manualmente: ${valor}`)
        this.contadorAnterior = valor
    }

    // Método para verificar se o monitoramento está ativo
    estaMonitorando() {
        return this.intervalId !== null
    }
}

export default new NotificacaoService()