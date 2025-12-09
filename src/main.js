// Cria a instância do Vue
import { createApp } from 'vue';

// Importa o Pinia
import { createPinia } from 'pinia'

// Importa e configura o Pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Importa o componente raiz
import App from './App.vue';

// Importa o roteador e o Pinia
import router from './router';

// Importa o Vuetify
import vuetify from './plugins/vuetify';

// Importa a diretiva do v-money3
import { Money3Directive } from 'v-money3'; // ← diretiva

// Importa o componente de ícone SVG
import SvgIcon from 'vue3-icon'

// Importa o FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'

// Importa o ícone específico que será usado
import { faPen } from '@fortawesome/free-solid-svg-icons'

// Importa o componente do FontAwesome para Vue
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Importa rotina global para formatar dinheiro
import { formatarDinheiro } from './utils/formataDinheiro'

// Importa rotina global para formatar valor do mysql para real brasil
import { formatarValorParaReal } from './utils/formatarValorParaReal'

// Importa rotina global para formatar data para formato brasil
import { formataDataBrasil } from './utils/formataDataBrasil'

// Importa o CSS global
import '@mdi/font/css/materialdesignicons.css'; // Importa os ícones do Material Design

import { createPersistedState } from 'pinia-plugin-persistedstate'

// Adiciona o ícone importado à biblioteca do FontAwesome
library.add(faPen)

// Cria a instância do Vue
const app = createApp(App);

// Cria a instância do Pinia e aplica o plugin de estado persistente
const pinia = createPinia()

// Adiciona o plugin de estado persistente ao Pinia
pinia.use(piniaPluginPersistedstate)

// Usa o Pinia na aplicação Vue
app.use(pinia);

// Registra globalmente os componentes e diretivas
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('svg-icon', SvgIcon)
app.directive('money3', Money3Directive); // ← registra a diretiva

// Usa o Vuetify e o roteador na aplicação Vue
app.use(vuetify);
app.use(router);

// Configuração global de scroll para o topo
router.beforeEach((to, from, next) => {
  // Garante que a rota está pronta antes de rolar
  next()
})

// Após cada navegação, rola para o topo da página
router.afterEach(() => {

    // Pequeno delay para garantir que o DOM está atualizado
    setTimeout(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // 'smooth' para animação suave
        })

    }, 100)
})

// Diretiva global para transformar texto em maiúsculas
app.directive('uppercase', {
    
    // Ao montar o elemento gera o evento de transformação
    mounted(el) {

        // Seleciona o input dentro do elemento
        const input = el.querySelector('input')
        
        // Se o input existir, adiciona os event listeners
        if (input) {

            // Função para transformar o valor em maiúsculas
            const handler = () => {
                input.value = input.value.toUpperCase()
                input.dispatchEvent(new Event('input')) // atualiza o v-model
            }

            // Adiciona os event listeners para input e blur
            input.addEventListener('input', handler)
            input.addEventListener('blur', handler)   // garante ao perder foco
        }
    }
})

// Diretiva global para permitir apenas entrada numérica
app.directive('numerico', {
  
    mounted(el) {
    
        const input = el.querySelector('input')
    
        if (input) {
    
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/g, '') // remove tudo que não for dígito
                input.dispatchEvent(new Event('input')) // atualiza o v-model    
            })    
        }  
    }
})

// Diretiva global para máscara de CNPJ
app.directive('cnpj-mask', {
  
    // Ao montar o elemento gera o evento de transformação
    mounted(el) {
    
        // Seleciona o input dentro do elemento
        const input = el.querySelector('input')
    
        // Se o input existir, adiciona os event listeners
        if (!input) return
    
        // Adiciona o event listener para input
        input.addEventListener('input', () => {
    
            // Busca o valor do input
            let valor = input.value.replace(/\D/g, '')    
            
            // Aplica a máscara de CNPJ
            valor = valor    
                .replace(/^(\d{2})(\d)/, '$1.$2')    
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')    
                .replace(/\.(\d{3})(\d)/, '.$1/$2')    
                .replace(/(\d{4})(\d)/, '$1-$2')    
                .slice(0, 18)
    
            // Atualiza o valor do input
            input.value = valor
    
            // Dispara o evento de input para atualizar o v-model
            input.dispatchEvent(new Event('input'))
        })
    }
})

// Diretiva global para máscara de telefone
app.directive('telefone', {


    mounted(el) {
        
        const input = el.querySelector('input')
        if (!input) return

        const aplicarMascara = (valor) => {
            
            valor = valor.replace(/\D/g, '')

            if (valor.length > 10) {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
            } else if (valor.length > 6) {
                valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
            } else if (valor.length > 2) {
                valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
            } else if (valor.length > 0) {
                valor = valor.replace(/^(\d*)/, '($1')
            }
            return valor
        }

        const handler = (e) => {
            e.target.value = aplicarMascara(e.target.value)            
        }

        input.addEventListener('input', handler)
        input.addEventListener('blur', handler)

        // aplica máscara no valor inicial (quando vem da API)
        if (input.value) {
            input.value = aplicarMascara(input.value)
            // aqui sim precisamos disparar para atualizar o v-model
            input.dispatchEvent(new Event('input'))
        }
    },

    updated(el) {
        const input = el.querySelector('input')
        if (input && input.value) {
            input.value = input.value.replace(/\D/g, '')
            input.dispatchEvent(new Event('input'))
        }
    }
})


// Registrando a rotina de formatar dinheiro como  global
app.config.globalProperties.$formatarDinheiro = formatarDinheiro

// Registrando a rotina de formatar dinheiro mysq para real
app.config.globalProperties.$formatarValorParaReal = formatarValorParaReal

// Registrando a rotina de formatar data como  global
app.config.globalProperties.$formataDataBrasil = formataDataBrasil

app.mount('#app');
