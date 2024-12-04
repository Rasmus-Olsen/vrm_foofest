import { getBands } from '@/lib/database'
import Image from 'next/image'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

async function displayArtists () {
  const bands = await getBands()

  return (
    <div className='px-10'>
      <h1 className='text-blue-500 text-center text-2xl font-bold mb-4'>
        All Artists
      </h1>
      <div className='grid grid-cols-3 gap-8'>
        {bands.map(band => (
          <Card>
            <CardHeader>
              <CardTitle className='text-center text-xl'>{band.name}</CardTitle>
              <CardDescription className='text-center'>
                {band.genre}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
              {/* Avatar */}
              <Avatar className='w-48 h-48 rounded-full'>
                <AvatarImage src={band.logo} alt={band.name} />
                <AvatarFallback>{band.name}</AvatarFallback>
              </Avatar>
            </CardContent>
            <CardContent></CardContent>
            <CardFooter className='flex justify-center'>
              {/* <p className='text-xs px-10 py-5'>{band.bio}</p> */}
              <Sheet>
                <SheetTrigger>View Artist</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{band.name}</SheetTitle>
                    <SheetDescription>{band.genre}</SheetDescription>
                    <SheetDescription>{band.members}</SheetDescription>
                    <SheetDescription>
                      {' '}
                      <Avatar className='w-48 h-48 rounded-full'>
                        <AvatarImage src={band.logo} alt={band.name} />
                        <AvatarFallback>{band.name}</AvatarFallback>
                      </Avatar>
                    </SheetDescription>
                    <SheetDescription>{band.bio}</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default displayArtists
