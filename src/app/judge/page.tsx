import { getServerSession } from 'next-auth';
import MusicJudgePage from './clientPage';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getTopTracks } from '../lib/spotify';
import { redirect } from 'next/navigation';

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        redirect('/api/auth/signin');
    }

    const tracks = await getTopTracks(session.accessToken)

    return < MusicJudgePage tracks={tracks.items} />;
}