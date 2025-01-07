import { getSchedule, getBands } from "@/lib/database";
import LikedBand from "@/components/likedBand/LikedBand";

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

  // Simuler hentning af liked bands fra localStorage på server-siden
  const likedBands =
    JSON.parse(
      typeof localStorage !== "undefined"
        ? localStorage.getItem("likedBands")
        : "[]"
    ) || [];

  // Filtrer kun de bands, der er liket
  const filteredLikedBands = allBands.filter((band) =>
    likedBands.some((likedBand) => likedBand.slug === band.slug)
  );

  return (
    <div className="px-6 sm:px-10 lg:px-20 py-10">
      <h1 className="text-4xl font-bold text-center text-white my-8">
        Liked Artists
      </h1>

      {filteredLikedBands.length === 0 ? (
        <p className="text-center text-primary">No liked artists yet!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredLikedBands.map((band) => (
            <LikedBand key={band.slug} band={band} stages={stages} />
          ))}
        </div>
      )}
    </div>
  );
}
