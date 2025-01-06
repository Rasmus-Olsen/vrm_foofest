import { getSchedule, getBands } from "@/lib/database";
import BandSlider from "@/components/bandSlider/BandSlider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Funktion til at generere billed-URL
function getImageUrl(band) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return band?.logo?.startsWith("https://")
    ? band.logo
    : band?.logo
    ? `${baseUrl}/logos/${band.logo}`
    : null;
}

function mapGenresToSchedule(schedule, genreMap) {
  if (!schedule || typeof schedule !== "object") {
    console.error("Invalid schedule:", schedule);
    return {};
  }

  const mappedSchedule = {};
  Object.keys(schedule).forEach((day) => {
    mappedSchedule[day] = schedule[day].map((event) => ({
      ...event,
      genre: genreMap[event.act?.toLowerCase().trim()] || "Unknown",
    }));
  });
  return mappedSchedule;
}

export default async function ArtistPage() {
  const [midgard, vanaheim, jotunheim, bands] = await Promise.all([
    getSchedule("Midgard"),
    getSchedule("Vanaheim"),
    getSchedule("Jotunheim"),
    getBands(),
  ]);

  const genreMap = bands.reduce((acc, band) => {
    acc[band.name.toLowerCase().trim()] = band.genre;
    return acc;
  }, {});

  const stages = [
    { name: "Midgard", stageSchedule: mapGenresToSchedule(midgard, genreMap) },
    { name: "Vanaheim", stageSchedule: mapGenresToSchedule(vanaheim, genreMap) },
    { name: "Jotunheim", stageSchedule: mapGenresToSchedule(jotunheim, genreMap) },
  ];

  return (
    <div className="px-10">
      <div className="flex flex-col items-center justify-center my-12">
        <h1 className="text-center text-4xl font-bold font-titan text-white">
          All Artists
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-0 md:mx-8">
        {bands.map((band, index) => {
          const bandSchedule = [];
          stages.forEach(({ name: stageName, stageSchedule }) => {
            Object.entries(stageSchedule).forEach(([day, events]) => {
              events.forEach((event) => {
                if (event.act?.toLowerCase().trim() === band.name.toLowerCase().trim()) {
                  bandSchedule.push({
                    stage: stageName,
                    day,
                    start: event.start,
                    end: event.end,
                  });
                }
              });
            });
          });

          const imageUrl = getImageUrl(band);

          return (
            <Sheet key={band.id || index}>
              <SheetTrigger asChild>
                <Card className="hover:scale-105 transition ease-in-out duration-300 hover:border-primary border-2 cursor-pointer rounded-xl">
                  <CardContent className="p-0">
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
    </div>
  );
}