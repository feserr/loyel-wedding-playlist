import { createContext } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

export const SpotifyContext = createContext<SpotifyWebApi.SpotifyWebApiJs>(new SpotifyWebApi());

export default SpotifyContext;
