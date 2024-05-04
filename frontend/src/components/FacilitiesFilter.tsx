import { hotelFacilities} from "../config/hotel-options-config";

type Props={
      selectedFacility:string[];
      onChange:(event:React.ChangeEvent<HTMLInputElement>)=>void;
}


const FacilityFilter = ({selectedFacility,onChange}:Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">

      <h4 className="text-md font-semibold mb-2">Property Rating</h4>
       {hotelFacilities.map((facility) => (
            <label className="flex items-center space-x-2">
                  <input
                  type="checkbox"
                  className="rounded"
                  value={facility}
                  //  includes function checks whether the facilitycis included marked check or not
                  checked={selectedFacility.includes(facility)}
                  onChange={onChange}
                  />
                  <span>{facility}</span>
            </label>
       ))}
    </div>
  )
}

export default FacilityFilter;

