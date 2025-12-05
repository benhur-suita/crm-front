// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
        
export const useAuthStore = defineStore('autorizacaoLogin', () => {
  
    const router = useRouter()

    const estaLogado = ref(localStorage.getItem('autenticado') === 'true')

    // Função para sinalizar que está logado
    function logar() {
        estaLogado.value = true
        localStorage.setItem('autenticado', 'true')
    }

    // Função para fechar a sessão e chamar o formulário de login
    function deslogar() {
      
        // Muda estado para deslogado
        estaLogado.value = false
        
        // Limpa as variáveis do locastorage
        localStorage.removeItem('')
        localStorage.removeItem('idColaborador');
        localStorage.removeItem('idEmpresa');
        localStorage.removeItem('nomeFantasia')
        localStorage.removeItem('departamentoColaborador')
        localStorage.removeItem('loginColaborador');
        localStorage.removeItem('nomeColaborador')
        localStorage.removeItem('emailColaborador')
        localStorage.removeItem('empresaManutencao');
        localStorage.removeItem('autenticado')
        localStorage.removeItem('administrador');

        // Carrega formulário de login
        router.push({ name: 'Login' })
    }
    
    return { estaLogado, logar, deslogar }
})
