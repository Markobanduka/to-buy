"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import ToBuy from '../ToBuyApp';

const ToBuyGeneral: React.FC = () => {
    const [infoMessage, setInfoMessage] = useState('');
    const timerRef = useRef<number | null>(null);

    const showInfo = (message: string) => {
        setInfoMessage(message);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
            setInfoMessage('');
        }, 1500);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            {infoMessage && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-gray-200 text-gray-900 px-4 py-3 flex items-center justify-between text-sm">
                    <span className="truncate">{infoMessage}</span>
                    <button
                        type="button"
                        onClick={() => setInfoMessage('')}
                        className="ml-4 text-gray-600 hover:text-gray-900"
                    >
                        ×
                    </button>
                </div>
            )}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative">
                <Link href="/" className="absolute top-4 left-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <IoArrowBack size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">To Buy General</h1>
                <ToBuy storageKey="generalToBuy" onShowInfo={showInfo} />
            </div>
        </div>
    );
};

export default ToBuyGeneral;