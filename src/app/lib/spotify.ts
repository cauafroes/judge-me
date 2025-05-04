export async function getRecentlyPlayed(accessToken: string) {
  const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    //todo: handle unauthorized (delte cookies and redirect to login)
    throw new Error("Failed to fetch recently played tracks" + res.body);
  }

  const data = await res.json();

  const formatted = data.items.map((item: any) => ({
    name: item.track.name,
    artist: item.track.artists.map((a: any) => a.name).join(', '),
  }));
  
  return formatted;
}

export async function getTopTracks(accessToken: string) {
  const res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=medium_term", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    //todo: handle unauthorized (delte cookies and redirect to login)
    // throw new Error("Failed to fetch top played tracks");
    throw await res.json()
  }

  const data = await res.json();

  console.log(data.items)

  // const formatted = data.items.map((item: any) => ({
  //   name: item.track.name,
  //   artist: item.track.artists.map((a: any) => a.name).join(', '),
  // }));
  
  return data
}
  