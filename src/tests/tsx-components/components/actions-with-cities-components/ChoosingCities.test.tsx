import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoosingCities from '../../../../components/actions-with-cities-components/СhoosingCities/ChoosingCities';

const mockCities = [
    {
        name: "Москва",
        district_id: 1,
        region_id: 80,
        coordinates: "55.755826,37.617300"
    },
    {
        name: "Абрамцево",
        district_id: 1,
        region_id: 80,
        coordinates: "56.214713,37.966186"
    },
    {
        name: "Алабино",
        district_id: 1,
        region_id: 80,
        coordinates: "55.524052,36.982281"
    },
    {
        name: "Апрелевка",
        district_id: 1,
        region_id: 80,
        coordinates: "55.548277,37.059156"
    }
];

const mockRouter = {
    push: jest.fn()
};

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    useSearchParams: () => new URLSearchParams()
}));

describe('ChoosingCities компонент', () => {
    beforeEach(() => {

        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
    });


    it('должен корректно рендериться', () => {
        render(<ChoosingCities
            searchCity=""
            cities={mockCities}
            cityFromServer="Москва"
            setSearchCity={jest.fn()}
            setSelectedCity={jest.fn()}
        />);

        expect(screen.getByText('Выберите город')).toBeTruthy();
        expect(screen.getByPlaceholderText('Москва')).toBeTruthy();
    });

    it('должен обрабатывать ввод в поисковое поле', () => {
        const setSearchCityMock = jest.fn();

        render(<ChoosingCities
            searchCity=""
            cities={mockCities}
            cityFromServer="Москва"
            setSearchCity={setSearchCityMock}
            setSelectedCity={jest.fn()}
        />);

        const input = screen.getByPlaceholderText('Москва');
        fireEvent.change(input, { target: { value: 'Санкт-Петербург' } });

        expect(setSearchCityMock).toHaveBeenCalledWith('Санкт-Петербург');
    });

    it('должен корректно обрабатывать закрытие', () => {
        const url = new URL('http://localhost.ru');
        url.searchParams.set('tab', '1');
        url.searchParams.set('user', '2');

        render(<ChoosingCities
            searchCity=""
            cities={mockCities}
            cityFromServer="Москва"
            setSearchCity={jest.fn()}
            setSelectedCity={jest.fn()}
        />);

        const closeBtn = screen.getByRole('button', {
            name: 'x'
        });
        fireEvent.click(closeBtn);

        expect(mockRouter.push).toHaveBeenCalled();
    });

    it('должен корректно обрабатывать выбор города', () => {
        const setSelectedCityMock = jest.fn();

        render(<ChoosingCities
            searchCity=""
            cities={mockCities}
            cityFromServer="Москва"
            setSearchCity={jest.fn()}
            setSelectedCity={setSelectedCityMock}
        />);

        const cityElement = screen.getByRole('button', {
            name: 'Москва'
        });
        fireEvent.click(cityElement);
        expect(setSelectedCityMock).toHaveBeenCalledWith("Москва");
    });
});