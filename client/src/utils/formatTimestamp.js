export const formatMessageTimestamp = (timestamp) => {
    if (!timestamp?._seconds) return '';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const formatDateSeparator = (timestamp) => {
    if (!timestamp?._seconds) return null;
    const date = new Date(timestamp._seconds * 1000);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' });
};