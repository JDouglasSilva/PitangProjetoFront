/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // outras variáveis de ambiente que você adicionar
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  