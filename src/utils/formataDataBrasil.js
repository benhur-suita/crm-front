export function formataDataBrasil(dataISO, horaStr) {
    
    if (!dataISO) return '';

    try {

        const date = new Date(dataISO);
        if (isNaN(date.getTime())) return '';
        
        // Se hora for passada manualmente
        if (horaStr) {
            const [horas, minutos] = horaStr.split(':');
            date.setHours(parseInt(horas));
            date.setMinutes(parseInt(minutos));
        }
        
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const ano = date.getFullYear();
        const horas = date.getHours().toString().padStart(2, '0');
        const minutos = date.getMinutes().toString().padStart(2, '0');
        
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } catch {
        return '';
    }
}