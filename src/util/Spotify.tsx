import SpotifyWebApi from "spotify-web-api-js";

import { SpotifyContext } from "../contexts/SpotifyContext";
import { useContext } from "react";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_REDIRECT_URI;

const spotifyApi = new SpotifyWebApi();

export default class Spotify {
	spotifyApi = useContext(SpotifyContext);

	static setToken(accessToken: string) {
		spotifyApi.setAccessToken(accessToken);
	}

	static getAccessToken() {
		const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&show_dialog=true&redirect_uri=${redirect_uri}`;
		window.location.assign(accessUrl);
	}

	static async getUserData() {
		const dummySearch = await this.search("dummy");
		if (!dummySearch) throw new Error("Token not valid");

		const user = await spotifyApi.getMe();

		if (!user) throw new Error("Couldn't get the user name");

		return { id: user.id, name: user.display_name || "undefined" };
	}

	static async search(searchTerm: string) {
		const searchResult = await spotifyApi.search(searchTerm, ["track", "artist", "album"]);
		if (!searchResult.tracks) throw new Error("Failed to search");

		return searchResult.tracks.items.map((track) => {
			return ({
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri,
				addedByUserId: "",
				addedByDisplayName: "",
				likes: [],
				disable: false,
			})
		});
	}

	static async getTrackInfo(trackId: string) {
		if (!spotifyApi.getAccessToken) throw new Error("Not logged in Spotify");

		const trackResult = await spotifyApi.getTrack(trackId);
		if (!trackResult) throw new Error("Wrong track ID");

		return trackResult;
	}
};
