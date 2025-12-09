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
                    'top': '64px',
                    'left': '260px', 
                    'width': '84.7%',
                    'right': '0',
                    'z-index': '999',
                    'transition': 'left 0.3s ease' 
                }"
            >     
                
                <v-toolbar-title class="white--text">Cadastro Tipo Chamado</v-toolbar-title> 
                <v-spacer />

            </v-toolbar>

            <!-- Conteúdo com espaçamento -->
            <v-container fluid class="pa-4">

                <!-- Card que agrupa elementos do formulário  -->
                <v-card class="pa-4" style="width: 100%; top: 60px">

                    <v-form ref="formCadastroTipoChamado" v-model="validaCadastroTipoChamado">
                    
                        <v-row>
                        
                            <v-col cols="12" md="10">
                                <v-text-field 
                                    label="Tipo Chamado" 
                                    v-model="dadosTipoChamados.nome"
                                    maxlength="255"
                                    :rules="[rules.required]"
                                    v-uppercase
                                />
                            </v-col>
                            
                            <v-col cols="12" md="2" class="d-flex align-center">
                                <v-switch
                                    :label="dadosTipoChamados.ativo ? 'Ativo' : 'Inativo'"
                                    :color="dadosTipoChamados.ativo ? 'blue' : 'white'"
                                    v-model="dadosTipoChamados.ativo"
                                />
                            </v-col>

                        </v-row>

                    </v-form>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            class="ma-2"
                            style="background-color: orange; color: white;"
                            @click="$router.push({ name: 'ListaTiposChamados' })"
                            >
                            <v-icon left>mdi-chevron-left</v-icon>
                            Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            style="background-color: #2196F3; color: white;"
                            @click="validarSalvarTipoChamado('salvar')"
                            >
                            <v-icon left color="white">mdi-update</v-icon>
                            Salvar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid orange; color: orange;"
                            @click="validarSalvarTipoChamado('salvar-retornar')"
                            >
                            <v-icon left color="orange">mdi-update</v-icon>
                            Salvar e Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid #2196F3; color: #2196F3;"
                            @click="validarSalvarTipoChamado('salvar-novo')"
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
    const formCadastroTipoChamado = ref(null)

    // Validação do formulário de ramo de atividade
    const validaCadastroTipoChamado = ref(false)

    // Variável para armazenar o ID da empresa (0 para nova empresa)
    const idTipoChamadoRecebido = ref(0);

    // Salva o id da empresa
    idTipoChamadoRecebido.value = Number(route.query.idTipoChamado) || 0;

    // Dados do ramo de atividade
    const dadosTipoChamados= ref({
        idTipoChamado: 0,
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
        if (idTipoChamadoRecebido.value != 0){

            // Carrega os dados da empresa para edição
            try {
                
                // Chama a API para buscar os dados da empresa pelo ID
                const { data: respostaApi } = await axios.get(`${API_BASE_URL}/administracao/carregaTipoChamado/${idTipoChamadoRecebido.value}`)
                
                if (respostaApi) {

                    // Atribui os dados retornados da API para a variável dadosTipoChamados
                    dadosTipoChamados.value = respostaApi;

                    // Converte os campos TINYINT(1) para booleanos
                    dadosTipoChamados.value.ativo = dadosTipoChamados.value.ativo === 1;                    
                }

            } catch (erro) {
                erroStore.exibirErro(erro)
            }
        }
    })

    // Limpa campos do cadastro de empresas
    function limpadadosTipoChamados(){

        dadosTipoChamados.value = {
            idTipoChamado: 0,
            nome: '',
            ativo: true
        }
        
        // Limpa o id de tipo de chamado recebido da lista
        idTipoChamadoRecebido.value = 0
    }

    // Regra personalizada para validar campos
    async function validarSalvarTipoChamado(funcaoRetorno) {
        
        // Valida o formulário de empresa
        const isValid = await formCadastroTipoChamado.value?.validate()

        // Se o formulário for válido chama a função para salvar os dados
        if (isValid.valid) {

            // Chama a função para salvar os dados da empresa
            salvardadosTipoChamados(funcaoRetorno)

        } else {            
            snackbar.trigger('Preencha os campos obrigatórios.', 'error');
        }
    }    

    // Esta função salva ou edita os dados de uma empresa
    async function salvardadosTipoChamados(funcaoRetorno) {

        try {
            
            // Busca o ID da empresa para saber se é inclusão ou edição
            const {data: resposta } = await axios.post(`${API_BASE_URL}/administracao/salvaTipoChamado/${idTipoChamadoRecebido.value}`, dadosTipoChamados.value)
            
            // Atualiza o idEmpresa com o valor retornado da API
            idTipoChamadoRecebido.value = resposta.idTipoChamado;

            // Exibe mensagem de sucesso
            snackbar.trigger('Tipo Chamado Salvo Com Sucesso.', 'success');

            if (funcaoRetorno == 'salvar'){
                return
            } else if (funcaoRetorno == 'salvar-retornar'){
                router.push({ name: 'ListaTiposChamados' })
            } else {
                limpadadosTipoChamados()
            }

        } catch (erro) {
            erroStore.exibirErro(erro)
        }
    } 

</script>