<template>
    <v-container fluid class="login-container">
        <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="4">
                <!-- Card de Login Redesenhado -->
                <v-card class="login-card" elevation="8">
                    <!-- Header com gradiente -->
                    <div class="login-header">
                      <v-card-title class="login-title justify-center">
                        <v-icon large class="mr-2">mdi-shield-account</v-icon>
                        Login
                      </v-card-title>
                      <v-card-subtitle class="text-center">
                        Acesse o sistema
                      </v-card-subtitle>
                    </div>

                    <v-card-text class="pa-6">
                        <v-form ref="form" v-model="formLogin">
                            <!-- Campo Usuário -->
                            <v-text-field
                              v-model="loginColaborador"
                              label="Usuário"
                              prepend-inner-icon="mdi-account-outline"
                              variant="outlined"
                              :rules="[v => !!v || 'Informe o usuário']"
                              color="primary"
                              class="mb-4"
                              required
                              density="comfortable"
                            />

                            <!-- Campo Senha -->
                            <v-text-field
                                v-model="senhaColaborador"
                                label="Senha"
                                prepend-inner-icon="mdi-lock-outline"
                                variant="outlined"
                                :type="showPassword ? 'text' : 'password'"
                                :rules="[v => !!v || 'Informe a senha']"
                                color="primary"
                                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="showPassword = !showPassword"
                                class="mb-4"
                                required
                                density="comfortable"
                                @keyup.enter="enviarLogin"
                            />

                            <!-- Select de Empresa (aparece quando há múltiplas empresas) -->
                            <v-select
                                v-model="empresaSelecionada"
                                :items="empresasDisponiveis"
                                label="Selecione a Empresa"
                                item-title="nomeFantasia"
                                item-value="idEmpresa"
                                variant="outlined"
                                prepend-inner-icon="mdi-office-building-outline"
                                color="primary"
                                class="mb-4"
                                :disabled="loading"
                                v-if="mostrarSelectEmpresa"
                                density="comfortable"
                                @update:model-value="selecionarEmpresa"
                            >
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props">
                                        <template v-slot:title>
                                            <strong>{{ item.raw.nomeFantasia }}</strong>
                                        </template>
                                    </v-list-item>
                                </template>
                            </v-select>

                            <!-- Campo Cliente (condicional) -->
                            <v-text-field
                                v-model="nomeEmpresa"
                                @input="nomeEmpresa = $event.toUpperCase()"
                                v-if="mostrarCliente"
                                label="Cliente"
                                prepend-inner-icon="mdi-office-building-outline"
                                variant="outlined"
                                :rules="[v => !!v || 'Informe o cliente']"
                                color="primary"
                                class="mb-4"
                                required
                                density="comfortable"
                                @keyup.enter="enviarLogin"
                            />

                            <!-- Área de ações -->
                            <div class="actions-container">
                                <!-- Link Alterar Senha -->
                                <a 
                                    href="#" 
                                    class="forgot-password-link" 
                                    @click.prevent="abrirAlteracaoSenha"
                                >
                                    <v-icon small class="mr-1">mdi-key</v-icon>
                                    Alterar Senha
                                </a>

                                <!-- Botão Entrar -->
                                <v-btn
                                    color="primary"
                                    @click="enviarLogin"
                                    :loading="loading"
                                    :disabled="loading || (mostrarSelectEmpresa && !empresaSelecionada)"
                                    size="large"
                                    class="login-btn"
                                >
                                  <v-icon left>mdi-login</v-icon>
                                  Entrar
                                </v-btn>

                            </div>

                        </v-form>

                    </v-card-text>

                    <!-- Modal Global -->
                    <ModalAlteraSenha 
                        v-model="modalSenhaAberto"
                    />
                </v-card>

            </v-col>

        </v-row>      

    </v-container>
    
</template>


<script setup>

    import { ref, onMounted, computed  } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/authStore'
    import { useErroStore } from '@/stores/erroStore'
    import { useLoginStore } from '@/stores/loginStore'
    import  ModalAlteraSenha from '@/components/ModalAlterarSenha.vue'
    import axios from 'axios'
    
    // Carrega o endereço das api's
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const autorizacaoLogin = useAuthStore()
    const router = useRouter()
    const erroStore = useErroStore()
    const loginStore = useLoginStore()
    
    // Variáveis originais mantidas
    const loginColaborador = ref('')
    const senhaColaborador = ref('')
    const nomeEmpresa = ref('')
    const mostrarCliente = ref(false)
    const formLogin = ref(false)
    const form = ref(null)

    // Variáveis para o select de empresas
    const empresasDisponiveis = ref([])
    const empresaSelecionada = ref(null)
    const mostrarSelectEmpresa = ref(false)
    const dadosUsuarioCompleto = ref([])
    const modalSenhaAberto = ref(false)

    // Novas variáveis para funcionalidades extras
    const loading = ref(false)
    const showPassword = ref(false)

    onMounted(async () => {
        autorizacaoLogin.deslogar()
    })

    // Função para quando selecionar uma empresa - AGORA ARMAZENA NA STORE
    const selecionarEmpresa = async (idEmpresa) => {

        if (idEmpresa) {

            const usuarioParaLogin = dadosUsuarioCompleto.value.find(
                user => user.idEmpresa === idEmpresa
            )
            
            if (usuarioParaLogin) {

                // Armazena todos os dados na store imediatamente ao selecionar
                const dadosMapeados = {
                    idColaborador: usuarioParaLogin.idColaborador,
                    idEmpresa: usuarioParaLogin.idEmpresa,
                    nomeFantasia: usuarioParaLogin.nomeFantasia,
                    departamentoColaborador: usuarioParaLogin.departamentoColaborador,
                    loginColaborador: loginColaborador.value,
                    nomeColaborador: usuarioParaLogin.nomeColaborador,   
                    emailColaborador: usuarioParaLogin.emailColaborador,
                    empresaManutencao: usuarioParaLogin.empresaManutencao,
                };
                
                // Salva em loginStore os dados da empresa e colaborador
                loginStore.setDadosChamado(dadosMapeados);
            
                // Atualiza o estado de autenticação no store
                await autorizacaoLogin.logar()

                // Redireciona conforme o tipo de empresa
                if (loginStore.empresaManutencao === 1){
                    router.push({ name: 'CadastroChamados' })      
                } else {
                    router.push({ name: 'CadastroChamadosCliente' })      
                }
            }
        }
    }

    // FUNÇÃO ORIGINAL MANTIDA - apenas com loading adicionado
    async function enviarLogin() {
      
      if (loginColaborador.value == ''){
          erroStore.exibirErro('Entre Com Identificação do Usuário')
          return
      }

      if (senhaColaborador.value == ''){
          erroStore.exibirErro('Entre Com Senha do Usuário')
          return
      }

      // Se estiver mostrando o select de empresas, verifica se uma foi selecionada
      if (mostrarSelectEmpresa.value && !empresaSelecionada.value) {
          erroStore.exibirErro('Selecione uma empresa para continuar')
          return
      }

      loading.value = true
      let respostaApi;

      try {

        // Verifica se está mostrando o nome do cliente significando que deve inicializar o sistema
        if (mostrarCliente.value === true){

          // Busca por usuário e senha cadastrados na tabela de contatos
          respostaApi = await axios.post(`${API_BASE_URL}/operacao/inicializaSistema`, {
              loginColaborador: loginColaborador.value,
              senhaColaborador: senhaColaborador.value,
              nomeEmpresa: nomeEmpresa.value
          });
        
        } else {

          // Busca por usuário e senha cadastrados na tabela de contatos
          respostaApi = await axios.post(`${API_BASE_URL}/operacao/loginUsuario`, {
              loginColaborador: loginColaborador.value,
              senhaColaborador: senhaColaborador.value,
              nomeEmpresa: ''
          });    
        }

        // Verifica se recebeu erro da api
        if (respostaApi.data.erro == true){

          // Verifica se a mensagem de erro indica inicializar o sistema
          if (respostaApi.data.mensagem == 'INICIALIZAR'){
          
              erroStore.exibirErro('Sistema Ainda Não Foi Inicializado. Entre Com Nome do Cliente')
              mostrarCliente.value = true
            
          } else if (respostaApi.data.erro == true){
          
              erroStore.exibirErro(respostaApi.data.mensagem)        
          }
          
        } else {
          
            // Verifica se retornou múltiplos registros
            if (respostaApi.data.data && respostaApi.data.data.length > 1) {
                
                // Armazena os dados completos para uso posterior
                dadosUsuarioCompleto.value = respostaApi.data.data
                
                // Prepara as opções para o select
                empresasDisponiveis.value = respostaApi.data.data.map(usuario => ({
                    idEmpresa: usuario.idEmpresa,
                    nomeFantasia: usuario.nomeFantasia,
                    departamentoColaborador: usuario.departamentoColaborador,
                    empresaManutencao: usuario.empresaManutencao
                }))
                
                // Mostra o select de empresas
                mostrarSelectEmpresa.value = true
                
                // Limpa seleção anterior
                empresaSelecionada.value = null
                
                loading.value = false
                return
                
            } else {
                // Se tem apenas um registro ou está vindo do select, processa o login
                processarLogin(respostaApi.data.data)
            }
        }

      } catch (erro) {
          erroStore.exibirErro(erro)
      } finally {
          loading.value = false
      }
    }

    // Função para processar o login após seleção ou com único registro
    async function processarLogin(dados) {

        try {
            
            let usuarioParaLogin;
            
            // Se veio do select de empresas
            if (mostrarSelectEmpresa.value && empresaSelecionada.value) {

                usuarioParaLogin = dadosUsuarioCompleto.value.find(
                    user => user.idEmpresa === empresaSelecionada.value
                )

            } else {
                
                // Se é um único registro
                usuarioParaLogin = dados[0] || dados
            }

            if (!usuarioParaLogin) {
                erroStore.exibirErro('Usuário não encontrado')
                return
            }

            // Mapeia os dados para a store
            const dadosMapeados = {
                idColaborador: usuarioParaLogin.idColaborador,
                idEmpresa: usuarioParaLogin.idEmpresa,
                nomeFantasia: usuarioParaLogin.nomeFantasia,
                departamentoColaborador: usuarioParaLogin.departamentoColaborador,
                loginColaborador: loginColaborador.value,
                nomeColaborador: usuarioParaLogin.nomeColaborador,   
                emailColaborador: usuarioParaLogin.emailColaborador,
                empresaManutencao: usuarioParaLogin.empresaManutencao
            };
            
            // Salva em loginStore os dados da empresa e colaborador
            loginStore.setDadosChamado(dadosMapeados);
            
            // Atualiza o estado de autenticação no store
            await autorizacaoLogin.logar()

            // Redireciona conforme o tipo de empresa
            if (loginStore.empresaManutencao === 1){
                router.push({ name: 'CadastroChamados' })      
            } else {
                router.push({ name: 'CadastroChamadosCliente' })      
            }

        } catch (erro) {
            erroStore.exibirErro(erro)
        } finally {
            loading.value = false
        }
    }

    // Função para alterar senha
    const abrirAlteracaoSenha = () => {
        modalSenhaAberto.value = true
    }
    
</script>

<style scoped>
.login-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100vh;
}

.fill-height {
    height: 100vh;
}

.login-card {
    border-radius: 12px;
    overflow: hidden;
}

.login-header {
    background: linear-gradient(135deg, #1976d2, #2196f3);
    padding: 24px;
    color: white;
}

.login-title {
    color: white !important;
    font-weight: 600;
    font-size: 1.5rem;
}

.login-header .v-card-subtitle {
    color: rgba(255, 255, 255, 0.8) !important;
}

.actions-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
}

.forgot-password-link {
    color: #1976d2;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s;
    display: flex;
    align-items: center;
}

.forgot-password-link:hover {
    color: #1565c0;
    text-decoration: underline;
}

.login-btn {
    min-width: 120px;
}

/* Responsividade */
@media (max-width: 600px) {
    .actions-container {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
    
    .forgot-password-link {
        justify-content: center;
        order: 2;
    }
    
    .login-btn {
        order: 1;
        width: 100%;
    }
    
    .login-header {
        padding: 20px;
    }
    
    .login-title {
        font-size: 1.25rem;
    }
}
</style>