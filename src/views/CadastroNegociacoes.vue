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
                style="border-top-left-radius: 12px; border-top-right-radius: 8px;"
            >      
                <v-toolbar-title class="white--text">Registro Negociações ({{ totalItems }})</v-toolbar-title> 
                <v-spacer />

                <!-- Botão para incluir novo registro de negociação  -->
                <v-col cols="auto">

                    <v-tooltip text="Novo Registro Negociação" location="top">

                        <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon
                            large
                            class="rounded-button"
                            style="background-color: #4CAF50;"
                            @click="novaNegociacao"
                        >
                            <v-icon color="white">mdi-plus</v-icon>
                        </v-btn>
                        </template>

                    </v-tooltip>

                </v-col>
                
            </v-toolbar>

            <!-- Acordeão para o formulário -->
            <v-expansion-panels v-model="painelAberto">

                <v-expansion-panel>

                    <v-expansion-panel-title>
                        <template v-slot:actions>
                            <v-icon :icon="painelAberto === 0 ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                        </template>   
                    </v-expansion-panel-title>
                    
                    <v-expansion-panel-text>

                        <!-- Layout com proporções fixas -->
                        <div class="form-container">

                            <v-row dense>
                                
                                <!-- Campo Empresa com Autocomplete -->                                            
                                <v-col cols="12" sm="6">

                                    <v-autocomplete
                                        :model-value="registroNegociacao.nomeFantasia"
                                        :items="sugestoesEmpresa"
                                        :loading="carregandoEmpresa"
                                        item-title="title"
                                        item-value="value"
                                        :return-object="true"
                                        label="Empresa"
                                        placeholder="Digite o nome da empresa..."
                                        hide-details="auto"
                                        clearable
                                        @update:model-value="eventoEmpresaSelecionada"
                                        @update:search="buscarEmpresaDebounced"
                                        @keydown="handleKeydown($event, 0)"
                                        :rules="[rules.required]"
                                    >
                                        <template #no-data>
                                            <div class="pa-2 ajusteCorpoFonte">
                                                Digite pelo menos 2 caracteres para buscar
                                            </div>
                                        </template>
                                    </v-autocomplete>
                                </v-col>

                                <!-- Campo Colaborador com Autocomplete -->
                                <v-col cols="12" sm="6">

                                    <v-autocomplete
                                        v-model="registroNegociacao.colaborador"
                                        :items="sugestoesColaboradores"
                                        :loading="carregandoColaboradores"
                                        item-title="title"
                                        item-value="value"
                                        label="Colaborador"
                                        placeholder="Selecione Um Colaborador..."
                                        hide-details="auto"
                                        clearable
                                        :disabled="!registroNegociacao.nomeFantasia" 
                                        @keydown="handleKeydown($event, 1)"
                                        :rules="[rules.required]"
                                    >
                                        <template #no-data>
                                            <div class="pa-2">
                                                {{ registroNegociacao.nomeFantasia ? 'Nenhum Colaborador Encontrado' : 'Selecione Primeiro Uma Empresa' }}
                                            </div>
                                        </template>
                                    </v-autocomplete>

                                </v-col>

                                <!-- Campo Data com DatePicker e TimePicker -->
                                <v-col cols="12" sm="4">

                                    <div class="form-field date-time-field">

                                        <v-menu
                                            v-model="menuData"
                                            :close-on-content-click="false"
                                            location="bottom"
                                            transition="scale-transition"
                                            :disabled="!registroNegociacao.nomeFantasia"
                                            :rules="[rules.required]"
                                        >
                                            <template v-slot:activator="{ props }">
                                                <v-text-field
                                                    v-model="registroNegociacao.dataHoraContato"
                                                    label="Data e Hora Contato"
                                                    placeholder="Selecione Data e Hora..."
                                                    hide-details="auto"
                                                    readonly
                                                    v-bind="props"
                                                    @keydown="handleKeydown($event, 2)"
                                                    class=""
                                                >
                                                    <template v-slot:append>
                                                        <v-icon icon="mdi-calendar-clock" />
                                                    </template>
                                                </v-text-field>
                                            </template>

                                            <v-card class="date-time-card">

                                                <v-card-text class="pa-0">
                                                
                                                    <v-tabs v-model="tabData" grow class="">
                                                
                                                        <v-tab value="date">
                                                            <v-icon icon="mdi-calendar" class="" />
                                                            Data
                                                        </v-tab>
                                                        
                                                        <v-tab value="time">
                                                            <v-icon icon="mdi-clock" class="" />
                                                            Hora
                                                        </v-tab>
                                                
                                                    </v-tabs>

                                                    <v-window v-model="tabData" class="date-time-window">
                                                
                                                        <v-window-item value="date">
                                                
                                                            <v-date-picker
                                                                v-model="dataSelecionada"
                                                                color="primary"
                                                                show-adjacent-months
                                                                locale="pt-BR"
                                                                @update:model-value="onDataSelecionada"
                                                            />
                                                        </v-window-item>

                                                        <v-window-item value="time">
                                                
                                                            <v-time-picker
                                                                v-model="horaSelecionada"
                                                                format="24hr"
                                                                color="primary"
                                                                scrollable
                                                            />
                                                        
                                                        </v-window-item>

                                                    </v-window>

                                                    <v-card-actions class="pt-0 date-time-actions">
                                                        <v-spacer />
                                                        <v-btn
                                                            color="primary"
                                                            variant="text"
                                                            @click="aplicarDataHora"
                                                            :disabled="!dataSelecionada"
                                                        >
                                                            Aplicar
                                                        </v-btn>
                                                    
                                                        <v-btn
                                                            color="secondary"
                                                            variant="text"
                                                            @click="menuData = false"
                                                        >
                                                            Cancelar
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                    </div>

                                </v-col>
                                
                                <!-- Campo produtosInteresse de interesse -->
                                <v-col cols="12" sm="4">

                                    <v-select
                                        v-model="registroNegociacao.produtosInteresse"
                                        :items="listaProdutosInteresse"
                                        item-title="title"
                                        item-value="value"
                                        multiple
                                        chips
                                        clearable
                                        :loading="carregandoProdutos"
                                        label="Produtos Interesse"
                                        :disabled="!registroNegociacao.nomeFantasia"
                                    >
                                        <template v-slot:selection="{ item, index }">

                                            <v-chip v-if="index < 2" class="me-1">
                                                <span>{{ item.title }}</span>
                                            </v-chip>
                                            
                                            <span v-if="index === 2" class="text-grey text-caption ms-1">
                                                +{{ registroNegociacao.produtosInteresse.length - 2 }} outros
                                            </span>

                                        </template>

                                    </v-select>

                                </v-col>
                                
                                <v-col cols="12" sm="4">

                                    <v-select
                                        v-model="registroNegociacao.statusNegociacao"
                                        :items="listaStatusNegociacao"
                                        label="Status Negociação"
                                        item-title="title"
                                        item-value="value"
                                        :loading="carregandoStatusNegociacao"
                                        clearable
                                        :disabled="!registroNegociacao.nomeFantasia"
                                    ></v-select>

                                </v-col>

                                <!-- Campo Descrição da negociação -->
                                <v-col cols="12" sm="12">

                                    <div>

                                        <div class="form-field">

                                            <label class="v-label">Descrição</label>
                                            
                                            <TiptapEditor 
                                                v-if="registroNegociacao.nomeFantasia"
                                                v-model="registroNegociacao.descricao"
                                                @keydown="handleKeydown($event, 3)" 
                                                :rules="[rules.required]"                                               
                                            />
                                        </div>

                                    </div>

                                </v-col>

                                <v-col cols="12">

                                    <v-file-input
                                        v-model="mostraAnexosNegociacao"
                                        multiple
                                        label="Selecione os arquivos"
                                        prepend-icon="mdi-paperclip"
                                        @change="manipuladorArquivoNegociacao"
                                        :loading="fazendoUploadNegociacao"
                                        :disabled="!registroNegociacao.nomeFantasia"
                                        class="ma-4"
                                        :clearable="false"
                                    >
                                        <template v-slot:selection="{ file }">

                                            <v-chip
                                            
                                                v-for="(fileObj, index) in arquivosAnexadosNegociacao"
                                                :key="fileObj.uniqueId || index"
                                                close
                                                class="ma-1"
                                                :color="fileObj.isExisting ? 'primary' : 'default'"
                                            >
                                                {{ fileObj.displayName }}

                                                <!-- Ícone para remover o arquivo -->
                                                <v-icon
                                                    class="ml-2"
                                                    color="red"
                                                    size="18"
                                                    @click.stop="removeAnexoNegociacao(index)"
                                                    style="cursor: pointer;"
                                                >
                                                    mdi-close-circle
                                                </v-icon>

                                                <!-- Ícone para download, se o arquivo já existir -->
                                                <v-icon 
                                                    v-if="fileObj.isExisting" 
                                                    class="ml-1"
                                                    color="blue"
                                                    size="18"
                                                    @click.stop="downloadArquivoNegociacao(fileObj)"
                                                    style="cursor: pointer;"
                                                >
                                                    mdi-download
                                                </v-icon>

                                            </v-chip>
                                            
                                        </template>

                                    </v-file-input>

                                    <!-- Barra de mensagem verde -->
                                    <v-alert
                                        v-model="showMessageNegociacao"
                                        :type="messageType"
                                        density="compact"
                                        variant="tonal"
                                        class="mt-2 mb-4 mx-4"
                                    >
                                        {{ messageText }}
                                    </v-alert>
                                    
                                    <v-progress-linear
                                        v-if="fazendoUploadNegociacao"
                                        v-model="uploadProgressNegociacao"
                                        color="light-blue"
                                        height="10"
                                        class="ma-4"
                                    >
                                    </v-progress-linear>

                                    <v-alert
                                        v-if="uploadMessageNegociacao"
                                        :type="isError ? 'error' : 'success'"
                                        class="ma-4"
                                    >
                                        {{ uploadMessageNegociacao }}
                                    </v-alert>

                                </v-col>

                            </v-row>
                            
                            <!-- Botões de ação DENTRO do accordion -->
                            <v-row class="mt-4">

                                <v-col cols="12" class="d-flex gap-2 flex-wrap">

                                    <v-spacer />
                                    <v-btn
                                        @click="limpaCamposNegociacao"
                                        color="secondary"
                                        prepend-icon="mdi-broom"
                                        variant="outlined"
                                    >
                                        Limpar
                                    </v-btn>

                                    <v-btn
                                        @click="salvaNegociacao"
                                        :color="registroNegociacao.id !== 0 ? 'warning' : 'success'"
                                        :prepend-icon="registroNegociacao.id !== 0 ? 'mdi-update' : 'mdi-content-save'"
                                        variant="flat"
                                        :loading="salvando"
                                    >
                                        {{ registroNegociacao.id !== 0 ? 'Atualizar' : 'Salvar' }}
                                    </v-btn>
                                </v-col>

                            </v-row>

                        </div>

                    </v-expansion-panel-text>

                </v-expansion-panel>

            </v-expansion-panels>

            <!-- Tabela de dados existentes -->
            <v-card  class="mb-6" variant="outlined">

                <v-card-text class="pa-0">

                    <div class="table-container">

                        <!-- Campo de busca -->
                        <v-card-title>
                            
                            <v-text-field
                                v-model="textoBusca"
                                label="Pesquisar"
                                placeholder="Digite sua busca..."
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                clearable
                                @keyup.enter="carregaListaNegociacoes"
                                @click:clear="carregaListaNegociacoes"
                                @update:modelValue="atualizaParamentrosBusca"
                            />
                        </v-card-title>
                        
                        <!-- Tabela com os dados de negociação -->
                        <v-data-table-server
                            v-model:options="opcoesTabelaNegociacoes"
                            :headers="headersNegociacoes"
                            :items="listaNegociacoes"
                            :items-length="totalItems"
                            :loading="carregandoNegociacao"
                            @update:options="carregaListaNegociacoes"
                        >
                            <!-- Slot para renderizar cada linha -->
                            <template #item="{ item }">

                                <tr>
                                    <td>
                                        <v-btn 
                                            icon 
                                            variant="text" 
                                            color="green" 
                                            size="small"
                                            @click="editaDadosNegociacao(item)"
                                            title="Editar negociação"
                                        >
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </td>

                                    <td>
                                        <a href="#" @click.prevent="editaDadosNegociacao(item)"> <!-- ✅ Corrigido -->
                                            {{ item.id }}
                                        </a>
                                    </td>
                                    <td>{{ item.nomeFantasia }}</td>
                                    <td>{{ item.colaborador }}</td>
                                    <td>{{ item.statusNegociacao }}</td>
                                    <td>{{ item.dataHoraContato }}</td>
                                    <td>{{ item.produtosInteresse }}</td>
                                    <td>{{ item.descricao }}</td>
                                </tr>

                            </template>

                        </v-data-table-server>

                    </div>
                
                </v-card-text>

            </v-card>

        </v-main>

    </v-app>

</template>

<script setup>

    import { onMounted, watch, ref } from 'vue'
    import { useEditor, EditorContent } from '@tiptap/vue-3'
    import TiptapEditor from '../components/TiptapEditor.vue'
    import StarterKit from '@tiptap/starter-kit'
    import axios from 'axios'
    
    // Retorna um objeto com informações internas sobre o componente que está sendo executado no momento    
    import { getCurrentInstance } from 'vue'

    // Permite acessar rotinas globais
    const { proxy } = getCurrentInstance()

    // Importa o componente do formulário de erros
    import { useErroStore } from '@/stores/erroStore'
    
    // Importa o componente do Snackbar
    import { useSnackbarStore } from '@/stores/snackbar'

    // Carrega o endereço das api's
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Importa a store de erros
    const erroStore = useErroStore()

    // Importa a store do snackbar
    const snackbar = useSnackbarStore()
    
    // Define array contendo o campo que deve ser ordenado inicialmente e a direção
    const opcoesTabelaNegociacoes = ref({ 
        page: 1,
        itemsPerPage: -1,
        sortBy: ['negociacoes_empresas.id'],
        sortDesc: [false]
    })
    
    // Variável contendo os campos da lista de negociações
    const headersNegociacoes = [
        { title: 'Ações', text: 'Ações', value: 'actions', width: '1%', sortable: false },
        { title: 'Código', text: 'Código', value: 'id', width: '1%', sortable: true },
        { title: 'Empresa', text: 'Empresa', value: 'nomeFantasia', width: '10%', sortable: true },
        { title: 'Colaborador', text: 'Colaborador', value: 'colaborador', width: '10%', sortable: true },
        { title: 'Status', text: 'Status', value: 'statusNegociacao', width: '10%', sortable: true },        
        { title: 'Data Contato', text: 'Data Contato', value: 'dataHoraContato', width: '10%', sortable: true },
        { title: 'Produtos', text: 'Produtos', value: 'produtosInteresse', width: '10%', sortable: true },
        { title: 'Descrição', text: 'Descrição', value: 'descricao', width: '49%', sortable: true }
    ]

    // Define elemento da lista de Negociacao
    const listaNegociacoes = ref([])

    // 🔄 Dados da tabela
    const carregandoNegociacao = ref(false)
    
    // Total de itens da tabela
    const totalItems = ref(0)
    
    // Cria variável para elemento do texto de busca
    const textoBusca = ref('')

    // Controle do accordion
    const painelAberto = ref(null) // null = fechado, 0 = aberto

    // Refs para os dados principais
    const registroNegociacao = ref({
        id: 0,
        idEmpresa: null,
        nomeFantasia: '',
        colaborador: null,
        dataHoraContato: null,
        produtosInteresse: [],
        statusNegociacao: [],
        descricao: '',
        arquivosAnexadosNegociacao: []
    })

    // Regras de validação
    const rules = {
        required: v => !!v || 'Campo obrigatório'
    }

    // Refs para controle do autocomplete da empresa
    const sugestoesEmpresa = ref([])
    const carregandoEmpresa = ref(false)
    let timeoutId = null

    // Refs para controle do autocomplete dos colaboradores
    const sugestoesColaboradores = ref([])
    const carregandoColaboradores = ref(false)
    
    // Variáveis reativas
    const listaProdutosInteresse = ref([])
    const carregandoProdutos = ref(false)
    
    const listaStatusNegociacao = ref([])
    const carregandoStatusNegociacao = ref(false)
    
    const dataSelecionada = ref(null)
    const horaSelecionada = ref(null)
    
    // Controle de estado
    const salvando = ref(false)

    // Variáveis para o datepicker
    const menuData = ref(false)
    const tabData = ref('date')

    const mostraAnexosNegociacao = ref([]);
    const arquivosAnexadosNegociacao = ref([]);
    const fazendoUploadNegociacao = ref(false);
    const uploadProgressNegociacao = ref(0);    
    
    // Controle da mensagem
    const showMessageNegociacao = ref(false);
    
    const props = defineProps({
        modelValue: {
            type: String,
            default: ''
        }
    })

    // Define as variáveis do editor de textos
    const emit = defineEmits(['update:modelValue'])
    const editor = useEditor({
        content: props.modelValue,
        extensions: [StarterKit],
        onUpdate: () => {
            emit('update:modelValue', editor.value.getHTML())
        }
    })

    // Função de autocomplete para Empresa
    async function buscarEmpresas(termo) {

        // Verifica se foi digitado algum termo para busca se este tem mais de 2 caracteres
        if (!termo || termo.length < 2) {
            sugestoesEmpresa.value = []
            return
        }

        // Liga variável indicando que está carregando empresas
        carregandoEmpresa.value = true
        
        try {
            
            // Chama api de autocompleta cliente passando o termo digitado
            const resposta = await axios.get(`${API_BASE_URL}/operacao/autoCompletaCliente`, {
                params: { termo: termo }
            })

            // Formata os resultados para o autocomplete
            sugestoesEmpresa.value = resposta.data.map(cliente => ({
                value: cliente.id,
                title: cliente.nomeFantasia
            }))

        } catch (erro) {
            erroStore.exibirErro(erro)
        } finally {
            carregandoEmpresa.value = false
        }
    }

    // Inicializar linha atual - CORRIGIDO
    async function limpaCamposNegociacao() {

        Object.assign(registroNegociacao.value, {
            id: 0,
            idEmpresa: null,
            nomeFantasia: '',
            colaborador: [],
            statusNegociacao: [],
            dataHoraContato: null,
            produtosInteresse: [],
            descricao: ''
        })
        
        // Limpa arrya de sugestões de empresa
        sugestoesEmpresa.value = [];

        // Limpa arrya de sugestões de colaboradores
        sugestoesColaboradores.value = [];
        
        // Restante do código...
        tabData.value = 'date';

        // Busca todos produtos cadastrados
        const { data: dataProdutos } = await axios.get(`${API_BASE_URL}/administracao/carregaListaProdutos`);
        
        // Carrega a lista de produtos de interesse
        listaProdutosInteresse.value = dataProdutos.data.map(produto => ({
            title: produto.nome,
            value: produto.idProduto
        }));

        // Busca todos status negociação cadastrados
        const { data: dataStatusNegociacao } = await axios.get(`${API_BASE_URL}/administracao/carregaListaStatusNegociacao`);
        
        // Carrega a lista de produtos de interesse
        listaStatusNegociacao.value = dataStatusNegociacao.data.map(produto => ({
            title: produto.nome,
            value: produto.idStatusNegociacao
        }));
    }
    
    // Se o campo foi limpo, recarrega a lista de Negociacao
    function atualizaParamentrosBusca(novoValor) {
        if (!novoValor) {
            carregaListaNegociacoes(novoValor)
        }
    }
    
    // Função para quando uma data é selecionada
    function onDataSelecionada(data) {
        
        // Se não há hora definida, define uma padrão (ex: 12:00)
        if (!horaSelecionada.value) {
            horaSelecionada.value = '14:00';
        }
        
        // Muda automaticamente para a aba de hora
        setTimeout(() => {
            tabData.value = 'time';
        }, 100);
    }

    // Debounce para otimizar as requisições
    const buscarEmpresaDebounced = (termo) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            buscarEmpresas(termo)
        }, 300)
    }
    
    // Salva a data selecionada
    const aplicarDataHora = () => {

        if (dataSelecionada.value && horaSelecionada.value) {
            
            // Define hora padrão se não houver seleção
            const hora = horaSelecionada.value || '14:00'
            
            // Converte a data selecionada (que vem no formato YYYY-MM-DD)
            const dataObj = new Date(dataSelecionada.value)
            
            // Adiciona a hora
            const [horas, minutos] = hora.split(':')
            dataObj.setHours(parseInt(horas), parseInt(minutos))
            
            // Formata para dd/mm/yyyy hh:mm
            const dia = String(dataObj.getDate()).padStart(2, '0')
            const mes = String(dataObj.getMonth() + 1).padStart(2, '0')
            const ano = dataObj.getFullYear()
            
            const dataHoraFormatada = `${dia}/${mes}/${ano} ${hora}`
            
            // Armazena o resultado onde você precisar
            registroNegociacao.value.dataHoraContato = dataHoraFormatada

            // Fecha o menu
            menuData.value = false
            
            return dataHoraFormatada
            
        } else {
            snackbar.trigger('Selecione uma data primeiro', 'error')
            return null
        }
    }
    
    // Função chamada quando uma empresa é selecionada
    const eventoEmpresaSelecionada = async (empresaSelecionada) => {

        const idSelecao = empresaSelecionada.value

        // Verifica se recebeu dados na variável idSelecao
        if (idSelecao) {

            try {
              
                // Encontra a empresa seleciona na lista de sugestões usando idSelecao
                const empresaSelecionada = sugestoesEmpresa.value.find(buscaEmpresa => buscaEmpresa.value === idSelecao)

                // Verifica se encontrou a empresa na lista de sugestões
                if (empresaSelecionada) {
                  
                    // Atualiza ambos: ID e nome
                    registroNegociacao.value.idEmpresa = empresaSelecionada.value
                    registroNegociacao.value.nomeFantasia = empresaSelecionada.title
                    
                    // Carrega os colaboradores da empresa selecionada
                    await carregarColaboradores(idSelecao)
                }
            } catch (erro) {
                erroStore.exibirErro(erro)
            }

        } else {

            // Se a empresa foi desmarcada, limpa os sugestoesColaboradores
            registroNegociacao.Empresa = ''
            registroNegociacao.Colaborador = ''
            sugestoesColaboradores.value = []
        }
    }

    // Função para carregar colaboradores
    const carregarColaboradores = async (empresaId) => {

        if (!empresaId) {
            sugestoesColaboradores.value = []
            return
        }
        
        carregandoColaboradores.value = true
        sugestoesColaboradores.value = []
        
        try {

            const { data: resposta } = await axios.get(`${API_BASE_URL}/administracao/carregaListaColaboradores/${empresaId}`)
            
            // Mapeia os dados para o formato que o v-autocomplete espera
            sugestoesColaboradores.value = resposta.data.map(colaborador => ({
                title: colaborador.nome, // Texto que será exibido
                value: colaborador.id
            }));

        } catch (erro) {
            erroStore.exibirErro(erro)
            sugestoesColaboradores.value = []
        } finally {
            carregandoColaboradores.value = false
        }
    }

    // Carregar do localStorage - CORRIGIDO
    const carregaListaNegociacoes = async () => {

        try {

            // Verifica se não está carregando a lista de negociações
            if (carregandoNegociacao.value == false){

                // liga indicação de carga da lista de negociações
                carregandoNegociacao.value = true;
                
                // Blindagem contra estados intermediários
                const sortArray = Array.isArray(opcoesTabelaNegociacoes.value?.sortBy) 
                    ? opcoesTabelaNegociacoes.value.sortBy 
                    : []
                
                const primeiraOrdenacao = sortArray.length ? sortArray[0] : null

                // // 2) Defaults estáveis (sem jamais acessar [0] de algo indefinido)
                const ordenacaoPor = primeiraOrdenacao?.key ?? 'negociacoes_empresas.id'
                const direcaoOrdenacao = primeiraOrdenacao?.order ?? 'desc'
                
                // Extrai paginação
                const paginaAtual = opcoesTabelaNegociacoes.value.page ?? 1
                const itensPorPagina = opcoesTabelaNegociacoes.value.itemsPerPage ?? 10
                
                // limpa lista
                listaNegociacoes.value = [];

                // Reseta valor total de registros
                totalItems.value = 0;
                
                // Chama api para carregar a lista de negociações passando parâmetros de ordenação e texto para busca
                const { data } = await axios.get(`${API_BASE_URL}/operacao/carregaListaNegociacoes`, {
                    params: { 
                        textoBusca: textoBusca.value,
                        ordenacaoPor: ordenacaoPor || 'negociacoes_empresas.id',  
                        direcaoOrdenacao: direcaoOrdenacao || 'desc',
                        paginaAtual: paginaAtual,
                        itensPorPagina: itensPorPagina                        
                    }
                });
                
                // Garente que o retorno seja um array
                const retorno = data.data || [];

                // Verifica se encontrou dados
                if (retorno.length > 0) {

                    // Formata dados para inserir na tabela
                    listaNegociacoes.value = retorno.map(item => ({
                        id: item.id,
                        nomeFantasia: item.nomeFantasia,
                        colaborador: item.colaborador,
                        statusNegociacao: item.statusNegociacao,
                        dataHoraContato: item.dataHoraContato ? 
                            new Date(item.dataHoraContato).toLocaleString('pt-BR') : '',
                        produtosInteresse: item.produtosInteresse,
                        descricao: removerHTML(item.descricao),
                        idEmpresa: item.idEmpresa,
                        idColaborador: item.idColaborador
                    }));
                    
                    totalItems.value = retorno.length;
                }
            }

        } catch (erro) {                
            carregandoNegociacao.value = false;
            erroStore.exibirErro(erro);
        } finally {
            carregandoNegociacao.value = false;
        }
    };

    // Esta função é chamada pelo botão verde localizado na barra preta do formulário
    const novaNegociacao = async () => {
    
        // Limpa campos do formulário
        await limpaCamposNegociacao();

        // Expande acordeon
        painelAberto.value = 0
    }

    // Formata o tamanho do arquivo
    const formatFileSize = (bytes) => {
        if (!bytes || isNaN(bytes)) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // Função para atualizar o v-model com os arquivos atuais do chamado
    const manipuladorArquivoNegociacao = (event) => {

        // Verifica se o evento contém arquivos, sai da função se não houver
        const arquivoEntrada = event.target.files;

        if (!arquivoEntrada || arquivoEntrada.length === 0) return;

        // Converte lista de arquivos para array e filtra arquivos já selecionados
        const novoArquivo = Array.from(arquivoEntrada).filter(arquivo => {

                // Verifica se o arquivo NÃO está já na lista arquivosAnexadosChamado
                return !arquivosAnexadosNegociacao.value.some(
                    existingFile => 
                        existingFile.name === arquivo.name && 
                        existingFile.size === arquivo.size
                );
            
        }).map(arquivo => ({
                
            name: arquivo.name,
            size: arquivo.size,
            type: arquivo.type || 'application/octet-stream',
            lastModified: arquivo.lastModified || Date.now(),
            raw: arquivo,       
            uniqueId: null,     
            isExisting: false,
            displayName: `${arquivo.name} (${formatFileSize(arquivo.size)})`,
            serverName: null    

        }));

        // Atualiza a lista de arquivos mostrados
        if (novoArquivo.length > 0) {

            // Salva o novo arquivo na lista de todos os anexos
            arquivosAnexadosNegociacao.value = [...arquivosAnexadosNegociacao.value, ...novoArquivo];
            
            // Atualiza o displayFiles para mostrar os novos arquivos
            snackbar.trigger(`${novoArquivo.length} Novo(s) Arquivo(s) Adicionado(s)`, 'success');

        } else {
            
            // Todos os arquivos selecionados já estão na lista
            snackbar.trigger('Arquivo Já Está Na Seleção', 'warning');
        }

        event.target.value = '';
    };

    // Download de arquivo existente
    const downloadArquivoNegociacao = async (file) => {

        // Verifica se o arquivo tem um nome de servidor válido
        if (!file.serverName) return;
                    
        // Retira nome do arquivo do caminho
        const nomeArquivo = file.path.split('\\').pop();

        try{

            // Faz a requisição para baixar o arquivo
            fetch(`${API_BASE_URL}/api/download/${nomeArquivo}`).then((res) => {
            
                if (!res.ok) throw new Error('Erro ao baixar');       
                
                return res.blob();
            
            }).then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name || nomeArquivo;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            });

        } catch (erro) {            
            erroStore.exibirErro(erro)
        }
    };

    // Valida campos obrigatórios do cadastro de negociação se estão preenchidos
    const validarAntesDeSalvar = () => {

        const negociacao = registroNegociacao.value;
        
        const camposObrigatorios = [
            { campo: 'idEmpresa', nome: 'Empresa' },
            { campo: 'colaborador', nome: 'Colaborador' },
            { campo: 'dataHoraContato', nome: 'Data/Hora' },
            { campo: 'descricao', nome: 'Descrição' }
        ];
        
        const camposFaltantes = camposObrigatorios.filter(({ campo, nome }) => {

            const valor = negociacao[campo];
            
            return campo === 'descricao' 
                ? !valor || valor.trim() === ''
                : !valor;
        });
        
        if (camposFaltantes.length > 0) {
            
            const mensagem = `Os seguintes campos são obrigatórios: ${camposFaltantes.map(c => c.nome).join(', ')}`;
            
            erroStore.exibirErro(mensagem);
            return false;
        }
        
        return true;
    };

    // Salvar linha - VERSÃO COMPLETA
    const salvaNegociacao = async () => {
        
        if (validarAntesDeSalvar()) {
        
            salvando.value = true;

            try {

                // Executa upload de arquivos
                const resultadoUpload = await uploadArquivosNegociacao();
                
                // Se upload não retornou erro, salva os dados dos arquivos anexados
                if (resultadoUpload.status != 'erro') {

                    // Extrai apenas os dados necessários
                    var dadosAnexos = arquivosAnexadosNegociacao.value.map(arquivo => ({
                        originalName: arquivo.name,
                        path: arquivo.path,
                        serverName: arquivo.serverName,
                        size: arquivo.size, 
                        uniqueId: arquivo.uniqueId               
                    }));
                }

                const dadosSalvar = {
                    id: registroNegociacao.value.id,
                    idEmpresa: registroNegociacao.value.idEmpresa,
                    idColaborador: registroNegociacao.value.colaborador,
                    idStatusNegociacao: registroNegociacao.value.statusNegociacao,
                    dataHoraContato: registroNegociacao.value.dataHoraContato,
                    produtosInteresse: registroNegociacao.value.produtosInteresse || [],
                    descricao: registroNegociacao.value.descricao,
                    arquivosAnexosNegociacao: dadosAnexos || [], 
                }
                
                // Salva registro da negociação
                const resposta = await axios.post(`${API_BASE_URL}/operacao/salvaNegociacao/${registroNegociacao.value.id}`, dadosSalvar);
                    
                if (registroNegociacao.value.id === 0) {                
                    snackbar.trigger('Negociação atualizada com sucesso!', 'success');
                } else {                
                    snackbar.trigger('Negociação salva com sucesso!', 'success');
                }

                // Limpa dados do formulário
                await limpaCamposNegociacao();

                // Carrega lista de negociações
                carregaListaNegociacoes();

                painelAberto.value = 1

            } catch (erro) {
                erroStore.exibirErro(erro);
            } finally {
                salvando.value = false;
            }
        }
    };

    // Editar linha - CORRIGIDO
    const editaDadosNegociacao = async (item) => {
        
        try{

            // Limpa campos referentes a negociação
            await limpaCamposNegociacao();

            // Busca dados da negociação apontada por item.id
            const { data: dataNegociacoes } = await axios.get(`${API_BASE_URL}/operacao/carregaNegociacao/${item.id}`);
            
            // Salva o id da negociação selecionada
            registroNegociacao.value.id = dataNegociacoes.data.id
            
            // Salva o id da empresa selecionada
            registroNegociacao.value.idEmpresa = dataNegociacoes.data.idEmpresa
            
            // Configurar empresa no v-autocomplete
            registroNegociacao.value.nomeFantasia = {
                title: dataNegociacoes.data.nomeFantasia,
                value: dataNegociacoes.data.idEmpresa
            };

            // Adicionar também às sugestões para que apareça selecionada
            sugestoesEmpresa.value = [{
                value: dataNegociacoes.data.idEmpresa,
                title: dataNegociacoes.data.nomeFantasia                
            }];

            // Carrega lista d ecolaboradores
            carregarColaboradores(dataNegociacoes.data.idEmpresa);
            
            // Aponta para o colaborador cadastrado
            registroNegociacao.value.colaborador = dataNegociacoes.data.idColaborador;
            
            // Salva a data e hora convertidas para padrão brasileiro
            registroNegociacao.value.dataHoraContato = proxy.$formataDataBrasil(dataNegociacoes.data.dataHoraContato)
            
            // Carrega os produtos de interesse cadastrados 
            registroNegociacao.value.produtosInteresse = dataNegociacoes.data.produtosInteresse

                .map(produto => {
                    
                    const produtoCompleto = listaProdutosInteresse.value.find(
                        protutoEncontrado => protutoEncontrado.value === produto.idProduto
                    );
                    return produtoCompleto ? produtoCompleto.value : null;
                })
                .filter(produto => produto !== null);
            
            // Salva descrição da negociação
            registroNegociacao.value.descricao = dataNegociacoes.data.descricao            

            // Aponta para o status da negociação vindos da api
            registroNegociacao.value.statusNegociacao = dataNegociacoes.data.idStatusNegociacao

            // Verifica se a resposta é um array indicando que existem arquivos anexados
            if (Array.isArray(registroNegociacao.arquivosAnexadosNegociacao)) {

                const arquivosExistentes = registroNegociacao.arquivosAnexadosNegociacao.map(arquivo => ({
                    name: arquivo.name,
                    size: arquivo.size,
                    serverName: arquivo.serverName,
                    path: arquivo.path,
                    isExisting: true,
                    displayName: `${arquivo.name}`,
                    uniqueId: arquivo.uniqueId,
                    raw: null // Arquivos existentes não têm o objeto File original
                }));
                
                // uploadedFiles.value = arquivosExistentes;
                arquivosAnexadosNegociacao.value = [...arquivosExistentes, ...arquivosAnexadosNegociacao.value.filter(filtro => !filtro.isExisting)];
                
                // Atualize o v-model do v-file-input
                mostraAnexosNegociacao.value = arquivosExistentes.map(aquivoVfile => ({
                    name: aquivoVfile.name,
                    size: aquivoVfile.size,
                    type: 'application/octet-stream', // Tipo genérico para arquivos existentes
                    lastModified: Date.now()
                }));
            }

            // Abre o accordion
            painelAberto.value = 0

        } catch(erro){
           erroStore.exibirErro(erro);     
        }
    };

    // Excluir linha
    const deleteRow = (index) => {        

    }

    // Esta rotina executa o upload dos arquivos do chamado
    const uploadArquivosNegociacao = async () => {

        // Filtra apenas arquivos que ainda não foram enviados (sem uniqueId)
        const arquivosParaUpload = arquivosAnexadosNegociacao.value.filter(arquivo =>
            !arquivo.uniqueId && arquivo.raw
        );

        // Se não houver arquivos para upload, retorna erro
        if (arquivosParaUpload.length === 0) {
            return { status: 'erro' };
        }

        try {

            // Indica que o upload está em andamento
            fazendoUploadNegociacao.value = true;

            // Cria o FormData para o upload
            const formData = new FormData();
            
            // Adiciona cada arquivo ao FormData
            arquivosParaUpload.forEach(arquivo => {
                formData.append('files', arquivo.raw, arquivo.name);
            });

            // Chama API para upload dos arquivos
            const { data: retornoApi } = await axios.post(`${API_BASE_URL}/api/uploadArquivos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Atualiza os arquivos com os dados retornados da API
            arquivosAnexadosNegociacao.value = arquivosAnexadosNegociacao.value.map(arquivo => {

                // Encontra o arquivo correspondente na resposta da API
                const arquivoEnviado = retornoApi.files.find(comparaArquivo =>
                    comparaArquivo.originalName === arquivo.name && comparaArquivo.size === arquivo.size
                );
                
                return arquivoEnviado ? 
                {
                    ...arquivo,
                    serverName: arquivoEnviado.serverName,
                    path: arquivoEnviado.path,
                    uniqueId: arquivoEnviado.uniqueId,
                    isExisting: true,
                    displayName: `${arquivoEnviado.originalName} (${formatFileSize(arquivoEnviado.size)})`
                } : arquivo;
            });            

            return { status: 'sucesso' };
            
        } catch (erro) {

            erroStore.exibirErro(erro)
            return { status: 'erro' };

        } finally {
            fazendoUploadNegociacao.value = false;
        }
    };
    
    
    // Remove um arquivo anexo do negociação
    const removeAnexoNegociacao = async (index) => {

        // Verifica se o índice é válido
        if (index < 0 || index >= arquivosAnexadosNegociacao.value.length) return;
        
        // Busca o arquivo a ser removido
        const arquivoParaRemover = arquivosAnexadosNegociacao.value[index];

        // Mostra mensagem de sucesso
        snackbar.trigger(`Arquivo ${arquivoParaRemover.displayName} Removido Com Sucesso!`, 'success');

        // Remove o arquivo da lista local
        arquivosAnexadosNegociacao.value.splice(index, 1);

        // Remove o arquivo da lista negociações
        mostraAnexosNegociacao.value = [...arquivosAnexadosNegociacao.value];
        
        // Se o arquivo já foi salvo, exclui
        if (arquivoParaRemover.uniqueId){

            // Chama API para remover o arquivo do servidor
            const retorno = await axios.delete(`${API_BASE_URL}/operacao/excluirArquivoAnexoNegociacao/${arquivoParaRemover.uniqueId}`)
        }
    };

    // Navegação com teclado
    const handleKeydown = (event, currentIndex) => {

        switch (event.key) {

            case 'Enter':

                event.preventDefault()

                break
            
            case 'Tab':
                if (event.shiftKey && currentIndex > 0) {

                    event.preventDefault()
                    const prevInput = document.querySelectorAll('.form-field')[currentIndex - 1]
                    if (prevInput) {
                        const input = prevInput.querySelector('input') || prevInput
                        input.focus()
                    }
                }
                break
            
            case 'Escape':
                limpaCamposNegociacao()
                break
        }
    }

    // Esta rotina remove os comandos htlm da descrição para mostrar texto puro na lista
    const removerHTML = (texto) => {

        if (!texto) return ''
        
        // Cria um elemento temporário
        const div = document.createElement('div')
        div.innerHTML = texto
        
        // Retorna apenas o texto, sem as tags
        return div.textContent || div.innerText || ''
    }

    // Scroll para o formulário
    const scrollToForm = () => {

        const formElement = document.querySelector('.v-card')
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' })
        }
    }

    // Sincroniza o conteúdo entre o componente pai e o editor Tiptap
    watch(() => props.modelValue, (value) => {
        
        const isSame = editor.value.getHTML() === value
        if (isSame) return

        editor.value.commands.setContent(value, false)
    })

    // Watch para quando o menu fecha
    watch(menuData, (novoValor) => {

        if (!novoValor) {

            // Reseta as abas quando o menu fecha
            setTimeout(() => {
                tabData.value = 'date'
            }, 300)
        }
    })

    // Rotina chamada quando o formulário é inicializado
    onMounted(() => {
        
        // Fecha acordeon
        painelAberto.value = 1
        
        // Carrega lista de negociações
        carregaListaNegociacoes()
    })

</script>

<style scoped>

    .form-container {
        width: 100%;
    }

    .ajusteCorpoFonte :deep(.v-field__input) {
        font-size: 11px !important; /* Tamanho menor */
    }

    .cadastro-negociacoes {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
        padding: 20px;
    }

    .css-negocicao {
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .form-grid-proportional {
        display: flex;
        gap: 12px;
        align-items: start;
        flex-wrap: wrap;
        width: 100%;
    }

    .form-field {
        min-width: 0;
        flex-shrink: 0;
    }

    .width-10 {
        flex: 0 0 calc(10% - 11px);
        max-width: calc(10% - 11px);
    }

    .width-20 {
        flex: 0 0 calc(20% - 11px);
        max-width: calc(20% - 11px);
    }

    .width-25 {
        flex: 0 0 calc(25% - 11px);
        max-width: calc(25% - 11px);
    }

    .width-40 {
        flex: 0 0 calc(40% - 11px);
        max-width: calc(40% - 11px);
    }

    .width-50 {
        flex: 0 0 calc(50% - 11px);
        max-width: calc(50% - 11px);
    }

    .date-time-field {
        position: relative;
    }

    .date-time-input {
        cursor: pointer;
    }

    .table-container {
        width: 100%;
        overflow-x: auto;
    }

    .proportional-table {
        width: 100%;
        table-layout: fixed;
    }

    .column-width-10 {
        width: 10%;
        min-width: 80px;
    }

    .column-width-20 {
        width: 20%;
        min-width: 120px;
    }

    .column-width-25 {
        width: 25%;
        min-width: 150px;
    }

    .column-width-40 {
        width: 40%;
        min-width: 180px;
    }

    .column-width-50 {
        width: 50%;
        min-width: 200px;
    }

    .actions-column {
        width: 120px;
        min-width: 120px;
    }

    .table-row:hover {
        background-color: rgba(0, 0, 0, 0.02);
        transition: background-color 0.2s ease;
    }

    :deep(.v-card-title) {
        padding: 16px 24px;
    }

    :deep(.v-table) {
        border-radius: 8px;
    }

    :deep(.v-table th) {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #2c3e50;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :deep(.v-table td) {
        border-bottom: 1px solid #e0e0e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .gap-2 {
       gap: 8px;
    }

    :deep(.v-autocomplete .v-field) {
        min-height: 56px;
    }

    :deep(.v-autocomplete .v-field__input) {
        padding-top: 8px;
    }

    /* CORREÇÕES SIMPLIFICADAS PARA O DATEPICKER */
    :deep(.date-time-card) {
        min-width: 328px;
    }

    :deep(.date-time-tabs) {
        min-height: 48px;
    }

    :deep(.date-time-actions) {
        padding: 8px 16px;
        border-top: 1px solid #e0e0e0;
    }

    :deep(.date-time-field .v-field) {
        cursor: pointer;
    }

    :deep(.date-time-field .v-field__input) {
        cursor: pointer;
    }

    /* REMOVIDAS TODAS AS LIMITAÇÕES DE ALTURA */
    /* O Vuetify vai controlar automaticamente a altura */

    .width-20 :deep(.v-field) {
        width: 100%;
    }

    @media (max-width: 1200px) {
        .form-grid-proportional {
            gap: 8px;
        }
        
        .width-10 {
            flex: 0 0 calc(15% - 7px);
            max-width: calc(15% - 7px);
        }
        
        .width-20 {
            flex: 0 0 calc(25% - 7px);
            max-width: calc(25% - 7px);
        }
        
        .width-40 {
            flex: 0 0 calc(50% - 7px);
            max-width: calc(50% - 7px);
        }
        
        .width-50 {
            flex: 0 0 calc(50% - 7px);
            max-width: calc(50% - 7px);
        }
    }

    @media (max-width: 960px) {
        .cadastro-negociacoes {
            padding: 16px;
        }
      
        .form-grid-proportional {
            flex-direction: column;
            gap: 12px;
        }
        
        .width-10,
        .width-20,
        .width-25,
        .width-40,
        .width-50 {
            flex: 0 0 100%;
            max-width: 100%;
        }
        
        .proportional-table {
            table-layout: auto;
        }
        
        .column-width-10,
        .column-width-20,
        .column-width-25,
        .column-width-40,
        .column-width-50 {
            width: auto;
            min-width: 100px;
        }

        :deep(.date-time-card) {
            min-width: 300px;
            max-width: 90vw;
        }
    }

    @media (max-width: 600px) {
        .cadastro-negociacoes {
            padding: 12px;
        }
        
        :deep(.v-card-title .text-h5) {
            font-size: 1.25rem;
        }
        
        .table-container {
            font-size: 0.875rem;
        }
        
        .actions-column {
            width: 100px;
            min-width: 100px;
        }
        
        :deep(.date-time-card) {
            min-width: 280px;
            max-width: 95vw;
        }
    }

    @media (min-width: 1600px) {
        .form-grid-proportional {
            max-width: 1400px;
            margin: 0 auto;
        }
    }

    .disabled-field {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Opcional: estilizar o editor quando desabilitado */
    .disabled-field .tiptap-editor {
        pointer-events: none;
        background-color: #f5f5f5;
    }
</style>