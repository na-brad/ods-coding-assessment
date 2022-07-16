import './App.css';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Papa from 'papaparse';
import AutoComplete from './AutoComplete';
import { headers } from './headers';
import moment from 'moment';


function App() {
  const [flights, setFlights] = useState([]);
  const [stations, setStations] = useState([]);
  const [query, setQuery] = useState('');

  const url = '/flights.csv';
  let locations = [];

  useEffect(() => {
    const fetchCsv = async () => {
      return await fetch(url).then(response => {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');

          return reader.read().then(result => {
              return decoder.decode(result.value);
          });
      });
    }

    const addLocation = (flight) => {
      if(!locations.includes(flight.origin)){
        locations.push(flight.origin);
      }
      if(!locations.includes(flight.destination)){
        locations.push(flight.destination);
      }
      if(!locations.includes(flight.destination_full_name)){
        locations.push(flight.destination_full_name);
      }
      if(!locations.includes(flight.origin_full_name)){
        locations.push(flight.origin_full_name);  
      }
    }

    const getFlightsData  = async () => {
      const csv = await fetchCsv();
      const flightsData = Papa.parse(csv, {header: true, delimiter: ','});

      const formattedFlights = flightsData.data.map((flight) => {
        addLocation(flight);
        return {
                id: flight.id,
                flightNumber: parseInt(flight.flt_num),
                outGmt: moment(flight.out_gmt).format('MMMM Do YYYY, h:mm A'), 
                inGmt: moment(flight.in_gmt).format('MMMM Do YYYY, h:mm A'),
                originCode: flight.origin,
                originStation: flight.origin_full_name,
                origin: `${flight.origin_full_name} (${flight.origin})`,
                destinationCode: flight.destination,
                destinationStation: flight.destination_full_name,
                destination: `${flight.destination_full_name} (${flight.destination})`, 
               }
      });
      
      setStations(locations);
      setFlights(formattedFlights);
      return flightsData;
    }

    getFlightsData();

  },[]);

  const filterFlights = (query, flights) => {
    if(!query) {
      return [];
    } else if(query.length === 3){
      return flights.filter(flight => {
        return flight.destinationCode?.toLowerCase() === query || flight.originCode?.toLowerCase() === query
      });
    } else {
      return flights.filter(flight => {
        return flight.destinationStation?.toLowerCase() === query || flight.originStation?.toLowerCase() === query 
      });
    }
  }
  const flightsFiltered = filterFlights(query, flights);

  return (
    <Box className='box' fixed>
      <AppBar className='appBar' position='static'>
        <Toolbar>
          <img src='delta-logo.png' alt='logo' className='logo'/>
          <span>SEARCH FOR FLIGHTS</span>
        </Toolbar>
      </AppBar>
      <div className='autoComplete'>
        <br/>
        <div className='autoCompleteMenu'>
          <AutoComplete
            suggestions={stations}
            setTestQuery={setQuery}
          />
        </div>
        {flightsFiltered.length > 0 && 
        <div className='dataGrid'>
          <DataGrid
          rows={flightsFiltered}
          columns={headers}
          pageSize={5}
        />
        </div>}
      </div>
    </Box>
  );
}

export default App;
