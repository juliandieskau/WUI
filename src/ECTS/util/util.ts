export const localStorageLoad = (key: string): any | null => {
    const json = localStorage.getItem(key);
    if (!json) return;
    const value = JSON.parse(json);
    return value;
};

