import { createContext, useState, useEffect, useContext, use } from "react";
import { GetKeranjangByIdPembeli } from "../api/apiKeranjang";

const KeranjangContext = createContext();

export const useKeranjang = () => useContext(KeranjangContext);

export const KeranjangProvider = ({ children }) => {
  const [itemKeranjang, setItemKeranjang] = useState([]);

  const fetchKeranjang = async () => {
    try {
      const response = await GetKeranjangByIdPembeli();
      setItemKeranjang(response.data);
    } catch (error) {
      console.error("Error fetching keranjang:", error);
    }
  }

  useEffect(() => {
    fetchKeranjang();
  }, []);

  return (
    <KeranjangContext.Provider value={{ itemKeranjang, setItemKeranjang, fetchKeranjang }}>
      {children}
    </KeranjangContext.Provider>
  );
};
