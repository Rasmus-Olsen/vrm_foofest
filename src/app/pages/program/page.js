import Schedule from '@/components/schedule/Schedule'
import { getSchedule, getBands } from '@/lib/database'

export default async function ProgramPage () {
  const [midgard, vanaheim, jotunheim, bands] = await Promise.all([
    getSchedule('Midgard'),
    getSchedule('Vanaheim'),
    getSchedule('Jotunheim'),
    getBands()
  ])

  const genreMap = bands.reduce((acc, band) => {
    acc[band.name] = band.genre
    return acc
  }, {})

  const stages = [
    { name: 'Midgard', stageSchedule: mapGenresToSchedule(midgard, genreMap) },
    {
      name: 'Vanaheim',
      stageSchedule: mapGenresToSchedule(vanaheim, genreMap)
    },
    {
      name: 'Jotunheim',
      stageSchedule: mapGenresToSchedule(jotunheim, genreMap)
    }
  ]

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen gap-6'>
        <h1 className='text-7xl font-bold mt-12 font-titan'>
          Festival Program
        </h1>
        <Schedule stages={stages} />
      </div>
    </>
  )
}

function mapGenresToSchedule (schedule, genreMap) {
  const mappedSchedule = {}
  Object.keys(schedule).forEach(day => {
    mappedSchedule[day] = schedule[day].map(event => ({
      ...event,
      genre: genreMap[event.act] || 'Unknown'
    }))
  })
  return mappedSchedule
}
