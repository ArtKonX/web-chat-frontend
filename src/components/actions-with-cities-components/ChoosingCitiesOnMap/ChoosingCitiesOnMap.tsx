import React from 'react';

import './ChoosingCitiesOnMap.scss'

import Btn from "@/components/ui/Btn/Btn";
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle";
import { FormEvent, useEffect, useRef, useState } from "react";

import { Coordinates } from '@/interfaces/position';
import { СhoosingCitiesOnMapProps } from '@/interfaces/components/actions-with-cities-components';

// Для отображения и работы карты
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import fetchCityFromCoors from "@/utils/fetchCityFromCoors";
import { useSearchParams, useRouter } from "next/navigation";
import CloseBtn from "@/components/ui/CloseBtn/CloseBtn";

const ChoosingCitiesOnMap = (
    { position, mapCity, setMapCity, setSelectedCity }: СhoosingCitiesOnMapProps
) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [newPosition, setNewPosition] = useState<Coordinates | null>(null);

    const searchParams = useSearchParams();
    const url = new URL(window?.location?.href);

    const router = useRouter();

    const onChooseСityOnMap = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (mapCity)
            setSelectedCity(mapCity)
    }

    useEffect(() => {
        // Если поменялись координаты, которые мы выбрали на карте
        // делаем запрос...
        if (newPosition) {
            // IIFE
            (async function () {
                const newPlace = await fetchCityFromCoors({ position: newPosition });
                console.log('newPlace', newPlace)
                setMapCity(newPlace)
            })()
        }
    }, [newPosition])

    useEffect(() => {
        // Если какая-то позиция поменялась

        // Если координаты точно доступны
        if (position) {
            // Создаем обьект карту и привязываем к ней ref из библиотеки OpenLayers
            const map = new Map({
                // Указываем что это точно не null
                target: mapRef.current!,
                // Создает слой с источником из OpenStreetMap
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    // С помощью fromLonLat преобразуем координаты в
                    // целевую проекцию для отображения
                    center: fromLonLat([position.longitude, position.latitude]),
                    // выбираем базовый зум карты
                    zoom: 16
                })
            });

            const onMoving = () => {
                // Получаем представление карты
                const view = map.getView();
                // текущий центр карты
                const center = view.getCenter();

                // Преобразуем координаты из EPSG:3857(проекция, которая используется
                // веб-картами) в EPSG:4326(человеческий формат для систем координат)
                const coorsArray = transform(center!, 'EPSG:3857', 'EPSG:4326');

                // if (position.longitude !== coorsArray[0] && position.latitude !== coorsArray[1]) {
                setNewPosition({
                    longitude: coorsArray[0],
                    latitude: coorsArray[1]
                });
                // }
            }

            map.on('moveend', onMoving)

            // При удалении компонента, чтобы отменить все действия
            // связанные с перемещениями карт(на всякий случай)
            return () => {
                if (map) {
                    map.setTarget(undefined);
                    map.un('moveend', onMoving);
                }
            }
        }

    }, [position])

    const onClose = () => {
        if (searchParams && url) {
            if (searchParams?.get('tab')) {
                const tab = searchParams?.get('tab') as string
                url.searchParams.set('tab', tab)
            }

            if (searchParams?.get('user')) {
                const user = searchParams?.get('user') as string
                url.searchParams.set('user', user)
            }

            if (searchParams?.get('offset')) {
                const offset = searchParams?.get('offset') as string
                url.searchParams.set('offset', offset)
            }

            if (searchParams?.get('city')) {
                const city = searchParams?.get('city') as string
                url.searchParams.set('city', city)
            }

            url.searchParams.delete('showMapCities');

            router.push(url.href)
        }
    }

    return (
        <div className="bg-white py-6 px-9 rounded-2xl
                                    max-w-3/6 max-lg:max-w-9/11 max-sm:max-w-9/10 w-full flex
                                    flex-col items-center justify-center relative">
            <div className="absolute right-3 -top-1">
                <CloseBtn onClose={onClose} />
            </div>
            <form onSubmit={onChooseСityOnMap}>
                <HeadingWithTitle text='Выберите свой город на карте:'>
                    <div className='flex text-xl flex-col font-bold mb-3'>
                        <div className="flex mb-3">
                            Выбранный город:
                            {newPosition && (
                                <div className="ml-3">
                                    <span className={`${typeof mapCity !== 'string' && 'animate-pulse'}`}>
                                        {typeof mapCity === 'string' ? mapCity : 'Поиск...'}
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Отображаем саму карту */}
                        <div className='shadow-lg shadow-gray-700 hover:cursor-grab
                    active:cursor-grabbing'
                            ref={mapRef}
                            style={{
                                maxWidth: '500px',
                                maxHeight: '500px',
                                height: '50vw',
                                width: '50vw',
                            }}
                        />
                    </div>
                </HeadingWithTitle>
                <div className="w-full text-right">
                    <Btn type='submit' text='Сохранить' disable={false} />
                </div>
            </form>
        </div>
    )
}

export default ChoosingCitiesOnMap