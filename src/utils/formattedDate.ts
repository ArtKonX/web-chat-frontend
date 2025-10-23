export function formattedDate(dateData: string | number | Date | undefined) {
    if (dateData) {
        const date = new Date(dateData);

        const formattedDate = date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        return formattedDate;
    }
}