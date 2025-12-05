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
                <v-toolbar-title class="white--text">Cadastro Mensagens</v-toolbar-title> 
                <v-spacer />
            
            </v-toolbar>

            <!-- Conteúdo com espaçamento -->
            <v-container fluid class="pa-4">

                <!-- Card que agrupa elementos do formulário  -->
                <v-card class="pa-4" style="width: 100%; top: 60px">
                
                    <v-form ref="formCadastroMensagens" v-model="validaCadastroMensagens">
                
                        <v-row>
                
                            <v-col cols="12" sm="5">
                                <!-- Select que mostra a lista provedores de e-mail -->
                                <v-select
                                    v-model="dadosMensagem.idProvedor"
                                    :items="dadosMensagem.provedor"
                                    label="Provedor"
                                    item-title="title"
                                    item-value="value"
                                    :rules="[rules.required]"
                                    clearable
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="5">
                                <v-text-field 
                                    label="Assunto" 
                                    v-model="dadosMensagem.assunto"
                                    :rules="[rules.required]"
                                    v-uppercase
                                />
                            </v-col>

                            <v-col cols="12" md="2" class="d-flex align-center">
                                <v-switch
                                    :label="dadosMensagem.ativo ? 'Ativo' : 'Inativo'"
                                    :color="dadosMensagem.ativo ? 'blue' : 'white'"
                                    v-model="dadosMensagem.ativo"
                                />
                            </v-col>

                            <v-col cols="12">

                                <!-- EDITOR DE TEXTO -->
                                <div class="text-editor-wrapper">

                                    <label class="editor-label">Mensagem</label>
                                    
                                    <div class="text-editor" :class="{ 'has-error': hasErrorMensagem }">

                                        <!-- Toolbar do Editor -->
                                        <div class="toolbar">
                                        
                                            <div class="toolbar-group">

                                                <!-- Fonte -->
                                                <v-select
                                                    v-model="fonteIncial"
                                                    :items="opcoesFonte"
                                                    density="compact"
                                                    variant="outlined"
                                                    hide-details
                                                    class="font-select"
                                                    placeholder="Fonte"
                                                />
                                                
                                                <!-- Tamanho -->
                                                <v-select
                                                    v-model="tamanhoInicial"
                                                    :items="opcoesTamanho"
                                                    density="compact"
                                                    variant="outlined"
                                                    hide-details
                                                    class="size-select"
                                                    placeholder="Tamanho"
                                                />

                                            </div>
                                            
                                            <div class="toolbar-group">
                                                
                                                <!-- Formatação -->
                                                <v-btn
                                                    icon
                                                    size="small"
                                                    :class="{ 'active': isActive('bold') }"
                                                    @click="formatText('bold')"
                                                    title="Negrito (Ctrl+B)"
                                                >
                                                    <v-icon>mdi-format-bold</v-icon>
                                                </v-btn>
                                                
                                                <v-btn
                                                    icon
                                                    size="small"
                                                    :class="{ 'active': isActive('italic') }"
                                                    @click="formatText('italic')"
                                                    title="Itálico (Ctrl+I)"
                                                >
                                                    <v-icon>mdi-format-italic</v-icon>
                                                </v-btn>
                                                
                                                <v-btn
                                                    icon
                                                    size="small"
                                                    :class="{ 'active': isActive('underline') }"
                                                    @click="formatText('underline')"
                                                    title="Sublinhado (Ctrl+U)"
                                                >
                                                    <v-icon>mdi-format-underline</v-icon>
                                                </v-btn>

                                            </div>

                                        </div>
                                        
                                        <!-- Área de Edição -->
                                        <div
                                            ref="editorRef"
                                            class="editor-content"
                                            contenteditable="true"
                                            @input="onInputMensagem"
                                            @blur="onBlurMensagem"
                                            @keydown="onKeydown"
                                            @paste="onPaste"
                                            :style="editorStyles"
                                        ></div>
                                    </div>
                                    
                                    <div v-if="hasErrorMensagem" class="error-message">
                                        <v-icon color="error" size="small">mdi-alert-circle</v-icon>
                                        Campo mensagem é obrigatório
                                    </div>

                                </div>

                            </v-col>
                            
                        </v-row>

                    </v-form>

                    <v-card-actions>

                        <v-spacer />
                        
                        <v-btn
                            class="ma-2"
                            style="background-color: orange; color: white;"
                            @click="$router.push({ name: 'ListaMensagens' })"
                            >
                            <v-icon left>mdi-chevron-left</v-icon>
                            Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            style="background-color: #2196F3; color: white;"
                            @click="validarSalvarMensagem('salvar')"
                            >
                            <v-icon left color="white">mdi-update</v-icon>
                            Salvar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid orange; color: orange;"
                            @click="validarSalvarMensagem('salvar-retornar')"
                            >
                            <v-icon left color="orange">mdi-update</v-icon>
                            Salvar e Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid #2196F3; color: #2196F3;"
                            @click="validarSalvarMensagem('salvar-novo')"
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
    import { ref, watch, onMounted, computed, nextTick } from 'vue'
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
    const formCadastroMensagens = ref(null)

    // Validação do formulário de ramo de atividade
    const validaCadastroMensagens = ref(false)

    // Referência do editor
    const editorRef = ref(null)

    // Configuração da fonte inicial do editor
    const fonteIncial = ref('Arial')
    
    // Configuração do corpo inicial do editor
    const tamanhoInicial = ref('14px')

    // Variável para armazenar o ID da empresa (0 para nova empresa)
    const idMensagemRecebido = ref(0);

    // Salva o id da empresa
    idMensagemRecebido.value = Number(route.query.idMensagem) || 0;

    // Watch para sincronizar as seleções com dadosMensagem
    watch(fonteIncial, (newFont) => {
        dadosMensagem.value.fonte = newFont
    })

    watch(tamanhoInicial, (newSize) => {
        dadosMensagem.value.tamanho = newSize
    })
    
    // Dados do ramo de atividade
    const dadosMensagem= ref({
        idMensagem: 0,
        idProvedor: null,
        provedor: [],
        assunto: '',
        mensagem: '',
        fonte: 'Arial',
        tamanho: '14px',
        ativo: true
    })

    // Opções de FONTE
    const opcoesFonte = [
        { title: 'Arial', value: 'Arial' },
        { title: 'Times New Roman', value: 'Times New Roman' },
        { title: 'Courier New', value: 'Courier New' },
        { title: 'Georgia', value: 'Georgia' },
        { title: 'Verdana', value: 'Verdana' }
    ]

    // Oções corpo da fonte
    const opcoesTamanho = [
        { title: '10', value: '10px' },
        { title: '12', value: '12px' },
        { title: '14', value: '14px' },
        { title: '16', value: '16px' },
        { title: '18', value: '18px' },
        { title: '20', value: '20px' },
        { title: '22', value: '22px' },
        { title: '24', value: '24px' },
        { title: '28', value: '28px' },
        { title: '30', value: '32px' },
        { title: '34', value: '34px' },
        { title: '36', value: '36px' }
    ]

    // Estilos do editor baseados nas seleções
    const editorStyles = computed(() => {
        return {
            fontFamily: dadosMensagem.value.fonte,
            fontSize: dadosMensagem.value.tamanho
        }
    })

    // Validação específica para o campo mensagem
    const hasErrorMensagem = computed(() => {
        const textContent = getPlainText()
        return !textContent
    })

    // Regras de validação
    const rules = {
        required: v => !!v || 'Campo obrigatório'
    }

    // Funções do Editor
    const execCommand = (command, value = null) => {
        if (editorRef.value) {
            document.execCommand(command, false, value)
            editorRef.value.focus()
            updateModelValue()
        }
    }

    const formatText = (command) => {
        execCommand(command)
    }

    // Verifica se uma formatação está ativa
    const isActive = (command) => {
        return document.queryCommandState(command)
    }

    // Atualiza o v-model
    const updateModelValue = () => {
        if (editorRef.value) {
            const content = editorRef.value.innerHTML
            dadosMensagem.value.mensagem = content
        }
    }

    const onInputMensagem = () => {
        updateModelValue()
    }

    const onBlurMensagem = () => {
        updateModelValue()
    }

    // Processa paste para limpar formatação indesejada
    const onPaste = (event) => {
        event.preventDefault()
        const text = event.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
        updateModelValue()
    }

    // Atalhos de teclado
    const onKeydown = (event) => {
        // Ctrl+B - Negrito
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault()
            formatText('bold')
        }
        // Ctrl+I - Itálico
        if (event.ctrlKey && event.key === 'i') {
            event.preventDefault()
            formatText('italic')
        }
        // Ctrl+U - Sublinhado
        if (event.ctrlKey && event.key === 'u') {
            event.preventDefault()
            formatText('underline')
        }
    }

    // Obtém texto sem formatação HTML para validação
    const getPlainText = () => {
        if (editorRef.value) {
            return editorRef.value.textContent || editorRef.value.innerText || ''
        }
        return dadosMensagem.value.mensagem.replace(/<[^>]*>/g, '')
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
        if (idMensagemRecebido.value != 0){

            try {
                // Carrega todos provedores
                const { data: dadosProvedor } = await axios.get(`${API_BASE_URL}/administracao/carregaListaProvedores`)
                
                dadosMensagem.value.provedor = dadosProvedor.data.map(item => ({
                    title: item.provedor,
                    value: Number(item.idProvedor)
                }))
                
                // Chama a API para buscar os dados das mensagens
                const { data: respostaApi } = await axios.get(`${API_BASE_URL}/administracao/carregaMensagem/${idMensagemRecebido.value}`)
                
                if (respostaApi) {

                    // Atualiza os dados - garante que idProvedor é número
                    dadosMensagem.value.idProvedor = Number(respostaApi.idProvedor)
                    dadosMensagem.value.assunto = respostaApi.assunto
                    dadosMensagem.value.mensagem = respostaApi.mensagem
                    dadosMensagem.value.ativo = Boolean(respostaApi.ativo)
                    dadosMensagem.value.idMensagem = Number(respostaApi.idMensagem)

                    // CARREGA OS VALORES DE FONTE E TAMANHO SE EXISTIREM
                    if (respostaApi.fonte) {
                        dadosMensagem.value.fonte = respostaApi.fonte
                        fonteIncial.value = respostaApi.fonte
                    }
                    if (respostaApi.tamanho) {
                        dadosMensagem.value.tamanho = respostaApi.tamanho
                        tamanhoInicial.value = respostaApi.tamanho
                    }
                    
                    // Sincroniza o editor com os dados carregados
                    nextTick(() => {
                        if (editorRef.value && respostaApi.mensagem) {
                            editorRef.value.innerHTML = respostaApi.mensagem
                        }
                    })
                }
            } catch (erro) {
                erroStore.exibirErro(erro)
            }

        } else {

            // Carrega provedores mesmo para novo registro
            try {
                const { data: dadosProvedor } = await axios.get(`${API_BASE_URL}/administracao/carregaListaProvedores`)
                dadosMensagem.value.provedor = dadosProvedor.data.map(item => ({
                    title: item.provedor,
                    value: Number(item.idProvedor)
                }))
            } catch (erro) {
                erroStore.exibirErro(erro)
            }
        }
    })

    // Limpa campos do cadastro de empresas
    function limpadadosMensagem(){

        dadosMensagem.value = {
            idMensagem: 0,
            idProvedor: null,
            provedor: dadosMensagem.value.provedor, // Mantém os provedores carregados
            assunto: '',
            mensagem: '',
            fonte: 'Arial',
            tamanho: '14px',
            ativo: true
        }
        
        // Reseta as seleções visuais
        fonteIncial.value = 'Arial'
        tamanhoInicial.value = '14px'
        
        // Limpa id da mensagem recebida da lista
        idMensagemRecebido.value = 0

        // Limpa o editor
        if (editorRef.value) {
            editorRef.value.innerHTML = ''
        }
    }

    // Regra personalizada para validar campos
    async function validarSalvarMensagem(funcaoRetorno) {
        // Valida o formulário de empresa
        const isValid = await formCadastroMensagens.value?.validate()

        // Validação adicional para o campo mensagem
        const mensagemValida = getPlainText().trim().length > 0

        // Se o formulário for válido chama a função para salvar os dados
        if (isValid.valid && mensagemValida) {
            // Chama a função para salvar os dados da empresa
            salvardadosMensagem(funcaoRetorno)
        } else {            
            snackbar.trigger('Preencha os campos obrigatórios.', 'error');
        }
    }    

    // Esta função salva ou edita os dados de uma empresa
    async function salvardadosMensagem(funcaoRetorno) {
        try {
            // Busca o ID da empresa para saber se é inclusão ou edição
            const {data: resposta } = await axios.post(`${API_BASE_URL}/administracao/salvaMensagem/${idMensagemRecebido.value}`, dadosMensagem.value)
            
            // Atualiza o idMensagem com o valor retornado da API
            idMensagemRecebido.value = resposta.idMensagem;

            // Exibe mensagem de sucesso
            snackbar.trigger('Mensagem Salva Com Sucesso.', 'success');

            if (funcaoRetorno == 'salvar'){
                return
            } else if (funcaoRetorno == 'salvar-retornar'){
                router.push({ name: 'ListaMensagens' })
            } else {
                limpadadosMensagem()
            }

        } catch (erro) {
            erroStore.exibirErro(erro)
        }
    } 
</script>

<style scoped>
    .text-editor-wrapper {
        width: 100%;
    }

    .editor-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
    }

    .text-editor {
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
        background: white;
    }

    .text-editor.has-error {
        border-color: #d32f2f;
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f8f9fa;
        border-bottom: 1px solid #e0e0e0;
        gap: 12px;
    }

    .toolbar-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .font-select,
    .size-select {
        min-width: 120px;
        max-width: 140px;
    }

    .toolbar .v-btn {
        border: 1px solid #ddd;
        background: white;
    }

    .toolbar .v-btn.active {
        background: #1976d2;
        color: white;
    }

    .toolbar .v-btn:hover {
        background: #e3f2fd;
    }

    .toolbar .v-btn.active:hover {
        background: #1565c0;
    }

    .editor-content {
        min-height: 200px;
        max-height: 400px;
        padding: 16px;
        outline: none;
        overflow-y: auto;
        line-height: 1.5;
        color: #333;
    }

    .editor-content:focus {
        background-color: #fafafa;
    }

    .editor-content[data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #999;
        font-style: italic;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #d32f2f;
        font-size: 12px;
        margin-top: 4px;
        padding: 0 4px;
    }

    /* Estilos para o conteúdo editável */
    .editor-content strong {
        font-weight: bold;
    }

    .editor-content em {
        font-style: italic;
    }

    .editor-content u {
        text-decoration: underline;
    }

    /* Ajustes responsivos */
    @media (max-width: 768px) {
        .toolbar {
            flex-direction: column;
            gap: 8px;
        }
        
        .toolbar-group {
            width: 100%;
            justify-content: space-between;
        }
        
        .font-select,
        .size-select {
            min-width: 100px;
        }
    }
</style>