import React from "react";
import { Clock, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 text-gray-500 text-sm mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="space-y-1">
            <p className="font-medium text-gray-700">
              Cantina <span className="text-primary-600 font-semibold">IFRS</span>
            </p>
            <p className="text-xs text-gray-400">
              © {currentYear} Cantina do Campus. Instituto Federal de Educação, Ciência e Tecnologia.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Clock className="w-3.5 h-3.5 text-primary-600" />
              <span>Seg a Sex: 07h30 às 21h30</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-accent-500" />
              <span>Prédio Central - Convivência</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
