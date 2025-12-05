<template>

    <v-snackbar
        v-model="snackbar.show"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        location="center"
    >
        {{ snackbar.message }}
        
        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar.close()">Fechar</v-btn>
        </template>

    </v-snackbar>
    
</template>

<script setup>
    import { useSnackbarStore } from '@/stores/snackbar'
    const snackbar = useSnackbarStore()
</script>
