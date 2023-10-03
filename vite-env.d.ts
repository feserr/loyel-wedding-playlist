/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID: string
  readonly VITE_REDIRECT_URI: string
  readonly VITE_BASE_URL: string
  readonly VITE_MAX_SONGS: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
