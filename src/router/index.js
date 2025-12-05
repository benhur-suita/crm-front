import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/stores/loginStore'

import LoginForm from '../views/LoginForm.vue'

import ListaEmpresas from '../views/ListaEmpresas.vue'
import CadastroEmpresas from '../views/CadastroEmpresas.vue'

import ListaRamosAtividade from '../views/ListaRamosAtividade.vue'
import CadastroRamosAtividade from '../views/CadastroRamosAtividade.vue'

import ListaStatusCredito from '../views/ListaStatusCredito.vue'
import CadastroStatusCredito from '../views/CadastroStatusCredito.vue'

import ListaStatusNegociacao from '../views/ListaStatusNegociacao.vue'
import CadastroStatusNegociacao from '../views/CadastroStatusNegociacao.vue'

import ListaProdutos from '../views/ListaProdutos.vue'
import CadastroProdutos from '../views/CadastroProdutos.vue'

import ListaTiposChamados from '../views/ListaTiposChamados.vue'
import CadastroTiposChamados from '../views/CadastroTiposChamados.vue'

import ListaEmail from '../views/ListaEmail.vue'
import CadastroEmail from '../views/CadastroEmail.vue'

import ListaMensagens from '../views/ListaMensagens.vue'
import CadastroMensagens from '../views/CadastroMensagens.vue'

import CadastroChamados from '../views/CadastroChamados.vue'

import CadastroChamadosCliente from '../views/CadastroChamadosCliente.vue'

import CadastroNegociacoes from '@/views/CadastroNegociacoes.vue'

// Define as rotas
const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginForm
    },
    {
        path: '/lista-empresas',   // rota para brower chamar lista de empresas
        name: 'ListaEmpresas',
        component: ListaEmpresas
    },  
    {
        path: '/cadastro-empresas',   // rota para brower chamar cadastro de empresas
        name: 'CadastroEmpresas',
        component: CadastroEmpresas
    },  
    {
        path: '/lista-ramos-atividade',   // rota para brower chamar cadastro de ramos de atividade
        name: 'ListaRamosAtividade',
        component: ListaRamosAtividade
    },  
    {
        path: '/cadastro-ramos-atividade',   // rota para brower chamar cadastro de ramos de atividade
        name: 'CadastroRamosAtividade',
        component: CadastroRamosAtividade
    },
    {
        path: '/lista-status-credito',   // rota para brower chamar cadastro de status de crédito
        name: 'ListaStatusCredito',
        component: ListaStatusCredito
    },
    {
        path: '/cadastro-status-credito',   // rota para brower chamar cadastro de status de crédito
        name: 'CadastroStatusCredito',
        component: CadastroStatusCredito
    },
    {
        path: '/lista-status-cliente',   // rota para brower chamar cadastro status cliente
        name: 'ListaStatusNegociacao',
        component: ListaStatusNegociacao
    },
    {
        path: '/cadastro-status-negociacao',   // rota para brower chamar cadastro status cliente
        name: 'CadastroStatusNegociacao',
        component: CadastroStatusNegociacao
    },  
    {
        path: '/lista-produtos',   // rota para brower chamar cadastro de produtos
        name: 'ListaProdutos',
        component: ListaProdutos
    },  
    {
        path: '/cadastro-produtos',   // rota para brower chamar cadastro de produtos
        name: 'CadastroProdutos',
        component: CadastroProdutos
    },  
    {
        path: '/lista-tipos-chamados',   // rota para brower chamar cadastro de tipos de chamado
        name: 'ListaTiposChamados',
        component: ListaTiposChamados
    },
    {
        path: '/cadastro-tipos-chamados',   // rota para brower chamar cadastro de tipos de chamado
        name: 'CadastroTiposChamados',
        component: CadastroTiposChamados
    },
    {
        path: '/lista-email',   // rota para brower chamar cadastro de e-mail
        name: 'ListaEmail',
        component: ListaEmail
    }, 
    {
        path: '/cadastro-email',   // rota para brower chamar cadastro de e-mail
        name: 'CadastroEmail',
        component: CadastroEmail
    },
    {
        path: '/lista-mensagens',   // rota para brower chamar cadastro de mensagens
        name: 'ListaMensagens',
        component: ListaMensagens
    },  
    {
        path: '/cadastro-mensagens',   // rota para brower chamar cadastro de mensagens
        name: 'CadastroMensagens',
        component: CadastroMensagens
    },
    {
        path: '/cadastro-chamados',  // rota para brower chamar cadastro de chamados
        name: 'CadastroChamados',    // ✅ Adicione um nome para a rota
        component: CadastroChamados  // ✅ Apenas uma vez
    },
    {
        path: '/cadastro-chamados-cliente',  // rota para brower chamar cadastro de chamados dos clientes
        name: 'CadastroChamadosCliente',
        component: CadastroChamadosCliente
    },
    {
        path: '/cadastro-negociacoes',
        name: 'CadastroNegociacoes',
        component: CadastroNegociacoes
    }
]

// Cria o roteador
const router = createRouter({ 
    history: createWebHistory(),
    routes
})

// Adiciona um guardião global para verificar autenticação
router.beforeEach((to, from, next) => {
    
    const loginStore = useLoginStore()
    
    // Verifica se a rota requer autenticação
    if (to.meta.requiresAuth) {

        if (loginStore.idColaborador) {

            // Verifica se a sessão expirou
            const expired = loginStore.checkSessionExpiry()
            
            if (expired) {
              
                // Redireciona para login se expirado
                next('/login')
            
            } else {
            
                loginStore.updateActivity() // Atualiza atividade na navegação
                next()
            }

        } else {
            next('/login')
        }

    } else {
        next()
    }
})

export default router
