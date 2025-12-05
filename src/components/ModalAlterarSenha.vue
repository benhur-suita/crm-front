<template>
    <v-dialog v-model="modalVisivel" max-width="500" persistent>
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center bg-primary">
                <span class="text-h6 white--text">Alterar Senha</span>
                <v-btn icon @click="fecharModal" dark>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-4">
                <v-form ref="formAlterarSenha" v-model="validAlterarSenha">

                    <!-- Campo usuário readonly com dados do store -->
                    <v-text-field
                        v-model="dadosAlterarSenha.usuario"
                        label="Usuário"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        :rules="[v => !!v || 'Informe Login Usuário']"
                        class="mb-3"
                    />

                    <v-text-field
                        v-model="dadosAlterarSenha.senhaAtual"
                        label="Senha Atual"
                        prepend-inner-icon="mdi-lock"
                        variant="outlined"
                        :type="showSenhaAtual ? 'text' : 'password'"
                        :rules="[v => !!v || 'Informe a Senha Atual']"
                        :append-inner-icon="showSenhaAtual ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showSenhaAtual = !showSenhaAtual"
                        class="mb-3"
                    />

                    <v-text-field
                        v-model="dadosAlterarSenha.novaSenha"
                        label="Nova Senha"
                        prepend-inner-icon="mdi-lock-plus"
                        variant="outlined"
                        :type="showNovaSenha ? 'text' : 'password'"
                        :rules="[v => !!v || 'Informe a Nova Senha', v => v && v.length >= 6 || 'Mínimo 6 caracteres']"
                        :append-inner-icon="showNovaSenha ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showNovaSenha = !showNovaSenha"
                        class="mb-3"
                    />

                    <v-text-field
                        v-model="dadosAlterarSenha.confirmarSenha"
                        label="Confirmar Nova Senha"
                        prepend-inner-icon="mdi-lock-check"
                        variant="outlined"
                        :type="showConfirmarSenha ? 'text' : 'password'"
                        :rules="[v => !!v || 'Confirme a nova senha', v => v === dadosAlterarSenha.novaSenha || 'As senhas não conferem']"
                        :append-inner-icon="showConfirmarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showConfirmarSenha = !showConfirmarSenha"
                        class="mb-4"
                    />

                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn 
                    color="grey" 
                    variant="text" 
                    @click="fecharModal"
                >
                    Cancelar
                </v-btn>
                <v-btn 
                    color="primary" 
                    @click="alterarSenha"
                    :loading="alterandoSenha"
                    :disabled="!validAlterarSenha || alterandoSenha"
                >
                    <v-icon left>mdi-key-change</v-icon>
                    Alterar Senha
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

    import { ref, watch, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useErroStore } from '@/stores/erroStore'
    import { useLoginStore } from '@/stores/loginStore'
    import { useSnackbarStore } from '@/stores/snackbar'
    
    import axios from 'axios'

    // Props
    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false
        }
    })

    // Emits
    const emit = defineEmits(['update:modelValue'])
    
    // Stores
    const router = useRouter()
    const erroStore = useErroStore()
    const loginStore = useLoginStore()
    const snackbar = useSnackbarStore()

    // Computed - Obtém o usuário diretamente do store
    const usuarioLogado = computed(() => loginStore.loginColaborador)

    // Refs
    const formAlterarSenha = ref(null)
    const validAlterarSenha = ref(false)
    const alterandoSenha = ref(false)
    const showSenhaAtual = ref(false)
    const showNovaSenha = ref(false)
    const showConfirmarSenha = ref(false)

    const modalVisivel = ref(false)
    const dadosAlterarSenha = ref({
        usuario: loginStore.loginColaborador, // Usa o valor computado
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    })

    // Watchers
    watch(() => props.modelValue, (newVal) => {
        modalVisivel.value = newVal
        if (newVal) {
            // Atualiza o usuário sempre que o modal abrir
            dadosAlterarSenha.value.usuario = loginStore.loginColaborador
        }
    })

    watch(modalVisivel, (newVal) => {
        emit('update:modelValue', newVal)
        if (!newVal) {
            resetarFormulario()
        }
    })

    // Watch o usuário do store para atualizar sempre que mudar
    watch(usuarioLogado, (novoUsuario) => {
        dadosAlterarSenha.value.usuario = novoUsuario
    })

    // Métodos
    const fecharModal = () => {
        modalVisivel.value = false
    }

    const resetarFormulario = () => {
        dadosAlterarSenha.value = {
            usuario: loginStore.loginColaborador,
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: ''
        }
        formAlterarSenha.value?.resetValidation()
    }

    // Rotina para alteração de senha
    const alterarSenha = async () => {

        // Veriifca se os campos do formulário foram preenchidos
        if (!validAlterarSenha.value) return
        
        try {
        
            // Verifica se está em processo de alteração da senha em andamento
            if (alterandoSenha.value == false){

                // Liga indicação que está alterando a senha
                alterandoSenha.value = true
            
                // Monta os dados da requisição
                const dadosRequisicao = {
                    idColaborador: loginStore.idColaborador,
                    loginColaborador: dadosAlterarSenha.value.usuario,
                    senhaAtual: dadosAlterarSenha.value.senhaAtual,
                    novaSenha: dadosAlterarSenha.value.novaSenha
                }

                // Chama API para alterar a senha
                const response = await axios.post(`${API_BASE_URL}/operacao/alterarSenha`, dadosRequisicao)

                // Verifica se retornou erro
                if (response.data.erro === false) {

                    snackbar.trigger('Senha Alterada Com Sucesso!', 'success')
                    emit('senhaAlterada')
                    fecharModal()

                } else {
                    erroStore.exibirErro(response.data.erro)
                }
            }

        } catch (erro) {

            alterandoSenha.value = false
            erroStore.exibirErro(erro)  

        } finally {
            alterandoSenha.value = false
        }
    }
</script>