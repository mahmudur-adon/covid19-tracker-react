import React,{useState, useEffect} from 'react';
import{
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'
import LineGraph from './LineGraph'
import Footer from './Footer';
import './App.css';
import "leaflet/dist/leaflet.css";


//https://disease.sh/v3/covid-19/countries

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("Bangladesh");
  const [countryInfo,setCountryInfo]=useState({
  });
  const [tableData,setTableData] =useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 23.685, lng: 90.3563 });
  const [mapZoom, setMapZoom] = useState(5.2,50);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(()=>{
  fetch("https://disease.sh/v3/covid-19/countries/BANGLADESH")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[])

useEffect(()=>{
const getCountriesData=async()=>{
await fetch ("https://disease.sh/v3/covid-19/countries")
.then((response)=>response.json())
.then((data)=>{
  const countries=data.map((country)=>(
    {
      name:country.country,
      value:country.countryInfo.iso2
    }
  ));

  const sortedData=sortData(data)
  setTableData(sortedData);
  setMapCountries(data);
  setCountries(countries);
})
}
getCountriesData();
},[]);

const onCountryChange =async (event) => {
  const countryCode=event.target.value;
 
const url =
  countryCode === "Bangladesh"
    ? "https://disease.sh/v3/covid-19/countries/BANGLADESH"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

await fetch(url)
.then(response=>response.json())
.then(data=>{
  setCountry(countryCode);
  setCountryInfo(data)

  countryCode === "Bangladesh"
    ? setMapCenter([23.685, 90.3563])
    : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

  setMapCenter([data.countryInfo.lat,data.countryInfo.long])
})

};

console.log(countryInfo);
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h2>COVID-19 Today</h2>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="Bangladesh">Bangladesh</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/* <MenuItem value="Bangladesh">Bangladesh</MenuItem>
    <MenuItem value="Bangladesh">option 2</MenuItem>
    <MenuItem value="Bangladesh">option 3</MenuItem>
  <MenuItem value="Bangladesh">yo id no</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            title="Recovered"
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live cases by Country</h3>
            <Table countries={tableData} />
            {/* <h3>Bangladesh new {casesType}</h3>
<LineGraph */}
            <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
        </Card>

        <Footer />
      </div>
    </div>
  );
  
}

export default App;
