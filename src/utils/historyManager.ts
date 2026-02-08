export interface HistoryItem {
    id: string;
    type: string; // 'Employee', 'Freelancer', 'Business', 'Bonus', 'Reverse'
    date: string; // ISO string
    summary: string; // e.g. "Gross: ₱50,000"
    result: string; // e.g. "Net: ₱38,000"
    inputData: any; // Raw input values for restoration
}

const HISTORY_KEY = 'moneyjuan_calc_history';
const MAX_ITEMS = 5;

export const getHistory = (): HistoryItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse history', e);
        return [];
    }
};

export const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    if (typeof window === 'undefined') return;

    const history = getHistory();
    const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        date: new Date().toISOString(),
    };

    // Prepend new item
    const updatedHistory = [newItem, ...history].slice(0, MAX_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('history-updated'));
};

export const clearHistory = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent('history-updated'));
};
