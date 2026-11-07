import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Garganta del Diablo — Iguazú Experience',description:'Viví Iguazú antes de llegar. Exploración tridimensional independiente de Garganta del Diablo, con recorrido accesible y sonido ambiental opcional.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body>{children}</body></html>}
