import "./App.css";
import Hero from "./components/Hero";
import Nav from "./components/Nav";

function App() {
  return (
    <>
      <div className="min-h-screen from-white via-slate-50 to-slate-100 text-slate-900">
        <Nav />
        <main className="container mx-auto px-4 py-12">
          <Hero />
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-lg font-semibold">Real-time Taxi Tracking</h3>
              <p className="mt-2 text-sm text-slate-600">
                Track nearby taxis, estimated arrival, and live fares. Easy
                booking and secure payments.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-lg font-semibold">Bus Schedules</h3>
              <p className="mt-2 text-sm text-slate-600">
                Browse detailed bus timings for major routes, stop-by-stop
                timetables and delays.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-lg font-semibold">Multi-modal Planning</h3>
              <p className="mt-2 text-sm text-slate-600">
                Combine taxi and bus legs to find the fastest route across the
                valley.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
