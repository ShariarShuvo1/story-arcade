import Home from "./Home";
import FAQ from "./FAQ";

function Support() {
  return (
    <div className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-10">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Support Center
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Here, you can manage complaints and find answers to common
            questions.
          </p>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-10">
          <Home />
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <FAQ />
        </div>
      </div>
    </div>
  );
}

export default Support;
