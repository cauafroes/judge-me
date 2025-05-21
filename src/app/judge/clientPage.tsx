'use client'
// import { authOptions } from '../api/auth/[...nextauth]/route';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function MusicJudgePage({ tracks }: { tracks: [] }) {
    const [judgment, setJudgment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const judgmentEndRef = useRef<HTMLDivElement>(null);

    const debochadoLevel: 'high' | 'low' = 'high';
    const judgmentTone: 'good' | 'bad' = 'bad';

    const fetchStreamingJudgment = async () => {
        // try {
        setLoading(true);
        setError('');
        setJudgment('');

        const res = await fetch('/api/judge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tracks,
                debochadoLevel,
                judgmentTone,
            }),
        });

        if (!res.body) {
            throw new Error('No response body');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
                const chunk = decoder.decode(value);
                setJudgment(prev => prev + chunk);
                judgmentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // } catch (err) {
        //     console.error('Judgment error:', err);
        //     setError(`Failed to get judgment: ${axios.isAxiosError(err) ?
        //         err.response?.data?.message || err.message :
        //         'Unknown error'}`);
        // } finally {
        // setLoading(false);
        // }
    };

    useEffect(() => {
        if (tracks.length > 0) {
            fetchStreamingJudgment();
        } else {
            setError('Não achamos nenhuma música recente em seu spotify')
        }
    }, [tracks]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#2b2b45] to-[#1e1e2f] text-white flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">
                        🎧 Seu julgamento musical
                    </h1>

                    <div className="text-lg sm:text-xl font-mono whitespace-pre-wrap transition-all duration-300 ease-in-out min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent" id="judgment-box">
                        {judgment}
                        <span className="animate-pulse text-white/70">▌</span>
                    </div>

                    <div ref={judgmentEndRef} />
                </div>
            </div>
            <button
                onClick={() => {
                    if (navigator.share) {
                        navigator
                            .share({
                                title: 'Descubra seu julgamento musical 🎧',
                                text: 'Veja como fui julgado pelo Crítico Musical mais debochado da internet!',
                                url: window.location.href,
                            })
                            .catch((error) => console.log('Erro ao compartilhar:', error));
                    } else {
                        alert('Seu navegador não suporta compartilhamento.');
                    }
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors shadow-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M8 8l8 8M16 8l-8 8"
                    />
                </svg>
                Compartilhar
            </button>
        </div>

    );
}
