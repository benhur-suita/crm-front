import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { pt } from 'vuetify/locale'

// Solução alternativa sem adaptador externo
const vuetify = createVuetify({
    components,
    directives,
    locale: {
        locale: 'pt',
        messages: { pt }
    },  
})

export default vuetify

