// Importa as funções necessárias do Pinia e do Vue
import { defineStore } from 'pinia'
import { ref } from 'vue'

// Define a store chamada 'erro' para gerenciar o estado de erros
export const useErroStore = defineStore('erro', () => {

    // Estado reativo para a mensagem de erro e controle de exibição do modal
    const mensagemErro = ref('')
  
    // Controla a visibilidade do modal de erro
    const modalMostraErro = ref(false)

    // Função para exibir o erro no modal
    function exibirErro(erro) {

        // Mensagem padrão para erro inesperado
        let mensagem = 'Erro inesperado.'

        // Se for uma string, usa diretamente
        if (typeof erro === 'string') {
            mensagem = erro
        } else if (erro.name == 'AxiosError') {
            mensagem = erro.response.data.mensagem
        }

        // Atualiza a mensagem de erro e exibe o modal
        mensagemErro.value = mensagem
        modalMostraErro.value = true
    }

    // Função para fechar o modal de erro
    function fecharModal() {
        modalMostraErro.value = false
        mensagemErro.value = ''
    }

    // Retorna o estado e as funções para serem usadas em componentes
    return {
        mensagemErro,
        modalMostraErro,
        exibirErro,
        fecharModal
    }
})
