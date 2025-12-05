<template>

    <v-app>
      
        <!-- Barra azul -->
        <v-app-bar app color="primary" dark>
            
            <v-toolbar-title>GESTÃO DE CHAMADOS - {{ loginStore.nomeFantasia }}</v-toolbar-title>
            <v-spacer />

            <!-- Botões opcionais -->
            <v-btn 
                v-if="autorizacaoLogin.estaLogado"
                text 
                :title="`Alterar Senha Usuário: ${loginStore.nomeColaborador}`"
                @click="abrirAlteracaoSenha"
            >
                <v-icon left size="28">mdi-account</v-icon>                
            </v-btn>

            <v-btn 
                v-if="autorizacaoLogin.estaLogado"
                text 
                @click="sair"
                title="Sair do Sistema"
            >
                <v-icon left size="28">mdi-door-open</v-icon>                
            </v-btn>

        </v-app-bar>

        <!-- Menu lateral -->
        <v-navigation-drawer 
            app 
            permanent 
            color="white"
            dark width="260" 
        > 
            <div class="navigation-content">

                <a target="_blank" class="estilo-link-site" href="https://suita.com.br">
                    <img class="logo-suita mt-4 mb-4" src="./assets/suitalogo.png" />
                </a>  

                <!-- Mostrar menu só se estiver logado -->
                <div v-if="autorizacaoLogin.estaLogado" class="treeview-container">

                    <!-- Nó Raiz: Cadastros -->
                    <div class="tree-node">
                        
                        <v-list-item 

                            v-if="loginStore.empresaManutencao"
                            @click="toggleNode('cadastros')"
                            class="node-header"
                        >
                            <template #prepend>
                                <v-icon icon="mdi-folder" class="node-icon" />
                            </template>
                            
                            <v-list-item-title class="node-label">Cadastros</v-list-item-title>
                            
                            <template #append>                                
                                <v-icon 
                                  v-if="expandedNodes.cadastros" 
                                  icon="mdi-chevron-down" 
                                  size="small"
                                />
                                <v-icon 
                                  v-else 
                                  icon="mdi-chevron-right" 
                                  size="small"
                                />
                            </template>
                        
                        </v-list-item>
                        
                        <v-expand-transition>

                            <div v-if="expandedNodes.cadastros" class="node-children">

                                <!-- Empresas -->
                                <v-list-item 
                                    :to="{ name: 'ListaEmpresas' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-office-building" class="leaf-icon" />
                                    </template>
                                    
                                    <v-list-item-title>Empresas</v-list-item-title>
                                
                                </v-list-item>
                                
                                <!-- Ramos Atividade -->
                                <v-list-item 
                                    :to="{ name: 'ListaRamosAtividade' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >                                    
                                    <template #prepend>
                                        <v-icon icon="mdi-briefcase" class="leaf-icon" />
                                    </template>
                                    
                                    <v-list-item-title>Ramos Atividade</v-list-item-title>

                                </v-list-item>
                                
                                <!-- Status Crédito -->
                                <v-list-item 
                                    :to="{ name: 'ListaStatusCredito' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-credit-card" class="leaf-icon" />
                                    </template>

                                    <v-list-item-title>Status Crédito</v-list-item-title>

                                </v-list-item>
                                
                                <!-- Status Negociação -->
                                <v-list-item 
                                    :to="{ name: 'ListaStatusNegociacao' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >                                    
                                    <template #prepend>
                                        <v-icon icon="mdi-handshake" class="leaf-icon" />
                                    </template>

                                    <v-list-item-title>Status Negociação</v-list-item-title>

                                </v-list-item>
                                
                                <!-- Produtos -->
                                <v-list-item 
                                    :to="{ name: 'ListaProdutos' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-package-variant" class="leaf-icon" />
                                    </template>

                                    <v-list-item-title>Produtos</v-list-item-title>

                                </v-list-item>
                                
                                <!-- Tipos de Chamados -->
                                <v-list-item 
                                    :to="{ name: 'ListaTiposChamados' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-ticket" class="leaf-icon" />
                                    </template>

                                    <v-list-item-title>Tipos Chamado</v-list-item-title>

                                </v-list-item>
                                
                                <!-- E-mail -->
                                <v-list-item 
                                    :to="{ name: 'ListaEmail' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-email" class="leaf-icon" />
                                    </template>
                                    
                                    <v-list-item-title>E-mail</v-list-item-title>

                                </v-list-item>

                                <!-- Cadastro Mensagens -->
                                <v-list-item 
                                    :to="{ name: 'ListaMensagens' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-message-text" class="leaf-icon" />
                                    </template>
                                    
                                    <v-list-item-title>Mensagens</v-list-item-title>

                                </v-list-item>

                            </div>

                        </v-expand-transition>

                    </div>

                    <!-- Nó Raiz: Funções -->
                    <div class="tree-node">                      

                        <v-list-item 
                            @click="toggleNode('funcoes')"
                            class="node-header"
                            :class="{ 'active-node': expandedNodes.funcoes }"
                        >
                            <template #prepend>
                                <v-icon icon="mdi-cog" class="node-icon" />
                            </template>
                        
                            <v-list-item-title class="node-label">Funções</v-list-item-title>
                        
                            <template #append>
                                <v-icon 
                                    v-if="expandedNodes.funcoes" 
                                    icon="mdi-chevron-down" 
                                    size="small"
                                />
                                <v-icon 
                                    v-else 
                                    icon="mdi-chevron-right" 
                                    size="small"
                                />
                            </template>
                          
                        </v-list-item>
                        
                        <v-expand-transition>

                            <div v-if="expandedNodes.funcoes" class="node-children">
                            
                                <!-- Chamados -->
                                <v-list-item
                                    v-if="loginStore.empresaManutencao === 1"
                                    :to="{ name: 'CadastroChamados' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-phone" class="leaf-icon" />
                                    </template>
                                    <v-list-item-title>Chamados</v-list-item-title>
                                </v-list-item>

                                <v-list-item
                                    v-else
                                    :to="{ name: 'CadastroChamadosCliente' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-phone" class="leaf-icon" />
                                    </template>
                                    <v-list-item-title>Chamados</v-list-item-title>
                                </v-list-item>  

                                <!-- Cadastro Negociações -->
                                <v-list-item 
                                    v-if="loginStore.empresaManutencao"
                                    :to="{ name: 'CadastroNegociacoes' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-message-text" class="leaf-icon" />
                                    </template>
                                    
                                    <v-list-item-title>Negociacoes</v-list-item-title>

                                </v-list-item>

                                <!-- Relatórios 
                                <v-list-item 
                                    :to="{ name: 'Relatorios' }"
                                    class="tree-leaf"
                                    active-class="active-leaf"
                                    density="compact"
                                >
                                    <template #prepend>
                                        <v-icon icon="mdi-chart-bar" class="leaf-icon" />
                                    </template>

                                    <v-list-item-title>Relatórios</v-list-item-title>

                                </v-list-item>
                                -->
                            </div>
                        </v-expand-transition>
        
                    </div>
        
                </div>
        
            </div>
        
        </v-navigation-drawer>

        <!-- Conteúdo principal -->
        <v-main>
          <v-container fluid class="pa-4">
                <router-view />  
          </v-container>
          <AppSnackbar />      
        </v-main>

        <ModalErro />

         <!-- Modal Global -->
        <ModalAlteraSenha 
            v-model="modalSenhaAberto"
        />

    </v-app>

</template>

<script setup>

    import { useAuthStore } from '@/stores/authStore'
    import { ref, onMounted, onUnmounted, reactive } from 'vue'  
    import { useRouter } from 'vue-router'
    
    // Importa o componente do formulário de login
    import { useLoginStore } from '@/stores/loginStore'
    import { useSessionTimeout } from '@/composables/useSessionTimeout'

    import CadastroChamados from './views/CadastroChamados.vue'
    import CadastroChamadosCliente from './views/CadastroChamadosCliente.vue'
    
    import ModalErro from '@/components/ModalErro.vue'
    import AppSnackbar from '@/components/AppSnackbar.vue'
    import  ModalAlteraSenha from '@/components/ModalAlterarSenha.vue'
    import { useErroStore } from '@/stores/erroStore'
    
    // Carrega o endereço das api's
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Importa a store de chamados
    const loginStore = useLoginStore()
    const { setupActivityListeners, cleanup } = useSessionTimeout()

    const erroStore = useErroStore()
    const autorizacaoLogin = useAuthStore()
    const router = useRouter()
    
    const modalSenhaAberto = ref(false)

    // Função para alterar senha
    const abrirAlteracaoSenha = () => {
        modalSenhaAberto.value = true
    }
    
    // Estado dos nós expandidos - MOVIDO para dentro do script setup
    const expandedNodes = reactive({
        cadastros: false,
        funcoes: true
    })

    // Função para alternar a expansão dos nós - MOVIDO para dentro do script setup
    const toggleNode = (nodeName) => {
        expandedNodes[nodeName] = !expandedNodes[nodeName]
    }
    
    function sair() {
        
        //CadastroChamados.value = false
        autorizacaoLogin.deslogar()        
    }

    onMounted(() => {
        
        // Verifica se está logado
        if (loginStore.idColaborador) {
            
            // Verifica se a sessão expirou
            const expired = loginStore.checkSessionExpiry()
            
            if (!expired) {
                // Atualiza timestamp e inicia monitoramento
                loginStore.updateActivity()
                setupActivityListeners()
            }
        }
    })

    onUnmounted(() => {
        cleanup()
    })

</script>

<style scoped>

    /* REMOVE TODOS OS ESPAÇAMENTOS DO VUETIFY */
    .main-content {
        margin-top: 64px !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .main-content .v-main__wrap {
        padding: 0 !important;
        margin: 0 !important;
    }

    /* FORÇA REMOVER CONTAINERS INTERNOS */
    :deep(.container) {
        max-width: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    :deep(.v-container) {
        max-width: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .navigation-content {
        padding: 0 10px;
    }

    .estilo-link-site {
        text-decoration: none;
        color: #fff;
        display: block;
        text-align: center;
    }
    
      /*Logo Suita Menu Lateral*/
      .logo-suita {
        width: 90%;
        height: auto;
        display: block;
        margin: 0 auto;
    }

    /* Ajuste para garantir que o conteúdo não fique escondido */
    :deep(.v-navigation-drawer__content) {
        overflow-y: auto;
    }

    /* ESTILOS DO TREEVIEW INTEGRADOS */
    .treeview-container {
        font-family: 'Roboto', sans-serif;
        font-size: 13px;
        user-select: none;
        padding: 6px 0;
        margin-top: 10px;
    }

    .tree-node {
        margin-bottom: 5px;
    }

    /* Para diminuir apenas os itens filhos */
    .tree-leaf {
        font-size: 13px !important;
    }

    /* Para diminuir especificamente o texto dos v-list-item */
    .tree-leaf .v-list-item-title {
        font-size: 13px !important;
    }

    .node-header .v-list-item-title {
        font-size: 16px !important;
    }

    .node-header {
        cursor: pointer;
        border-radius: 4px;
        margin: 2px 8px;
        min-height: 40px;
        transition: all 0.2s ease;
    }

    .node-header:hover {
        background-color: rgba(25, 118, 210, 0.08);
    }

    .active-node {
        background-color: rgba(25, 118, 210, 0.12);
    }

    .node-label {
        font-weight: 600;
        color: #2c3e50;
        font-size: 0.9rem;
    }

    .node-icon {
        color: #6c757d;
        margin-right: 12px;
    }

    .node-children {
        margin-left: 16px;
        border-left: 2px solid #e0e0e0;
        padding-left: 8px;
    }

    .tree-leaf {
        min-height: 36px;
        margin: 1px 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .tree-leaf:hover {
        background-color: rgba(25, 118, 210, 0.04);
    }

    .tree-leaf.active-leaf {
        background-color: rgba(25, 118, 210, 0.1);
        color: #1976d2;
    }

    .tree-leaf.active-leaf .leaf-icon {
        color: #1976d2;
    }

    .leaf-icon {
        font-size: 18px;
        margin-right: 12px;
        color: #6c757d;
    }

    /* Ajustes para itens compactos */
    :deep(.v-list-item--density-compact) {
        min-height: 36px;
    }

    /* Remove o padding extra dos itens da lista */
    :deep(.v-list-item__prepend) {
        margin-right: -8px;
    }
</style>