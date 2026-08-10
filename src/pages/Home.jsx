function Home() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center space-y-6">
            <h1 className="text-4xl font-bold text-primary-700">Cantina IF - Sistema de Pedidos</h1>
            <p className="text-gray-600">Demonstração dos Design Tokens com as cores do Instituto Federal:</p>
            <div className="flex gap-4">
                <button className="px-6 py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 shadow-md transition-all">
                    Botão Verde (Primary / IF Green)
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-accent-500 text-white font-medium hover:bg-accent-600 shadow-md transition-all">
                    Botão Vermelho (Accent / IF Red)
                </button>
            </div>
        </div>
    );
}

export default Home;