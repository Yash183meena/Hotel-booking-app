import { AiFillStar } from 'react-icons/ai'
import { HotelType } from '../../../backend/src/shared/types'
import { Link } from 'react-router-dom'

type props={
      hotel:HotelType
}

const SearchResultCards = ({hotel}:props) => {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-400 rounded-lg p-9 gap-8'>
      {/* w-full h-[300px] --> this means the height of image is aways the 3000px and the -full means the widht is full just as the aspect ration */}
      {/* [2fr_3fr] ek shorthand hai jo do columns ko set karta hai, jisme pehla column 2 fractions of available space lekar aur doosra column 3 fractions of available space lekar size hota hai. */}
       <div className="w-full h-[300px]">
            <img src={hotel.imageUrls[0]} className='w-full h-full object-cover object-center'/>
       </div>
         <div className="grid grid-rows-[1fr_2fr_3fr]">
            <div>
                  <div className="flex items-center">
                        <span className="flex">
                              {Array.from({length: hotel.starRating}).map(()=>(
                                    <AiFillStar className='fill-yellow-400'/>
                              ))}
                        </span>
                        <span className="ml-1 text-sm">{hotel.type}</span>
                  </div>
                  <Link to={`/details/${hotel._id}`} className="text-2-xl font-bold cursor-pointer">{hotel.name}</Link>
            </div>
            <div>
            <div className="line-clamp-4">
              {/* line-clamp-4 specific example hai jismein 4 lines tak ki text display hoti hai. Agar aap chahein toh  */}
                  {hotel.description}
              </div>
            </div>

            <div className="grid grid-cols-2 items-end whitespace-nowrap">
                   <div className="flex gap-1 items-center">
                        {/* slice function makes an anther array in which the it stores the element from the index starts from 0 and end at one before 3 --> (0,3) */}
                        {hotel.facilities.slice(0,3).map((facility)=>(
                              <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrow">
                                    {facility}
                              </span>
                        ))}
                        <span className="text-sm">
                              {hotel.facilities.length>3 && `+${hotel.facilities.length-3} more`}
                        </span>
                   </div>

                   <div className='flex flex-col items-end gap-1'>
                       <span className="font-bold">
                         ₹{hotel.pricePerNight} per night
                       </span>
                       <Link to={`/details/${hotel._id}`}className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500">
                        View More
                       </Link>
                   </div>
            </div>
         </div>
    </div>
  )
}

export default SearchResultCards;
