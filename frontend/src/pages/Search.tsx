import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext"
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCards from "../components/SearchResultCards";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypeFilter from "../components/HotelTypeFilter";
import FacilityFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {

      const search=useSearchContext();
      const [page,setPage]=useState<number>(1);
      const [selectedStars,setSelectedStars]=useState<string[]>([]);
      const [selectedTypes,setSelectedTypes]=useState<string[]>([]);
      const [selectedFacility,setSelectedFacility]=useState<string[]>([]);
      const [selectedPrice,setSelectedPrice]=useState<number | undefined>();
      const [sortOption,setSortOption]=useState<string>("");

      const searchParams = {
            destination: search.destination,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            adultCount: search.adultCount.toString(),
            childCount: search.childCount.toString(),
            page: page.toString(),
            stars:selectedStars,
            types:selectedTypes,
            facilities:selectedFacility,
            maxPrice:selectedPrice?.toString(),
            sortOption,
          };
        
      
      const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
       
      const starRating=event.target.value;

      setSelectedStars((prevStars)=>
            event.target.checked?[...prevStars,starRating]
            :prevStars.filter((star)=> star!==starRating)
      );
  };

  const handlehotelTypeChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
       
      const hotelType=event.target.value;

      setSelectedTypes((prevhotelType)=>
            event.target.checked?[...prevhotelType,hotelType]
            :prevhotelType.filter((type)=> type!==hotelType)
      )
  }

  const handlefacilityChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
       
      const facilities=event.target.value;

      setSelectedFacility((prevfacility)=>
            // if the facility is checked marks
            event.target.checked?[...prevfacility,facilities]
            // else if the facility is unchecked or unmarked
            :prevfacility.filter((facility)=> facility!==facilities)
      )
  }

  return (
      //[250px_1fr] means that the 2 cols is divided in the 250 px and rest of space occupied by other in the large scrren lg
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      {/* top-10-->This element is positioned 2.5rem (by default) from the top edge of its containing element. */}

      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">

            <div className="space-y-5">
                  <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by:
                  </h3>
                  {/* Todo filters */}
                  <StarRatingFilter 
                  selectedStars={selectedStars}
                  onChange={handleStarsChange} />

                  <HotelTypeFilter
                  selectedHotelTypes={selectedTypes}
                  onChange={handlehotelTypeChange}/>

                  <FacilityFilter 
                  selectedFacility={selectedFacility}
                  onChange={handlefacilityChange}/>

                  <PriceFilter
                  selectedPrice={selectedPrice}
                  onChange={(value?:number)=>setSelectedPrice(value)}/>

            </div>
      </div>

      <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination? ` in ${search.destination}` : ""}
                  </span>

                  <select
                  value={sortOption}
                  onChange={(event)=>setSortOption(event.target.value)}
                  className="p-2 border rounded-md">

                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                        <option value="pricePerNightDesc">Price Per Night (high to low)</option>
                  </select>

                  {/* TODO options */}
            </div>
                {hotelData?.data.map((hotel)=>(
                  <SearchResultCards hotel={hotel}/>
                ))}

                 <div>
                   <Pagination page={hotelData?.pagination.page || 1} pages={hotelData?.pagination.pages || 1}
                   onPageChange={(page)=>setPage(page)}
                   />
                  </div>    

      </div>
    </div>
  )
}

export default Search
