"use client";

import React, { useEffect, useState, useCallback } from 'react';
import ToBuyItem, { ToBuyItemType } from './ToBuyItem';

const ToBuy: React.FC<{ storageKey: string }> = ({ storageKey }) => {
    const [items, setItems] = useState<ToBuyItemType[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);

    const listType = storageKey === 'generalToBuy' ? 'general' : 'now';

    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`/api/tobuy?listType=${listType}`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
                setDbConnected(true);
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                const message = errorData?.error || 'Failed to connect to database.';
                setErrorMessage(message);
                setDbConnected(false);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setErrorMessage('Cannot connect to the database. Check Supabase settings.');
            setDbConnected(false);
        } finally {
            setLoading(false);
        }
    }, [listType]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchItems();
    }, [fetchItems]);

    const handleApiError = async (response: Response) => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData?.error || 'Database request failed.';
            setErrorMessage(message);
            setDbConnected(false);
            return false;
        }
        return true;
    };

    const addItem = async () => {
        if (inputValue.trim()) {
            try {
                const response = await fetch('/api/tobuy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputValue.trim(), listType }),
                });
                if (await handleApiError(response)) {
                    const newItem = await response.json();
                    setItems(prev => [...prev, newItem]);
                    setInputValue('');
                }
            } catch (error) {
                console.error('Error adding item:', error);
                setErrorMessage('Cannot add item because the database is unavailable.');
                setDbConnected(false);
            }
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await fetch(`/api/tobuy/${id}`, { method: 'DELETE' });
            if (await handleApiError(response)) {
                setItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setErrorMessage('Cannot delete item because the database is unavailable.');
            setDbConnected(false);
        }
    };

    const toggleCompletion = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
            const response = await fetch(`/api/tobuy/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: item.text, completed: !item.completed }),
            });
            if (await handleApiError(response)) {
                const updatedItem = await response.json();
                setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
            }
        } catch (error) {
            console.error('Error updating item:', error);
            setErrorMessage('Cannot update item because the database is unavailable.');
            setDbConnected(false);
        }
    };

    const editItem = async (id: string, newText: string) => {
        if (!newText.trim()) return;

        try {
            const item = items.find(i => i.id === id);
            if (!item) return;

            const response = await fetch(`/api/tobuy/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText.trim(), completed: item.completed }),
            });
            if (await handleApiError(response)) {
                const updatedItem = await response.json();
                setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
            }
        } catch (error) {
            console.error('Error editing item:', error);
            setErrorMessage('Cannot edit item because the database is unavailable.');
            setDbConnected(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {dbConnected === false && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
                    <strong>Database connection error:</strong> {errorMessage}
                </div>
            )}
            {dbConnected === true && (
                <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-green-700">
                    Database connected successfully.
                </div>
            )}
            <div className="flex gap-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addItem();
                        }
                    }}
                    placeholder="Add item..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <button
                    onClick={addItem}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-3">
                {items.map((item) => (
                    <ToBuyItem
                        key={item.id}
                        item={item}
                        onToggle={() => toggleCompletion(item.id)}
                        onDelete={() => deleteItem(item.id)}
                        onEdit={(newText) => editItem(item.id, newText)}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ToBuy;