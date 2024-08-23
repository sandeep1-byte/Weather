import { useEffect, useState } from "react";
import { IoLocation } from "react-icons/io5";
import './weather.css';
import axios from 'axios'


export default function Wheather() {
    // const [image,setImage] = useState("")
    const [city, setCity] = useState(null);
    const [search, setSearch] = useState("indore");
    const [dateTime, setDateTime] = useState(new Date());

    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1; // Months are 0-based
    const day = dateTime.getDate();

    const [lat, setLat] = useState(null); // Latitude
    const [lon, setLon] = useState(null); // Longitude

    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.post(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=66766eb4593dce5fda011c772840f994`,)
            .then((res => {
                // console.log(res);
                setCity(res.data);
                setDateTime(new Date());
                setLat(res.data.coord.lat);
                setLon(res.data.coord.lon);

            })).catch(err => {
                console.log(err);
            })
    }, [search])

    const key = '66766eb4593dce5fda011c772840f994';

    useEffect(() => {
        if (lat && lon) {
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
                .then(response => {
                    // console.log(response.data.list); // Log the response for debugging
                    setForecast(response.data.list); // Set the daily forecast data
                    setError(null); // Reset error on successful fetch
                })
                .catch(err => {
                    setError('Failed to fetch forecast'); // Set error message if forecast fetch fails
                    console.error(err);
                });
        }
    }, [lat, lon]);
    useEffect(() => {   
            axios.get(`http://api.weatherstack.com/alerts?access_key=${key}&query=${lat},${lon}`)
                .then(response => {
                    console.log(response); // Log the response for debugging
                })
                .catch(err => {
                    setError('Failed to fetch forecast'); // Set error message if forecast fetch fails
                    console.error(err);
                });
        });

    const getWeatherDescription = (weatherMain) => {
        if (weatherMain === "Clouds") {
            // setImage("./Img/cloud-29.webp");
            return "Cloudy weather";
        } else if (weatherMain === "Rain") {
            // setImage("./Img/cloud-29.webp");
            return "Rainy weather";
        } else if (weatherMain === "Clear") {
            return "Clear weather";
        } else if (weatherMain === "Drizzle") {
            return "Drizzle weather";
        } else if (weatherMain === "Mist") {
            return "Mist weather";
        } else {
            return "Weather description not available";
        }
    };

    const handleSearch = (e)=>{
        if(e.target.value){
            setSearch(e.target.value);
        }else{
            setSearch("Indore")
        }
    }
    return <>
        <div id='parentbox' className=" container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className='box p-3 shadow-sm rounded' style={{ width: "100%", maxWidth: "1200px" }}>
                <h1 className="boxfirst mb-4 text-center">Welcome to the Weather Application</h1>
                <h4 className="text-end fw-bold mb-4">{day}/{month}/{year}</h4>
                <div className=' mb-4'>
                    <label className="fs-4 fw-bold text-dark">Search weather location</label>
                    <input type="search" className="form-control custom-input" id="inputsearch" onChange={handleSearch} />
                </div>
                {!city ? (
                    <p className='text-center'>Weather data not found for the specified location.</p>
                ) : (
                    <>
                        <div className='mt-4 d-flex flex-wrap justify-content-between align-items-center p-3 rounded'>
                            <div className="d-flex align-items-center">
                                <h2><IoLocation /></h2>
                                <h2 className="ms-3"><span className="fw-bold fs-4">{search}</span></h2>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <img src="./Img/cloud-png-image-from-pngfre-4.png" className="mb-2" style={{ height: "50px", width: "60px" }} alt="Temperature Icon" />
                                <h2 className='fw-bold fs-5'>Current temperature: {city?.main.temp}°C</h2>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <img src="./Img/cloud-29.webp" className="mb-2" style={{ width: "70px" }} alt="Humidity Icon" />
                                <h2 className='fw-bold fs-5'>Humidity: {city?.main.humidity}%</h2>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <img src="./Img/cloud-29.webp" className="mb-2" style={{ width: "70px" }} alt="Pressure Icon" />
                                <h6 className='fw-bold fs-5'>Pressure: {city?.main.pressure} Mb</h6>
                                <h6>{city?.lon}</h6>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <img src="./Img/cloud-29.webp" className="mb-2" style={{ width: "70px" }} alt="Wind Icon" />
                                <h2 className='fw-bold fs-5'>Wind: {city?.wind.speed} km/h</h2>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <h2 className='fw-bold fs-5'>Weather</h2>
                                <h4 className='fw-bold fs-5'>{getWeatherDescription(city.weather[0].main)}</h4>
                            </div>
                        </div>

                        <div className="mt-4 mb-4">
                            <h3 className="fw-bold fs-4 text-center">6-Day Weather Forecast</h3>
                        </div>

                        {/* Forecast Data */}
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Temperature</th>
                                        <th>Wind</th>
                                        <th>Pressure</th>
                                        <th>Humidity</th>
                                        <th>Weather</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forecast ? (
                                        forecast.slice(0, 40).map((item, index) => {
                                            if (index % 7 === 0) {
                                                return (
                                                    <tr key={index}>
                                                        <td>{new Date(item.dt * 1000).toDateString()}</td>
                                                        <td>{item.main.temp}°C</td>
                                                        <td>{item.wind.speed} km/h</td>
                                                        <td>{item.main.pressure} Mb</td>
                                                        <td>{item.main.humidity}%</td>
                                                        <td>{getWeatherDescription(item.weather[0].main)}</td>
                                                    </tr>
                                                );
                                            }
                                            return null;
                                        }).filter(item => item !== null) // Remove null values from the result
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">Loading forecast...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    </>
}