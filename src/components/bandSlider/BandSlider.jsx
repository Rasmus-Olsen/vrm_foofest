import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useLikedBandsStore from "@/stores/likedBandsStore";

// Funktion til at konvertere korte ugedagsnavne til fulde navne
function getFullDayName(shortDay) {
  const days = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };
  return days[shortDay] || shortDay; // Hvis dagen ikke findes, returneres det originale input
}

export default function BandSlider({ band, bandSchedule }) {
  const { likedBands, addBand, removeBand } = useLikedBandsStore(); // Zustand hooks

  const imageUrl = band?.logo
    ? band.logo.startsWith("https://")
      ? band.logo
      : `${process.env.NEXT_PUBLIC_API_URL || ""}/logos/${band.logo}`
    : null;

  // Tjek om bandet er liket
  const isBandLiked = likedBands.some(
    (likedBand) => likedBand.slug === band.slug
  );

  // Funktion til at toggle like
  const toggleLike = () => {
    isBandLiked ? removeBand(band.slug) : addBand(band);
  };

  return (
    <SheetContent
      className="p-6 flex flex-col"
      style={{ height: "100vh", maxHeight: "100vh" }}
    >
      <SheetHeader>
        <SheetTitle className="text-4xl font-bold text-primary">
          {band?.name || "No Band Selected"}
        </SheetTitle>

        {/* Like-knap under overskriften */}
        <button
          onClick={toggleLike}
          className={`mt-4 w-10 h-10 flex items-center justify-center rounded-full border-2 bg-black ${
            isBandLiked
              ? "text-primary border-orange"
              : "text-primary border-darkorange hover:border-orange"
          } transition duration-200`}
        >
          {isBandLiked ? (
            <AiFillHeart size={20} />
          ) : (
            <AiOutlineHeart size={20} />
          )}
        </button>

        <SheetDescription className="text-gray-400 mt-4">
          Scroll for more information
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4 overflow-y-auto flex-1">
        {/* Band billede */}
        <div className="py-4">
          {imageUrl ? (
            <Avatar className="w-60 h-60 mx-auto">
              <AvatarImage src={imageUrl} alt={band?.name || "Band"} />
              <AvatarFallback>{band?.name || "?"}</AvatarFallback>
            </Avatar>
          ) : (
            <div>No image available</div>
          )}
        </div>

        {/* Band beskrivelse */}
        <div className="text-lg my-2">
          {band?.bio || "Biography not available."}
        </div>

        {/* Genre */}
        <div className="font-semibold text-white">
          <h3 className="text-sm font-bold text-primary mb-2">
            Genre:{" "}
            <span className="ml-1 text-sm text-gray-300">{band?.genre}</span>
          </h3>
        </div>

        {/* Medlemmer */}
        <div className="font-semibold text-white">
          <h3 className="text-sm font-bold text-primary mb-2">
            Members:{" "}
            <span className="ml-1 text-sm text-gray-300">
              {band?.members?.join(", ") || "No members listed"}
            </span>
          </h3>
        </div>

        {/* Spilleplan */}
        <div className="font-semibold text-white">
          <h3 className="text-sm font-bold text-primary mb-2">
            Schedule:{" "}
            {bandSchedule?.length > 0 ? (
              <span className="ml-1 text-sm text-gray-300">
                {bandSchedule.map((slot, index) => (
                  <span key={index}>
                    {getFullDayName(slot.day)}: {slot.start} - {slot.end} on{" "}
                    {slot.stage}
                    {index < bandSchedule.length - 1 && ", "}
                  </span>
                ))}
              </span>
            ) : (
              <span className="ml-1 text-gray-400">No schedule available.</span>
            )}
          </h3>
        </div>
      </div>
    </SheetContent>
  );
}
