import React from 'react';

const mockPosition = {
    longitude: 37.6173,
    latitude: 55.7558
};

const mockMapCity = 'Москва';

jest.mock('ol', () => ({
    Map: jest.fn().mockImplementation(() => ({
        setTarget: jest.fn(),
        on: jest.fn(),
        un: jest.fn(),
        getView: jest.fn(() => ({
            getCenter: jest.fn(() => [0, 0]),
            setCenter: jest.fn(),
        })),
        getLayers: jest.fn(() => ({
            getArray: jest.fn(() => []),
        })),
    })),
    View: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('ol/layer/Tile', () => jest.fn().mockImplementation(() => ({})));

jest.mock('ol/source/OSM', () => jest.fn().mockImplementation(() => ({})));

jest.mock('ol/proj', () => ({
    fromLonLat: jest.fn(() => [0, 0]),
    transform: jest.fn(() => [0, 0]),
}));

jest.mock('@/utils/fetchCityFromCoors', () => jest.fn());
const fetchCityFromCoorsMock = jest.requireMock('@/utils/fetchCityFromCoors');

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    useSearchParams: () => mockSearchParams,
}));

import { render, screen, waitFor } from '@testing-library/react';
import ChoosingCitiesOnMap from '../../../../components/actions-with-cities-components/ChoosingCitiesOnMap/ChoosingCitiesOnMap';

beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

describe('ChoosingCitiesOnMap компонент', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
    });

    it('должен отображать выбранный город', async () => {
        fetchCityFromCoorsMock.mockResolvedValue(mockMapCity);

        render(<ChoosingCitiesOnMap
            position={mockPosition}
            mapCity={'Москва'}
            setMapCity={jest.fn()}
            setSelectedCity={jest.fn()}
        />);

        await waitFor(() => {
            expect(screen.getByTestId('selected-city')).toBeTruthy();
            expect(screen.getByText('Москва')).toBeTruthy();
        });
    });
    it('должен вызывать fetchCityFromCoors при изменении позиции', async () => {
        fetchCityFromCoorsMock.mockResolvedValue(mockMapCity);

        render(<ChoosingCitiesOnMap
            position={mockPosition}
            mapCity={'Москва'}
            setMapCity={jest.fn()}
            setSelectedCity={jest.fn()}
            testSetNewPosition={{
                longitude: 37.6174,
                latitude: 55.7559
            }}
        />);

        await waitFor(() => {
            expect(fetchCityFromCoorsMock).toHaveBeenCalled();
        });
    });
})