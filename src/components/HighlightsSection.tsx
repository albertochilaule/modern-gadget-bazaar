
import { RefreshCw, Truck } from 'lucide-react';

const HighlightsSection = () => {
  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw size={40} className="text-century-primary" />
            </div>
            <h5 className="font-semibold text-lg">GARANTIA DE DEVOLUÇÃO DE DINHEIRO</h5>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Truck size={40} className="text-century-primary" />
            </div>
            <h5 className="font-semibold text-lg">ENTREGAS GRATUITAS NA REGIÃO DE MAPUTO</h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
