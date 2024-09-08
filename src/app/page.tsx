'use client'
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ModeToggle } from "@/components/toggle/toggle";
import { useEffect, useState } from "react";
import { WiHumidity } from "react-icons/wi";
import { FaWind, FaTemperatureHigh } from "react-icons/fa";
import { GoCloud } from "react-icons/go";
import { CiCloud } from "react-icons/ci";
import { MdLocationCity } from "react-icons/md";

// Define the type for weather data
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
}

async function fetchWeatherData(city: string | null = null, lat: number | null = null, lon: number | null = null): Promise<WeatherData | null> {
  let response;
  if (city) {
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3a9cd7e2d1096bdaeace52d225551943&units=metric`);
  } else if (lat && lon) {
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3a9cd7e2d1096bdaeace52d225551943&units=metric`);
  }

  if (response && response.ok) {
    const data: WeatherData = await response.json();
    return data;
  }

  return null;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("pune");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const data = await fetchWeatherData(null, latitude, longitude);
        setWeatherData(data);
        setCity(data?.name ?? ''); // Fallback to empty string if no name
      }, (error) => {
        console.error("Error fetching location:", error);
      },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const data = await fetchWeatherData(city);
    setWeatherData(data);
    setLoading(false);
  };

  return (
    <>
      <nav className="flex justify-around md:gap-60 gap-32  border-y-2 w-auto   p-4">
        <h1 className="text-4xl font-bold">Weather App</h1>
        <ModeToggle />
      </nav>
      <div className="container md:mb-0 mb-5">
        <div className="flex justify-center items-center gap-6 m-auto mt-6">
          <input
            className="w-[40vw] p-3 border-black dark:border-white border-x-2 border-y-2 rounded-md"
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleClick}
            className="bg-black text-white dark:bg-slate-50 dark:text-black py-3 rounded-lg px-5"
          >
            Fetch
          </button>
        </div>

        <div className="cityname md:flex gap-10 justify-center items-center mt-3 text-4xl">
          <p className="mt-8 flex gap-3 p-4 px-7 border-2 dark:border-blue-400 dark:bg-black bg-teal-100 rounded-lg">
            <MdLocationCity />
            {loading
              ? 'Loading...'
              : weatherData?.name || 'City: Loading...'}
          </p>
          <p className="mt-8 flex gap-3 dark:border-blue-400 dark:bg-black border-2 p-4 bg-amber-100 rounded-lg">
            <FaTemperatureHigh />
            {loading
              ? 'Loading...'
              : weatherData?.main
              ? `Temperature: ${parseInt(weatherData.main.temp.toString())}°C`
              : 'Enter a city to get weather'}
          </p>
          <p className="mt-8 flex gap-3 dark:border-blue-400 dark:bg-black border-2 p-4 bg-purple-100 rounded-lg">
            <CiCloud />
            {loading
              ? 'Loading...'
              : weatherData?.weather[0].description || 'Enter a city to get weather'}
          </p>
        </div>

        <main className="flex items-center justify-center mt-14">
          <div className="cardContainer md:flex gap-4 md:gap-4">
            <Card className="border-[3px] mt-3 w-[90vw] border-slate-500 bg-green-100 dark:bg-black dark:border-white md:h-[40vh] md:w-[20vw] text-blue-400 flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle>
                  <WiHumidity className="h-40 w-44 fill-green-500" />
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-3xl mt-[-30px] text-green-500">
                Humidity
              </CardDescription>
              <CardFooter className="text-2xl mt-6">
                <p>
                  {weatherData?.main
                    ? ` ${weatherData.main.humidity}%`
                    : 'Humidity: Loading...'}
                </p>
              </CardFooter>
            </Card>

            <Card className="border-[3px] mt-3 w-[90vw] border-slate-500 bg-purple-100 dark:bg-black dark:border-white md:h-[40vh] md:w-[20vw] text-blue-400 flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle>
                  <FaWind className="h-32 w-44 fill-purple-900" />
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-3xl mt-[0px] text-purple-900">
                Wind Speed
              </CardDescription>
              <CardFooter className="text-2xl mt-6">
                <p>
                  {weatherData?.wind
                    ? ` ${weatherData.wind.speed} km/h`
                    : 'Wind Speed: Loading...'}
                </p>
              </CardFooter>
            </Card>

            <Card className="border-[3px] mt-3 w-[90vw] border-slate-500 bg-blue-100 dark:bg-black dark:border-white md:h-[40vh] md:w-[20vw] text-blue-400 flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle>
                  <GoCloud className="h-40 w-44 fill-blue-400 z-10" />
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-3xl mt-[-30px] z-10 text-blue-400">
                Clouds
              </CardDescription>
              <CardFooter className="text-2xl z-10 mt-6">
                <p>
                  {weatherData?.clouds
                    ? ` ${weatherData.clouds.all}%`
                    : 'Clouds: Loading...'}
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
