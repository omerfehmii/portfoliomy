/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Umami website id. Unset = the collector is never injected and nothing is sent. */
  readonly VITE_UMAMI_ID?: string
  /** Collector URL. Defaults to Umami Cloud; set it when self-hosting. */
  readonly VITE_UMAMI_SRC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
