<template>
  
    <v-dialog v-model="modalMostraErro" max-width="400">

        <v-card color="red-lighten-5">

            <v-card-title class="d-flex align-center">

              <v-icon color="red-darken-2" class="me-2">mdi-alert-circle</v-icon>
              <span class="text-h6">Erro</span>
              
            </v-card-title>

            <v-card-text>{{ mensagemErro }}</v-card-text>
            
            <v-card-actions>

                <v-spacer />
              
                <v-btn color="red-darken-2" variant="flat" @click="fecharModal">
                  Fechar
                </v-btn>
            
              </v-card-actions>

        </v-card>

    </v-dialog>

</template>

<script setup>
    
    import { useErroStore } from '@/stores/erroStore'
    import { storeToRefs } from 'pinia'

    const erroStore = useErroStore()
    const { mensagemErro, modalMostraErro } = storeToRefs(erroStore)
    const { fecharModal } = erroStore
    
</script>
