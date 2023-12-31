import {SearchForm} from "@/conponents/weather/SearchForm";
import {WeatherInfo} from "@/conponents/weather/WeatherInfo";
import {ForecastList} from "@/conponents/weather/ForecastList";
import React, {useEffect, useState} from "react";
import {callForecastApi, callWeatherApi} from "@/api/api";
import {ForeCastResponse} from "@/types/api/ForecastResponce";
import Image from "next/image";

interface Props {
    city: string
}

export const Weather = ({city}: Props) => {

    const [cityState, setCityState] = useState(city)

    const [weatherState, setWeatherState] = useState<Weather>({
        city: '',
        wind: 0,
        humidity: 0,
        description: '',
        icon: '',
        daily: []
    })

    const [forecastState, setForecastState] = useState<ForeCastResponse | null>(null)

    const getWeatherData = async () => {
        const response = await callWeatherApi({city : cityState})

        const weather: Weather = {
            city: response.name,
            wind: response.wind.speed,
            humidity: response.main.humidity,
            description: response.weather[0].description,
            icon: response.weather[0].icon,
            daily: []
        }
        setWeatherState(weather)

        const forecastResponse = await callForecastApi({lat: response.coord.lat,lon: response.coord.lon})
        setForecastState(forecastResponse)
    }

    useEffect(
        ()=>{
        getWeatherData().then()
    },
        [cityState]
    )

    // @ts-ignore
    return (
        <div className={'flex flex-col items-center bg-black'}>
            <Image src={'next.svg'} alt={'LOGO'} width={86} height={44}/>
            <div className={'bg-white shadow mt-4 rounded-2xl p-8 py-16'}>
                <SearchForm city={cityState} setCityState={setCityState}/>
                <WeatherInfo weather={weatherState}/>
                {forecastState && <ForecastList forecast={forecastState}/>}
            </div>
        </div>
    );
};