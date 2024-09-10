'use client'

import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useAtom } from "jotai";
import Image from "next/image";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";
import { WeatherSkeleton } from "@/components/WeatherSkeleton";

interface WeatherData {
	cod: string;
	message: number;
	cnt: number;
	list: Array<{
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	visibility: number;
	pop: number;
	sys: {
		pod: string;
	};
	dt_txt: string;
	}>;
	city: {
	id: number;
	name: string;
	coord: {
		lat: number;
		lon: number;
	};
	country: string;
	population: number;
	timezone: number;
	sunrise: number;
	sunset: number;
	};
}

export default function Home() {
	// test point
	const [place, setPlace] = useAtom(placeAtom);
    const [loadingCity, _] = useAtom(loadingCityAtom);

	const { isLoading, error, data, refetch } = useQuery<WeatherData> (
		'repoData', 
		async () => {
			const {data} = await axios.get(
			`http://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
			);
			return data;
		}    
	);

	useEffect(() => {
		refetch();
	}, [place, refetch])
	

	const firstData = data?.list[0];

	const uniqueDates = [
		...new Set(
			data?.list.map(
				(entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
			)
		)
	];

	const firstDataForEachDate = uniqueDates.map((date) => {
		return data?.list.find((entry) => {
			const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
			const entryTime = new Date(entry.dt * 1000).getHours();
			return entryDate === date && entryTime >= 6
		})
	});

	if (isLoading) return (
		<div className="flex items-center min-h-screen justify-center">
			<p className="animate-bounce">
			Loading...
			</p>
	</div>
	)

	return (
		<div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
			<Navbar location={data?.city.name} />

			<main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
				{loadingCity 
					? <WeatherSkeleton />
					: (
					<>
						<section className="space-y-4">
							<div className="space-y-2">
								<h2 className="flex gap-1 text-2xl items-end">
									<p> {format(parseISO(firstData?.dt_txt ?? ""), 'EEEE')} </p>
									<p className="text-lg">( {format(parseISO(firstData?.dt_txt ?? ""), 'dd.MM.yyyy')} )</p>
								</h2>

								<Container className="gap-10 px-6 items-center">
									<div className="flex flex-col px-4">
										<span className="text-5xl">
										{convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
										</span>
										<p className="text-xs space-x-1 whitespace-nowrap">
										<span> Feels like</span>
										<span>
											{convertKelvinToCelsius(firstData?.main.feels_like ?? 296.37)}°
										</span>
										</p>
										<p className="text-xs space-x-2">
										<span>
											{convertKelvinToCelsius(firstData?.main.temp_min ?? 296.37)}° ↓{" "}
										</span>
										<span>
											{" "}
											{convertKelvinToCelsius(firstData?.main.temp_max ?? 296.37)} 
											° ↑
										</span>
										</p>
									</div>

									<div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
										{data?.list.map((d, i) => {
										return (
											<div
												key={i}
												className="flex flex-col justify-between gap-2 pb-5 items-center text-xs font-semibold"
											>
												<p className="whitespace-nowrap">
													{format(parseISO(d.dt_txt), 'HH:mm')}
												</p>

												<WeatherIcon iconName={d.weather[0].icon} /> 
												<p>{convertKelvinToCelsius(d.main.temp ?? 0)}°</p>
											</div>
										);
										} )}
									</div>
								</Container>
							</div>

							<div className="flex gap-4">
								<Container className="w-fit justify-center flex-col px-4 items-center">
									<p className="capitalize text-center">{firstData?.weather[0].description}</p>
									<WeatherIcon
										iconName={firstData?.weather[0].icon ?? ""}
									/>
								</Container>

								<Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
									<WeatherDetails
										visibility = {`${((firstData?.visibility ?? 0)/1000).toFixed(0)} km`}
										humidity = {`${firstData?.main.humidity} %`}
										windSpeed = {`${((firstData?.wind.speed ?? 0) * 3.6).toFixed(0)} km/h`}
										airPressure = {`${firstData?.main.pressure} hPa`}
										sunrise = {format(fromUnixTime(data?.city.sunrise ?? 1), "HH:mm")}
										sunset = {format(fromUnixTime(data?.city.sunset ?? 1), "HH:mm")}
									/>
								</Container>
							</div>
						</section>

						<section className="flex w-full flex-col gap-4">
								<p className="text-2xl">Forecast ( 7 days )</p>
								{firstDataForEachDate.map((d, i) => (
									<ForecastWeatherDetail
										key={i}
										weatherIcon = {d?.weather[0].icon ?? '01d'}
										date = {format(parseISO(d?.dt_txt ?? ''), "dd.MM")}
										day = {format(parseISO(d?.dt_txt ?? ''), "EEEE")}
										temp = {d?.main.temp ?? 0}
										feels_like = {d?.main.feels_like ?? 0}
										temp_min = {d?.main.temp_min ?? 0}
										temp_max = {d?.main.temp_max ?? 0}
										description = {d?.weather[0].description ?? ''}
										visibility = {`${((d?.visibility ?? 0)/1000).toFixed(0)} km`}
										humidity = {`${d?.main.humidity} %`}
										windSpeed = {`${((d?.wind.speed ?? 0) * 3.6).toFixed(0)} km/h`}
										airPressure = {`${d?.main.pressure} hPa`}
										sunrise = {format(fromUnixTime(data?.city.sunrise ?? 1), "HH:mm")}
										sunset = {format(fromUnixTime(data?.city.sunset ?? 1), "HH:mm")}
									/>
								))}
						</section>
					</>
				)}
			</main>
		</div>
	);
}
