// Importa o Pinia
import { defineStore } from 'pinia'

// Define o store chamado "senha"
export const useSenhaStore = defineStore('senha', {
  
    state: () => ({
        // Estado para mostrar/ocultar senha (opcional)
        mostrarSenha: false
    }),

    actions: {
        
        /**
         * Valida a força da senha conforme requisitos de segurança
         * @param {string} senha - A senha a ser validada
         * @returns {Object} - Objeto com resultado da validação
         */
        validarSenha(senha) {
            
            // Verifica se a senha foi fornecida
            if (!senha || typeof senha !== 'string') {
                return {
                    valida: false,
                    mensagem: 'Senha não fornecida',
                    erros: ['Senha é obrigatória'],
                    forca: 'fraca'
                };
            }

            const erros = [];

            // 1. Mínimo 8 caracteres
            if (senha.length < 8) {
                erros.push('A senha deve ter no mínimo 8 caracteres');
            }

            // 2. Pelo menos uma letra maiúscula
            if (!/[A-Z]/.test(senha)) {
                erros.push('A senha deve conter pelo menos uma letra maiúscula');
            }

            // 3. Pelo menos uma letra minúscula
            if (!/[a-z]/.test(senha)) {
                erros.push('A senha deve conter pelo menos uma letra minúscula');
            }

            // 4. Pelo menos um número
            if (!/\d/.test(senha)) {
                erros.push('A senha deve conter pelo menos um número');
            }

            // 5. Pelo menos um caractere especial
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
                erros.push('A senha deve conter pelo menos um caractere especial');
            }

            // 6. Verifica se há espaços em branco
            if (/\s/.test(senha)) {
                erros.push('A senha não pode conter espaços em branco');
            }

            return {
                valida: erros.length === 0,
                mensagem: erros.length === 0 ? 'Senha válida' : 'Senha não atende aos requisitos',
                erros: erros.length > 0 ? erros : null,
                forca: this.calcularForcaSenha(senha)
            };
        },

        /**
         * Calcula a força da senha
         * @param {string} senha 
         * @returns {string} - 'fraca', 'media', 'forte'
         */
        calcularForcaSenha(senha) {
            if (!senha) return 'fraca';

            let pontos = 0;

            // Comprimento
            if (senha.length >= 8) pontos += 1;
            if (senha.length >= 12) pontos += 1;

            // Diversidade de caracteres
            if (/[A-Z]/.test(senha)) pontos += 1;
            if (/[a-z]/.test(senha)) pontos += 1;
            if (/\d/.test(senha)) pontos += 1;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) pontos += 1;

            // Classificação
            if (pontos <= 3) return 'fraca';
            if (pontos <= 5) return 'media';
            return 'forte';
        },

        /**
         * Valida se duas senhas conferem
         * @param {string} senha 
         * @param {string} confirmacao 
         * @returns {Object}
         */
        validarConfirmacaoSenha(senha, confirmacao) {
            if (!confirmacao) {
                return {
                    valida: false,
                    mensagem: 'Confirme a senha'
                };
            }

            if (senha !== confirmacao) {
                return {
                    valida: false,
                    mensagem: 'As senhas não conferem'
                };
            }

            return {
                valida: true,
                mensagem: 'Senhas conferem'
            };
        },

        /**
         * Validação completa (senha + confirmação)
         * @param {string} senha 
         * @param {string} confirmacao 
         * @returns {Object}
         */
        validarSenhaCompleta(senha, confirmacao) {
            const validacaoSenha = this.validarSenha(senha);
            const validacaoConfirmacao = this.validarConfirmacaoSenha(senha, confirmacao);

            return {
                senha: validacaoSenha,
                confirmacao: validacaoConfirmacao,
                valida: validacaoSenha.valida && validacaoConfirmacao.valida
            };
        },

        /**
         * Alterna a visibilidade da senha
         */
        toggleMostrarSenha() {
            this.mostrarSenha = !this.mostrarSenha;
        }
    },

    getters: {
        /**
         * Retorna os requisitos de senha para exibição
         */
        requisitosSenha: () => [
            'Mínimo 8 caracteres',
            'Pelo menos uma letra maiúscula',
            'Pelo menos uma letra minúscula',
            'Pelo menos um número',
            'Pelo menos um caractere especial',
            'Não pode conter espaços'
        ],

        /**
         * Retorna a cor baseada na força da senha
         */
        corForcaSenha: (state) => {
            return (forca) => {
                switch (forca) {
                    case 'fraca': return 'error';
                    case 'media': return 'warning';
                    case 'forte': return 'success';
                    default: return 'info';
                }
            };
        }
    }
});