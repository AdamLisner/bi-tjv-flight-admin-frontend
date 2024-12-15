import { useParams } from "react-router-dom";
import React , {useState, useEffect} from React;
import API from "../services/api";
import { getAirlineById } from "../services/airlineService";

const AirlineDetail = ()  => {

    const airlineId = useParams();

    const [airline, setAirline] = useState([]);

    const handleFetch = async ()  = {
        const airlineData = await getAirlineById(airlineId)
    }

}

export default AirlineDetail;


