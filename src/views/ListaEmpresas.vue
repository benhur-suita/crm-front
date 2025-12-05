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
                <v-toolbar-title class="white--text">Empresas Cadastradas: ({{ qntEmpresas }})</v-toolbar-title> 
                <v-spacer />
                
                <!-- Botão para incluir nova empresa -->
                <v-col cols="auto">
                    <v-tooltip text="Nova Empresa" location="top">
                        <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon
                            large
                            class="rounded-button"
                            style="background-color: #4CAF50;"
                            @click="criaNovaEmpresa"
                        >
                            <v-icon color="white">mdi-plus</v-icon>
                        </v-btn>
                        </template>
                    </v-tooltip>
                </v-col>
                
            </v-toolbar>

            <!-- Conteúdo com espaçamento -->
            <v-container fluid class="pa-4"> 

                <!-- Card que agrupa busca + tabela -->
                <v-card class="pa-4" style="width: 100%; top: 60px">
            
                    <!-- Campo de busca -->
                    <v-text-field
                        v-model="textoBuscaEmpresa"
                        label="Pesquisar"
                        placeholder="Digite sua busca..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        clearable
                        @keyup.enter="carregaListaEmpresas"
                        @click:clear="carregaListaEmpresas"
                        @update:modelValue="carregaListaEmpresas"
                        class="tabela-pequena"
                    />
                                        
                    <!-- Tabela de dados -->
                    <v-data-table-server
                        item-value="idEmpresa"
                        v-model:options="opcoesTabelaEmpresas"
                        :headers="headersEmpresas"
                        :items="listaEmpresas"
                        :loading="carregandoEmpresa"
                        @update:options="carregaListaEmpresas"
                        class="elevation-2 rounded-lg tabela-pequena"
                        density="compact"
                        :items-length="totalEmpresas"
                        :footer-props="{
                            'items-per-page-text': 'Itens por página'
                        }"
                        
                    >                
                        <template v-slot:item.funcoes="{ item }">
                    
                            <!-- Ícone de atalho para editar chamado -->
                            <v-tooltip text="Editar Empresa" location="bottom">

                                <template #activator="{ props }">

                                    <v-icon
                                        v-bind="props"
                                        :color="item.ativo === 1 ? 'green' : 'red'" 
                                        size="24" 
                                        @click="editaDadosEmpresa(item.idEmpresa)"
                                        style="cursor: pointer; margin-right: 8px;"
                                    >
                                    mdi-pencil
                                    </v-icon>
                                
                                </template>
                            
                            </v-tooltip>
                            
                        </template>
                        
                        <template #item.ativo="{ item }">
                            <span :class="item.ativo === 1 ? 'text-green' : 'text-red'">
                            {{ item.ativo === 1 ? 'Ativo' : 'Inativo' }}
                            </span>
                        </template>
                                            
                    </v-data-table-server>
                
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
    
    const totalEmpresas = ref(0)
    const carregandoEmpresa = ref(false)    
    const textoBuscaEmpresa = ref('')
    const listaEmpresas = ref([])
    const qntEmpresas = ref(0)
    
    const opcoesTabelaEmpresas = ref({ 
        page: 1,
        itemsPerPage: 10,
        sortBy: ['nome'],
        sortDesc: [false]
    })

    // Cria os headers da tabela
    const headersEmpresas = [
        { title: 'Funções', value: 'funcoes', sortable: false },
        { title: 'Código', value: 'idEmpresa', sortable: true },
        { title: 'Empresa', value: 'nomeFantasia', sortable: true },
        { title: 'Apelido', value: 'apelido', sortable: true },
        { title: 'UF', value: 'uf', sortable: true },
        { title: 'Cidade', value: 'cidade', sortable: true },
        { title: 'Último Status', value: 'ultimo_status', sortable: true },
        { title: 'Ramo', value: 'ramoAtividade', sortable: true },
        { title: 'Fone', value: 'fonePrincipal', sortable: true },
        { title: 'Site', value: 'urlSite', sortable: true},
        { title: 'Condição', value: 'ativo', sortable: true }        
    ]

    // Função que será chamada sempre que a tabela mudar de página, ordenação ou filtro
    async function carregaListaEmpresas() {

        // Verifica se não está logado
        if (!autorizacaoLogin.estaLogado){
            
            // Carrega formulário de login
            router.push({ name: 'Login' })
            return
        }

        // Blindagem contra estados intermediários
        const sortArray = Array.isArray(opcoesTabelaEmpresas.value?.sortBy) 
            ? opcoesTabelaEmpresas.value.sortBy 
            : []
        
        const primeiraOrdenacao = sortArray.length ? sortArray[0] : null

        // // 2) Defaults estáveis (sem jamais acessar [0] de algo indefinido)
        const ordenacaoPor = primeiraOrdenacao?.key ?? 'nome'
        const direcaoOrdenacao = primeiraOrdenacao?.order ?? 'asc'
        
        // Extrai paginação
        const paginaAtual = opcoesTabelaEmpresas.value.page ?? 1
        const itensPorPagina = opcoesTabelaEmpresas.value.itemsPerPage ?? 10
        
        // Limpa lista de empresas
        listaEmpresas.value = []

        // Reseta valor total de empresas
        totalEmpresas.value = 0

        try{

            // Verifica se já está carregando dados da empresa
            if (carregandoEmpresa.value == false ){

                // Seta carregando
                carregandoEmpresa.value = true

                // Chama a API para carregar a lista de empresas
                const { data } = await axios.get(`${API_BASE_URL}/administracao/carregaListaEmpresas`,{
                    params: { 
                        textoBuscaEmpresa: textoBuscaEmpresa.value,
                        ordenacaoPor: ordenacaoPor || 'nome',  
                        direcaoOrdenacao: direcaoOrdenacao || 'asc',
                        paginaAtual: paginaAtual,
                        itensPorPagina: itensPorPagina
                    }
                })

                // Garante que mesmo sem dados retorne um array
                const retorno = data.data || []

                qntEmpresas.value = retorno.length

                // Atualiza a lista de empresas e o total
                listaEmpresas.value = retorno
                totalEmpresas.value = data.total            
            }

        } catch(erro){
            
            // Em caso de erro desliga indicador de carregamento e mostra o erro
            carregandoEmpresa.value = false
            erroStore.exibirErro(erro)    
        
        } finally{
            carregandoEmpresa.value = false
        }
    }

    // Esta função chama o cadastro de empresas para criar uma nova empresa
    function criaNovaEmpresa() {        
        router.push({ name: 'CadastroEmpresas', query: { idEmpresa: 0 } })        
    }

    // Esta função chama o cadastro de empresas para editar a empresa apontada por idEmpresa
    function editaDadosEmpresa(idEmpresa) {
        router.push({ name: 'CadastroEmpresas', query: { idEmpresa: idEmpresa } })
    }

</script>

<style>
    .tabela-pequena .v-data-table__td {
        font-size: 12px;
    }
  
</style>
