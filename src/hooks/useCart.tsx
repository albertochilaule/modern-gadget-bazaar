
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getShippingFee: () => number;
  userLocation: {
    province: string;
    isMaputo: boolean;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  isLoadingLocation: boolean;
  locationError: string | null;
  refreshLocation: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // User location state
  const [userLocation, setUserLocation] = useState<{
    province: string;
    isMaputo: boolean;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    }
  }>({
    province: 'Desconhecida',
    isMaputo: false,
    coordinates: {
      latitude: null,
      longitude: null
    }
  });

  const addToCart = (product: Product) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Product already exists in cart, you could update quantity here
      // For now, we'll just show a notification via console
      console.log('Produto já está no carrinho!');
      return;
    }
    
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId: number | string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Convert price to number if it's a string
      const itemPrice = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.-]/g, '')) 
        : item.price;
      return total + itemPrice;
    }, 0);
  };
  
  // Function to detect Maputo coordinates (approximate)
  const isInMaputo = (latitude: number, longitude: number): boolean => {
    // Maputo approximate coordinates boundaries
    const maputoLatRange = [25.8, 26.1]; // North to South
    const maputoLonRange = [32.5, 32.7]; // West to East
    
    return (
      latitude >= maputoLatRange[0] && 
      latitude <= maputoLatRange[1] && 
      longitude >= maputoLonRange[0] && 
      longitude <= maputoLonRange[1]
    );
  };
  
  // Function to determine province from coordinates
  const getProvinceFromCoordinates = (latitude: number, longitude: number): string => {
    // This is a simplified version. A real implementation would use more precise polygon data
    // These are very approximate provincial boundaries
    if (isInMaputo(latitude, longitude)) return "Maputo";
    if (latitude >= 24.5 && latitude <= 27.0 && longitude >= 31.0 && longitude <= 33.0) return "Gaza";
    if (latitude >= 21.5 && latitude <= 25.0 && longitude >= 33.0 && longitude <= 36.0) return "Inhambane";
    if (latitude >= 19.0 && latitude <= 22.0 && longitude >= 33.0 && longitude <= 35.5) return "Sofala";
    if (latitude >= 16.5 && latitude <= 19.5 && longitude >= 33.0 && longitude <= 37.0) return "Manica";
    if (latitude >= 15.0 && latitude <= 19.0 && longitude >= 35.0 && longitude <= 39.0) return "Tete";
    if (latitude >= 13.5 && latitude <= 17.0 && longitude >= 35.5 && longitude <= 38.5) return "Zambézia";
    if (latitude >= 13.0 && latitude <= 16.0 && longitude >= 38.0 && longitude <= 41.0) return "Nampula";
    if (latitude >= 11.5 && latitude <= 14.5 && longitude >= 37.0 && longitude <= 41.0) return "Cabo Delgado";
    if (latitude >= 10.5 && latitude <= 13.5 && longitude >= 35.0 && longitude <= 38.5) return "Niassa";
    
    return "Desconhecida";
  };
  
  // Get shipping fee based on location
  const getShippingFee = (): number => {
    return userLocation.isMaputo ? 0 : 1000;
  };

  // Function to get user's location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("A geolocalização não é suportada pelo seu navegador");
      setIsLoadingLocation(false);
      toast({
        title: "Erro de localização",
        description: "A geolocalização não é suportada pelo seu navegador",
        variant: "destructive",
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const province = getProvinceFromCoordinates(latitude, longitude);
        const isMaputo = province === "Maputo";
        
        setUserLocation({
          province,
          isMaputo,
          coordinates: { latitude, longitude }
        });
        
        setIsLoadingLocation(false);
        
        toast({
          title: "Localização detectada",
          description: `Localização: ${province}${isMaputo ? " - Frete grátis!" : ""}`,
          variant: isMaputo ? "success" : "default",
        });
      },
      (error) => {
        let errorMsg = "Erro desconhecido ao obter localização";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Permissão de localização negada pelo usuário";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Informação de localização indisponível";
            break;
          case error.TIMEOUT:
            errorMsg = "Tempo esgotado ao obter localização";
            break;
        }
        
        setLocationError(errorMsg);
        setIsLoadingLocation(false);
        
        toast({
          title: "Erro de localização",
          description: errorMsg,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  // Function to manually refresh location
  const refreshLocation = () => {
    getUserLocation();
  };
  
  // Get location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getShippingFee,
      userLocation,
      isLoadingLocation,
      locationError,
      refreshLocation
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
