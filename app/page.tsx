import React from 'react';
import Link from 'next/link';
import './globals.css';

const Home: React.FC = () => {
  return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex gap-8">
                <Link href="/to-buy-now">
                    <button className="px-8 py-4 text-2xl bg-green-600 text-white border-none rounded-lg cursor-pointer transition-colors hover:bg-green-700 font-semibold shadow-lg">
                        Buy Now
                    </button>
                </Link>
                <Link href="/to-buy-general">
                    <button className="px-8 py-4 text-2xl bg-blue-600 text-white border-none rounded-lg cursor-pointer transition-colors hover:bg-blue-700 font-semibold shadow-lg">
                        Buy General
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;

// add backend next
