import i18n from 'i18next';

export const dateToReadableString = (timestamp: string) => {
    const date = new Date(timestamp);
    const readableDate = date.toLocaleString(i18n.language, {
        month: 'long',
        weekday: 'long',
        day: 'numeric',
    });

    return readableDate;
};

export const datetimeToReadableString = (timestamp: string) => {
    const date = new Date(timestamp);
    const readableDate = date.toLocaleString(i18n.language, {
        month: 'long',
        weekday: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return readableDate;
};
