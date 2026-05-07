"use client";

import React, { useEffect, useState, useCallback } from 'react';
import ToBuyItem, { ToBuyItemType } from './ToBuyItem';

const ToBuy: React.FC<{ storageKey: string }> = ({ storageKey }) => {
    const [items, setItems] = useState<ToBuyItemType[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);

    const listType = storageKey === 'generalToBuy' ? 'general' : 'now';

    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`/api/todos?listType=${listType}`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    }, [listType]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchItems();
    }, [fetchItems]);

    const addItem = async () => {
        if (inputValue.trim()) {
            try {
                const response = await fetch('/api/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputValue.trim(), listType }),
                });
                if (response.ok) {
                    const newItem = await response.json();
                    setItems(prev => [...prev, newItem]);
                    setInputValue('');
                }
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const toggleCompletion = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: item.text, completed: !item.completed }),
            });
            if (response.ok) {
                const updatedItem = await response.json();
                setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const editItem = async (id: string, newText: string) => {
        if (!newText.trim()) return;

        try {
            const item = items.find(i => i.id === id);
            if (!item) return;

            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText.trim(), completed: item.completed }),
            });
            if (response.ok) {
                const updatedItem = await response.json();
                setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
            }
        } catch (error) {
            console.error('Error editing item:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
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