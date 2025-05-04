'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/judge");
    }
  }, [status, router]);

  console.log(status)

  return (
    //     <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#2b2b45] to-[#1e1e2f] text-white flex flex-col items-center justify-center px-4 py-10">
    //     <div className="w-full max-w-3xl">
    //         <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
    //             <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">
    //                 🎧 Seu julgamento musical
    //             </h1>

    //             <div className="text-lg sm:text-xl font-mono whitespace-pre-wrap transition-all duration-300 ease-in-out min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent" id="judgment-box">
    //                 {judgment}
    //                 <span className="animate-pulse text-white/70">▌</span>
    //             </div>

    //             <div ref={judgmentEndRef} />
    //         </div>
    //     </div>
    // </div>


    <main className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#2b2b45] to-[#1e1e2f] text-white flex flex-col items-center justify-center px-4 py-10">
      {status === "loading" || status === "authenticated" ? (
        <p>Carregando...</p>
      ) : (
        <>
          <p className="mb-2 text-lg font-medium">Pronto pra ser avaliado pelo melhor avaliador de gostos musicais do mundo?</p>
          <button
            onClick={() => signIn("spotify")}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Entrar com Spotify
          </button>
        </>
      )}
    </main>
  );
}
