import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const imageUrl = band?.logo
    ? band.logo.startsWith("https://")
      ? band.logo
      : `${process.env.NEXT_PUBLIC_API_URL || ""}/logos/${band.logo}`
    : null;

  return (
    <SheetContent
      className="p-6 flex flex-col"
      style={{ height: "100vh", maxHeight: "100vh" }}
    >
      <SheetHeader>
        <SheetTitle className="text-4xl font-bold text-primary">
          {band?.name || "No Band Selected"}
        </SheetTitle>
        <SheetDescription className="text-gray-400">
          Scroll for more information
        </SheetDescription>
      </SheetHeader>

      <div className="mt-4 space-y-4 overflow-y-auto flex-1">
        <div className="flex justify-center py-4">
          {imageUrl ? (
            <Avatar className="w-48 h-48">
              <AvatarImage src={imageUrl} alt={band?.name || "Band"} />
              <AvatarFallback>{band?.name || "?"}</AvatarFallback>
            </Avatar>
          ) : (
            <div>No image available</div>
          )}
        </div>
        <div className="text-lg my-2">
          {band?.bio || "Biography not available."}
        </div>
        <div className="font-semibold text-white">
          <h3 className="text-sm font-bold text-primary mb-2 inline-flex">
            Genre:
            <span className="ml-1 text-sm text-gray-300">{band?.genre}</span>
          </h3>
        </div>
        <div className="font-semibold text-white">
          <h3 className="text-sm font-bold text-primary mb-2 inline-flex">
            Members:
            <span className="ml-1 text-sm text-gray-300">
              {band?.members?.join(", ") || "No members listed"}
            </span>
          </h3>
        </div>
        <div className="font-semibold text-white">
          <h3 className="text-sm font-bold text-primary mb-2 inline-flex items-center">
            Schedule:
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
