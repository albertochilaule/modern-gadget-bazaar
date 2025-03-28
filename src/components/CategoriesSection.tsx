
import { Laptop, Monitor, Smartphone, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "Laptops",
    icon: <Laptop size={48} />,
    path: "/categoria/laptops"
  },
  {
    id: 2,
    name: "PC Gamers",
    icon: <Monitor size={48} />,
    path: "/categoria/pc-gamers"
  },
  {
    id: 3,
    name: "Celulares",
    icon: <Smartphone size={48} />,
    path: "/categoria/celulares"
  },
  {
    id: 4,
    name: "E Muito Mais",
    icon: <Plus size={48} />,
    path: "/produtos"
  }
];

const CategoriesSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link to={category.path} key={category.id} className="no-underline text-black">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4 text-century-dark">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
