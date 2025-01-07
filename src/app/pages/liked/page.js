"use client";

import useLikedBandsStore from "@/stores/likedBandsStore";
import ArtistList from "@/components/artistList/ArtistList";

export default function LikedBandsPage({ stages }) {
  const likedBands = useLikedBandsStore((state) => state.likedBands);

  return (
    <div className="px-10">
      <h1 className="text-4xl font-bold text-center text-white my-8">Liked Artists</h1>
      {likedBands.length === 0 ? (
        <p className="text-center text-primary">No liked artists yet!</p>
      ) : (
        <ArtistList stages={stages} bands={likedBands} />
      )}
    </div>
  );
}