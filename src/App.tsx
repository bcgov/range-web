function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Range Management v2</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Welcome</h2>
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-4">This is the v2 rewrite of the Range Management application.</p>
            <p className="text-gray-600">Technologies: React 18, TypeScript, Vite, tRPC, TanStack Query, TailwindCSS</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
