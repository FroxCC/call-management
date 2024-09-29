import Link from "next/link";
import { UserButton } from "@clerk/nextjs"; // Importar UserButton para manejar el logout y el perfil del usuario

export const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold mr-4">Call Interface</h1>
        </Link>

        <div className="mr-4 flex items-end">
          <span className="font-semibold mr-2 pr-2">Customer Info:</span>
          John Doe
          <div className="relative pr-3 ml-2">
          25
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          234567890
        </div>
        <Link href="/reports">
          <button className="px-4 py-2 bg-green-500 text-white rounded-full mr-4">
            Ver Reportes
          </button>
        </Link>
      </div>
      
      <div className="flex items-center">
        <Link href="/addaudio">
          <button className="px-4 py-2 bg-green-500 text-white rounded-full mr-4">
            Add New Audio Clip
          </button>
        </Link>
        
        {/* Botón para cerrar sesión o acceder a la cuenta */}
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
};
