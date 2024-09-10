'use client'

import React, { useState } from 'react';
import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';
import { setTimeout } from 'timers';
import { SuggestionBox } from './SuggestionBox';

type Props = { location?: string }

export default function Navbar({location}: Props) {
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [place, setPlace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom);

    async function handleInputChange(value: string) {
        setCity(value);
        if(value.length >= 3) {
            try {
                const response = await axios.get(
                    `http://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
                );

                const suggestions = response.data.list.map((item: any) => item.name);
                setSuggestions(suggestions);
                setError('');
                setShowSuggestions(true);
            } catch (error) {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
    }

    function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
        setLoadingCity(true);
        e.preventDefault();

        if (suggestions.length == 0) {
            setError('Location not found');
            setLoadingCity(false);
        } else {
            setError('');

            setTimeout(() => {
                setLoadingCity(false);
                setPlace(city);
                setShowSuggestions(false);                
            }, 500);

        }
    }

    function handleCurrentLocation() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const {latitude, longitude} = position.coords;
                    console.log('new place: ', position.coords)
                try {
                    setLoadingCity(true);

                    const response = await axios.get(
                        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
                    );

                    console.log('response', response)
                    setTimeout(() => {
                        setLoadingCity(false);
                        setPlace(response.data.name);
                    }, 500)
                } catch (error) {
                    setLoadingCity(false);
                        console.log('error', error)
                }
            })
        }
    }

    return (
        <>
            <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
                <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
                    <p className='flex items-center justify-center gap-2'>
                        <h2 className='text-gray-500 text-3xl'>
                            Weather
                        </h2>
                        <MdWbSunny className='text-3xl mt-1 text-yellow-300'/>
                    </p>

                    <section className='flex gap-2 items-center'>
                        <MdMyLocation
                            title='Your Current Location'
                            onClick={handleCurrentLocation}
                            className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'
                        />

                        <MdOutlineLocationOn className='text-3xl'/>

                        <p className='text-slate-900/80 text-sm'> {location} </p>
                        <div className='relative hidden md:flex'>
                            <SearchBox
                                value={city}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onSubmit={handleSubmitSearch}
                            />
                            <SuggestionBox
                                {...{
                                    showSuggestions,
                                    suggestions,
                                    handleSuggestionClick,
                                    error
                                }}
                            />
                        </div>
                    </section>
                </div>
            </nav>

            <section className='flex max-w-7xl px-3 md:hidden'>
                <div className='relative'>
                    <SearchBox
                        value={city}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onSubmit={handleSubmitSearch}
                    />
                    <SuggestionBox
                        {...{
                            showSuggestions,
                            suggestions,
                            handleSuggestionClick,
                            error
                        }}
                    />
                </div>
            </section>
        </>
    )
}
