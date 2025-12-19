import React from 'react';
import { vocabularyList } from '../data/vocabulary';

const ArticleReader = ({ article, onBack, onTermClick }) => {
    const sortedTerms = [...vocabularyList].sort((a, b) => b.term.length - a.term.length);
    const pattern = new RegExp(`\\b(${sortedTerms.map(t => t.term).join('|')})\\b`, 'gi');

    const renderContent = (text) => {
        const parts = text.split(pattern);
        return parts.map((part, index) => {
            const matchedTerm = sortedTerms.find(t => t.term.toLowerCase() === part.toLowerCase());
            if (matchedTerm) {
                return (
                    <span
                        key={index}
                        onClick={(e) => { e.stopPropagation(); onTermClick(matchedTerm); }}
                        className="text-yellow-400 font-bold border-b-2 border-dotted border-yellow-400 cursor-pointer hover:bg-yellow-400 hover:text-black transition-colors"
                        title="CLICK TO ACCESS CLASSIFIED DEFINITION"
                    >
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="fixed inset-0 z-40 bg-black flex flex-col font-mono text-[#00ff00] animate-in slide-in-from-bottom duration-75">
            <div className="bg-green-900 text-black p-2 font-bold flex justify-between items-center border-b-4 border-[#00ff00]">
                <span className="animate-pulse">&gt;&gt;&gt; ACCESSING ENCRYPTED FILE: {article.title}</span>
                <button onClick={onBack} className="bg-black text-[#00ff00] px-4 font-bold border border-[#00ff00] hover:bg-red-600 hover:text-black hover:border-red-600">TERMINATE</button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto bg-black m-4 border-2 border-dashed border-[#00ff00] shadow-[inset_0_0_20px_rgba(0,255,0,0.2)] relative">
                <div className="text-center mb-12 border-b border-green-800 pb-8 relative z-10">
                    <h1 className="text-4xl font-black text-red-500 uppercase tracking-widest mb-4 glitch-text">{article.title}</h1>
                    <p className="text-[#00ff00] font-bold text-sm uppercase bg-green-900/30 inline-block px-2">CLEARANCE LEVEL: ULTRA-TOP-SECRET // {article.category}</p>
                </div>

                <div className="prose font-mono max-w-none text-[#00ff00] relative z-10">
                    <div className="float-right ml-8 mb-4 p-4 border-2 border-red-500 text-red-500 text-xs uppercase w-32 text-center font-bold animate-[pulse_2s_infinite]">
                        Warning: Reading this may trigger automated surveillance
                    </div>
                    <div className="whitespace-pre-line leading-loose text-lg font-bold">
                        {renderContent(article.content)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleReader;
