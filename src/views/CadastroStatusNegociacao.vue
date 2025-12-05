<template>

     <!-- Raiz da aplicação Vuetify -->
    <v-app> 

        <!-- Área principal da aplicação -->
        <v-main> 
        
            <!-- Barra preta -->
            <v-toolbar
                color="black"
                dense
                flat
                :style="{
                    'border-top-left-radius': '12px',
                    'border-top-right-radius': '8px',
                    'position': 'fixed',
                    'top': toolbarHeight + 'px',
                    'left': '260px', 
                    'width': '84.7%',
                    'right': '0',
                    'z-index': '999',
                    'transition': 'left 0.3s ease' 
                }"
            >     
                
                <v-toolbar-title class="white--text">Cadastro Status Negociação</v-toolbar-title> 
                <v-spacer />

            </v-toolbar>

            <!-- Conteúdo com espaçamento -->
            <v-container fluid class="pa-4">

                <!-- Card que agrupa elementos do formulário  -->
                <v-card class="pa-4" style="width: 100%; top: 60px">

                    <v-form ref="formCadastroStatusNegociacao" v-model="validaCadastroStatusNegociacao">
                    
                        <v-row>
                        
                            <v-col cols="12" md="10">
                                <v-text-field 
                                    label="Status Negociação" 
                                    v-model="dadosStatusNegociacao.nome"
                                    maxlength="255"
                                    :rules="[rules.required]"
                                    v-uppercase
                                />
                            </v-col>
                            
                            <v-col cols="12" md="2" class="d-flex align-center">
                                <v-switch
                                    :label="dadosStatusNegociacao.ativo ? 'Ativo' : 'Inativo'"
                                    :color="dadosStatusNegociacao.ativo ? 'blue' : 'white'"
                                    v-model="dadosStatusNegociacao.ativo"
                                />
                            </v-col>

                        </v-row>

                    </v-form>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            class="ma-2"
                            style="background-color: orange; color: white;"
                            @click="$router.push({ name: 'ListaStatusNegociacao' })"
                            >
                            <v-icon left>mdi-chevron-left</v-icon>
                            Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            style="background-color: #2196F3; color: white;"
                            @click="validarSalvarStatusNegociacao('salvar')"
                            >
                            <v-icon left color="white">mdi-update</v-icon>
                            Salvar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid orange; color: orange;"
                            @click="validarSalvarStatusNegociacao('salvar-retornar')"
                            >
                            <v-icon left color="orange">mdi-update</v-icon>
                            Salvar e Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid #2196F3; color: #2196F3;"
                            @click="validarSalvarStatusNegociacao('salvar-novo')"
                            >
                            <v-icon left color="#2196F3">mdi-autorenew</v-icon>
                            Salvar e Novo
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-container>

        </v-main>

    </v-app>

</template>

<script setup>

    /* DEPENDENCIAS E VARIAVEIS COMUNS */
    import { ref, watch, onMounted, computed } from 'vue'
    import axios from 'axios'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    // Carrega o endereço das ap
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Importa o componente do formulário de erros
    import { useErroStore } from '@/stores/erroStore'

    // Importa o componente do Snackbar
    import { useSnackbarStore } from '@/stores/snackbar'

    // Retorna um objeto com informações internas sobre o componente que está sendo executado no momento    
    import { getCurrentInstance } from 'vue'

    // Importa o componente do formulário de login
    import { useLoginStore } from '@/stores/loginStore'

    // Importa useRouter para acessar parâmetros de rota
    import { useRouter } from 'vue-router'

    // Importa módulo que controla as autorizacoes se está logado ou não
    import { useAuthStore } from '@/stores/authStore'

    // Importa useRoute para acessar parâmetros de rota
    import { useRoute } from 'vue-router'

    // Importa a store de erros
    const erroStore = useErroStore()

    // Importa a store do snackbar
    const snackbar = useSnackbarStore()

    // Permite acessar rotinas globais
    const { proxy } = getCurrentInstance()

    // Importa a store de chamados
    const loginStore = useLoginStore()

    // Acessa o ID da empresa via query param
    const router = useRouter();

    // Cria variável que receberão os dados das autorizações de login
    const autorizacaoLogin = useAuthStore()

    // Acessa o ID da empresa via query param
    const route = useRoute(); 

    
    /* VARIAVEIS DO FORMULÁRIO */

    // Referência do formulário de cadastro de empresa
    const formCadastroStatusNegociacao = ref(null)

    // Validação do formulário de ramo de atividade
    const validaCadastroStatusNegociacao = ref(false)
    
    // Variável para armazenar o ID da empresa (0 para nova empresa)
    const idStatusNegociacaoRecebido = ref(0);

    // Salva o id da empresa
    idStatusNegociacaoRecebido.value = Number(route.query.idStatusNegociacao) || 0;

    // Dados do ramo de atividade
    const dadosStatusNegociacao= ref({
        idStatusNegociacao: 0,
        nome: '',
        ativo: true
    })

    // Regras de validação
    const rules = {
        required: v => !!v || 'Campo obrigatório'
    }

    // Carrega os arrayRamosAtividade ao montar o componente
    onMounted(async () => {

        // Verifica se não está logado
        if (!autorizacaoLogin.estaLogado){
        
            // Carrega formulário de login
            router.push({ name: 'Login' })
            return
        }

        // Verifica se existe o idEmpresaRecebido para carregar os dados da empresa
        if (idStatusNegociacaoRecebido.value != 0){

            // Carrega os dados da empresa para edição
            try {
                
                // Chama a API para buscar os dados da empresa pelo ID
                const { data: respostaApi } = await axios.get(`${API_BASE_URL}/administracao/carregaStatusNegociacao/${idStatusNegociacaoRecebido.value}`)
                
                if (respostaApi) {

                    // Converte os campos TINYINT(1) para booleanos
                    respostaApi.ativo = respostaApi.ativo === 1;

                    dadosStatusNegociacao.value = respostaApi;                   
                }

            } catch (erro) {
                erroStore.exibirErro(erro)
            }
        }
    })

    // Limpa campos do cadastro de empresas
    function limpadadosStatusNegociacao(){

        dadosStatusNegociacao.value = {
            idStatusNegociacao: 0,
            nome: '',
            ativo: true
        }  
        
        // Limpa id de negociação recebido
        idStatusNegociacaoRecebido.value = 0
    }

    // Regra personalizada para validar campos
    async function validarSalvarStatusNegociacao(funcaoRetorno) {
        
        // Valida o formulário de empresa
        const isValid = await formCadastroStatusNegociacao.value?.validate()

        // Se o formulário for válido chama a função para salvar os dados
        if (isValid.valid) {

            // Chama a função para salvar os dados da empresa
            salvardadosStatusNegociacao(funcaoRetorno)

        } else {            
            snackbar.trigger('Preencha os campos obrigatórios.', 'error');
        }
    }    

    // Esta função salva ou edita os dados de uma empresa
    async function salvardadosStatusNegociacao(funcaoRetorno) {

        try {
            
            // Busca o ID da empresa para saber se é inclusão ou edição
            const {data: resposta } = await axios.post(`${API_BASE_URL}/administracao/salvaStatusNegociacao/${idStatusNegociacaoRecebido.value}`, dadosStatusNegociacao.value)
            
            // Atualiza o idEmpresa com o valor retornado da API
            idStatusNegociacaoRecebido.value = resposta.idStatusNegociacao;

            // Exibe mensagem de sucesso
            snackbar.trigger('Status Negociação Salvo Com Sucesso.', 'success');

            if (funcaoRetorno == 'salvar'){
                return
            } else if (funcaoRetorno == 'salvar-retornar'){
                router.push({ name: 'ListaStatusNegociacao' })
            } else {
                limpadadosStatusNegociacao()
            }

        } catch (erro) {
            erroStore.exibirErro(erro)
        }
    } 

</script>