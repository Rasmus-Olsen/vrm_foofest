"use client";

import { useState, useEffect } from "react";
import useLikedBandsStore from "@/stores/likedBandsStore";
import BandSlider from "@/components/bandSlider/BandSlider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

function getImageUrl(band) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return band?.logo?.startsWith("https://")
    ? band.logo
    : band?.logo
    ? `${baseUrl}/logos/${band.logo}`
    : null;
}

const ArtistList = ({ stages = [], bands = [], onlyLiked = false }) => {
  const { likedBands, addBand, removeBand, loadLikedBands } = useLikedBandsStore();
  const [visibleBands, setVisibleBands] = useState(12); // Antal bands der vises

  useEffect(() => {
    loadLikedBands(); // Hent liked bands fra localStorage
  }, [loadLikedBands]);

  // Filtrer bands hvis kun likede bands skal vises
  const filteredBands = onlyLiked ? likedBands : bands;

  const isBandLiked = (slug) =>
    likedBands.some((band) => band.slug === slug);

  const toggleLike = (band) => {
    if (isBandLiked(band.slug)) {
      removeBand(band.slug);
    } else {
      addBand(band);
    }
  };

  const getBandSchedule = (bandName) => {
    const bandSchedule = [];
    stages.forEach(({ name: stageName, stageSchedule }) => {
      if (stageSchedule) {
        Object.entries(stageSchedule).forEach(([day, events]) => {
          events.forEach((event) => {
            if (event.act?.toLowerCase().trim() === bandName.toLowerCase().trim()) {
              bandSchedule.push({
                stage: stageName,
                day,
                start: event.start,
                end: event.end,
                genre: event.genre || "Unknown",
                canceled: event.cancelled || false, // Inkluder canceled-status
              });
            }
          });
        });
      }
    });
    return bandSchedule;
  };

  const handleLoadMore = () => {
    setVisibleBands((prev) => prev + 12); // Vis flere bands
  };

  return (
    <>
      {filteredBands.length === 0 ? (
        <p className="text-center text-primary text-lg mt-6">
          {onlyLiked ? "No artists liked yet!" : "No artists found!"}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-0 md:mx-8">
            {filteredBands.slice(0, visibleBands).map((band) => {
              const imageUrl = getImageUrl(band);
              const isLiked = isBandLiked(band.slug);
              const bandSchedule = getBandSchedule(band.name);

              // Kontroller om bandet har aflyste events
              const isCanceled = bandSchedule.some((slot) => slot.canceled);

              return (
                <Sheet key={band.slug}>
                  <SheetTrigger asChild>
                    <Card className="hover:scale-105 transition ease-in-out duration-300 border-2 cursor-pointer rounded-xl relative overflow-hidden">
                      {/* Overlay for aflyste bands */}
                      {isCanceled && (
                        <div className="absolute inset-0 bg-primary bg-opacity-90 flex items-center justify-center z-10">
                          <span className="text-white text-lg font-bold">
                            Cancelled
                          </span>
                        </div>
                      )}
                      <CardContent className="p-0 relative">
                        <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
                          {imageUrl ? (
                            <Avatar className="absolute inset-0 w-full h-full">
                              <AvatarImage
                                src={imageUrl}
                                alt={band.name}
                                loading="lazy"
                                className="object-cover w-full h-full"
                              />
                            </Avatar>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                              No image available
                            </div>
                          )}
                          {/* Like ikon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(band);
                            }}
                            className={`absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full border-2 bg-black z-20 ${
                              isLiked
                                ? "text-primary border-orange"
                                : "text-primary border-darkorange hover:border-orange"
                            } transition duration-200`}
                          >
                            {isLiked ? (
                              <AiFillHeart size={20} />
                            ) : (
                              <AiOutlineHeart size={20} />
                            )}
                          </button>
                        </div>
                      </CardContent>
                      <CardHeader className="py-4">
                        <CardTitle className="text-center text-2xl font-bold text-white">
                          {band.name}
                        </CardTitle>
                        <CardDescription className="text-center text-primary">
                          {band.genre || "Unknown Genre"}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </SheetTrigger>
                  <BandSlider band={band} bandSchedule={bandSchedule} />
                </Sheet>
              );
            })}
          </div>
          {visibleBands < filteredBands.length && (
            <div className="flex justify-center mt-6">
           <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-black border border-primary transition ease-out duration-200"
            >
              Load More
          </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ArtistList;