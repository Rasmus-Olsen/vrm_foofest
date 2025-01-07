import { getSchedule, getBands } from "@/lib/database";
import ArtistList from "@/components/artistList/ArtistList";

export default async function LikedBandsPage() {
  // Hent schedules for stagerne og bands
  const [midgard, vanaheim, jotunheim, allBands] = await Promise.all([
    getSchedule("Midgard"),
    getSchedule("Vanaheim"),
    getSchedule("Jotunheim"),
    getBands(),
  ]);

  const genreMap = allBands.reduce((acc, band) => {
    acc[band.name.toLowerCase().trim()] = band.genre;
    return acc;
  }, {});

  const mapGenresToSchedule = (schedule) => {
    const mappedSchedule = {};
    Object.keys(schedule).forEach((day) => {
      mappedSchedule[day] = schedule[day].map((event) => ({
        ...event,
        genre: genreMap[event.act?.toLowerCase().trim()] || "Unknown",
      }));
    });
    return mappedSchedule;
  };

  const stages = [
    { name: "Midgard", stageSchedule: mapGenresToSchedule(midgard) },
    { name: "Vanaheim", stageSchedule: mapGenresToSchedule(vanaheim) },
    { name: "Jotunheim", stageSchedule: mapGenresToSchedule(jotunheim) },
  ];

  
  return (
    <div className="px-10">
    <div className="flex flex-col items-center justify-center my-12">
      <h1 className="text-center text-4xl font-bold font-titan text-white">
        Liked Artists
      </h1>
    </div>
    <ArtistList stages={stages} bands={[]} onlyLiked />
  </div>
  
  );
}