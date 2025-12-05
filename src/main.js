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

// Diretiva global para transformar texto em maiúsculas
app.directive('uppercase', {

    mounted(el) {

        const input = el.querySelector('input')

        if (input) {
            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase()
            })
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
  
    mounted(el) {
    
        const input = el.querySelector('input')
    
        if (!input) return

    
        input.addEventListener('input', () => {
    
            let valor = input.value.replace(/\D/g, '')    
            
            valor = valor    
                .replace(/^(\d{2})(\d)/, '$1.$2')    
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')    
                .replace(/\.(\d{3})(\d)/, '.$1/$2')    
                .replace(/(\d{4})(\d)/, '$1-$2')    
                .slice(0, 18)
    
            input.value = valor
    
            input.dispatchEvent(new Event('input'))
        })
    }
})

// Registrando a rotina de formatar dinheiro como  global
app.config.globalProperties.$formatarDinheiro = formatarDinheiro

// Registrando a rotina de formatar dinheiro mysq para real
app.config.globalProperties.$formatarValorParaReal = formatarValorParaReal

// Registrando a rotina de formatar data como  global
app.config.globalProperties.$formataDataBrasil = formataDataBrasil

app.mount('#app');
