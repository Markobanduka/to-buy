import React from 'react';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import ToBuy from '../ToBuyApp';

const ToBuyNow: React.FC = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative">
                <Link href="/" className="absolute top-4 left-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <IoArrowBack size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">To Buy Now</h1>
                <ToBuy storageKey="nowToBuy" />
            </div>
        </div>
    );
};

export default ToBuyNow;