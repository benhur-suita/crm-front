export function formatarDinheiro(valor) {

    const valorBruto = String(valor).replace(/\D/g, '')

    if (!valorBruto) return ''

    const valorConvertido = parseFloat(valorBruto) / 100

    return valorConvertido.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}