import React, { useState } from 'react';

export interface ToBuyItemType {
    id: string;
    text: string;
    completed: boolean;
}

const ToBuyItem: React.FC<{ item: ToBuyItemType; onToggle: () => void; onDelete: () => void; onEdit: (newText: string) => void; }> = ({ item, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.text);

    const handleSave = () => {
        onEdit(editText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(item.text);
        setIsEditing(false);
    };

    return (
        <li className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 transition-all ${item.completed ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        className="flex-1 px-3 py-2 border-2 border-indigo-300 rounded focus:border-indigo-500 focus:outline-none"
                        autoFocus
                    />
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <span
                        onDoubleClick={() => setIsEditing(true)}
                        className={`flex-1 text-lg cursor-pointer ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    >
                        {item.text}
                    </span>
                    <button
                        onClick={onToggle}
                        className={`px-4 py-2 rounded transition-colors ${item.completed ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
                    >
                        {item.completed ? 'Undo' : 'Done'}
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </>
            )}
        </li>
    );
};

export default ToBuyItem;
