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
                <v-toolbar-title class="white--text">Tipos Status Crédito Cadastrados: ({{ qntStatusCredito }})</v-toolbar-title> 
                <v-spacer />
                
                <!-- Botão para adicionar novo registro -->
                <v-col cols="auto">
                    <v-tooltip text="Novo Status Crédito" location="top">
                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                icon
                                large
                                class="rounded-button"
                                style="background-color: #4CAF50;"
                                @click="criaNovoStatusCredito"
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
                        v-model="textoBuscaStatusCredito"
                        label="Pesquisar"
                        placeholder="Digite sua busca..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        clearable
                        @keyup.enter="carregaListaStatusCreditos"
                        @click:clear="carregaListaStatusCreditos"
                        @update:modelValue="atualizaParamentrosBusca"
                        class="tabela-pequena"
                    />
                                        
                    <!-- Tabela de dados -->
                    <v-data-table-server
                        item-value="idStatusCredito"
                        v-model:options="opcoesTabelaStatusCredito"
                        :headers="headersStatusCredito"
                        :items="listaStatusCredito"
                        :loading="carregandoStatusCredito"
                        @update:options="carregaListaStatusCreditos"
                        class="elevation-2 rounded-lg tabela-pequena"
                        density="compact"
                        :items-length="totalStatusCredito"
                        :footer-props="{
                            'items-per-page-text': 'Itens por página'
                        }"
                        
                    >                
                        <template v-slot:item.funcoes="{ item }">
                    
                            <!-- Ícone de atalho para editar chamado -->
                            <v-tooltip text="Editar Status Crédito" location="bottom">

                                <template #activator="{ props }">

                                    <v-icon
                                        v-bind="props"
                                        :color="item.ativo === 1 ? 'green' : 'red'" 
                                        size="24" 
                                        @click="editaStatusCredito(item.idStatusCredito)"
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
    
    // Cria referências reativas
    const totalStatusCredito = ref(0)
    const carregandoStatusCredito = ref(false)    
    const textoBuscaStatusCredito = ref('')
    const listaStatusCredito = ref([])
    const qntStatusCredito = ref(0)
    
    const opcoesTabelaStatusCredito = ref({ 
        page: 1,
        itemsPerPage: 10,
        sortBy: ['nome'],
        sortDesc: [false]
    })

    // Cria os headers da tabela
    const headersStatusCredito = [
        { title: 'Editar', value: 'funcoes', sortable: false },
        { title: 'Código', value: 'idStatusCredito', sortable: true },
        { title: 'Status Crédito', value: 'nome', sortable: true },
        { title: 'Condição', value: 'ativo', sortable: true }        
    ]

    // Função que será chamada sempre que a tabela mudar de página, ordenação ou filtro
    async function carregaListaStatusCreditos() {

        // Verifica se não está logado
        if (!autorizacaoLogin.estaLogado){
            
            // Carrega formulário de login
            router.push({ name: 'Login' })
            return
        }

        // Blindagem contra estados intermediários
        const sortArray = Array.isArray(opcoesTabelaStatusCredito.value?.sortBy) 
            ? opcoesTabelaStatusCredito.value.sortBy 
            : []
        
        const primeiraOrdenacao = sortArray.length ? sortArray[0] : null

        // Defaults estáveis (sem jamais acessar [0] de algo indefinido)
        const ordenacaoPor = primeiraOrdenacao?.key ?? 'nome'
        const direcaoOrdenacao = primeiraOrdenacao?.order ?? 'asc'
        
        // Extrai paginação
        const paginaAtual = opcoesTabelaStatusCredito.value.page ?? 1
        const itensPorPagina = opcoesTabelaStatusCredito.value.itemsPerPage ?? 10
        
        // Limpa lista de empresas
        listaStatusCredito.value = []

        // Reseta valor total de empresas
        totalStatusCredito.value = 0

        try{

            // Verifica se já está carregando dados da empresa
            if (carregandoStatusCredito.value == false ){

                // Seta carregando
                carregandoStatusCredito.value = true

                // Chama a API para carregar a lista de empresas
                const { data } = await axios.get(`${API_BASE_URL}/administracao/carregaListaStatusCredito`,{
                    params: { 
                        textoBuscaStatusCredito: textoBuscaStatusCredito.value,
                        ordenacaoPor: ordenacaoPor || 'nome',  
                        direcaoOrdenacao: direcaoOrdenacao || 'asc',
                        paginaAtual: paginaAtual,
                        itensPorPagina: itensPorPagina
                    }
                })

                // Garante que mesmo sem dados retorne um array
                const retorno = data.data || []

                qntStatusCredito.value = retorno.length

                // Atualiza a lista de empresas e o total
                listaStatusCredito.value = retorno
                totalStatusCredito.value = data.total            
            }

        } catch(erro){
            
            // Em caso de erro desliga indicador de carregamento e mostra o erro
            carregandoStatusCredito.value = false
            erroStore.exibirErro(erro)    
        
        } finally{
            carregandoStatusCredito.value = false
        }
    }

    // Se o campo foi limpo, recarrega a lista de ramos de atividade        
    function atualizaParamentrosBusca(novoValor) {
        if (!novoValor) {
            carregaListaStatusCreditos()
        }
    }

    // Esta função chama o cadastro de empresas para criar uma nova empresa
    function criaNovoStatusCredito() {        
        router.push({ name: 'CadastroStatusCredito', query: { idStatusCredito: 0 } })        
    }

    // Esta função chama o cadastro de empresas para editar a empresa apontada por idStatusCredito
    function editaStatusCredito(idStatusCredito) {
        router.push({ name: 'CadastroStatusCredito', query: { idStatusCredito: idStatusCredito } })
    }
    
</script>

<style>
.tabela-pequena .v-data-table__td {
    font-size: 12px;
}
  
</style>
