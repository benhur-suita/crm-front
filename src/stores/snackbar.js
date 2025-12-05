import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
    state: () => ({
        show: false,
        message: '',
        color: 'success',
        timeout: 3000
    }),
    actions: {
        trigger(message, color = 'success', timeout = 3000) {
            this.message = message
            this.color = color
            this.timeout = timeout
            this.show = true
        },
        close() {
            this.show = false
        }
    }
})
