
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-century-dark text-white py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-lg font-semibold mb-3">Sobre Nós</h5>
            <p>Century Tech - Sua loja de confiança para produtos tecnológicos.</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-3">Contactos</h5>
            <p>Email: info@centurytech.com</p>
            <p>Tel: +258 84 123 4567</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-3">Redes Sociais</h5>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-century-primary transition-colors">
                <Facebook />
              </a>
              <a href="#" className="text-white hover:text-century-primary transition-colors">
                <Instagram />
              </a>
              <a href="#" className="text-white hover:text-century-primary transition-colors">
                <Twitter />
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4 border-gray-600" />
        <div className="text-center">
          <p className="mb-0">&copy; 2024 Century Tech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
