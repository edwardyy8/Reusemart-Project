import { createContext, useState, useEffect, useContext, use } from "react";
import { GetKeranjangByIdPembeli } from "../api/apiKeranjang";

const KeranjangContext = createContext();

export const useKeranjang = () => useContext(KeranjangContext);

export const KeranjangProvider = ({ children }) => {
  const [itemKeranjang, setItemKeranjang] = useState([]);
  const [totalHargaBarang, setTotalHargaBarang] = useState(0);
  const [itemKeranjangChecked, setItemKeranjangChecked] = useState([]);
  const [itemHabis, setItemHabis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKeranjang = async () => {
    try {
      setIsLoading(true);
      const response = await GetKeranjangByIdPembeli();
      setItemKeranjang(response.data);
      setItemKeranjangChecked(response.keranjang_checked);
      setTotalHargaBarang(response.total_harga_barang);
      setItemHabis(response.stok_habis);
    } catch (error) {
      console.error("Error fetching keranjang:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchKeranjang();
  }, []);

  return (
    <KeranjangContext.Provider value={{ 
      itemKeranjang, setItemKeranjang, fetchKeranjang, 
      totalHargaBarang, setTotalHargaBarang, itemKeranjangChecked, setItemKeranjangChecked,
      itemHabis, setItemHabis 
    }}>
      {children}
    </KeranjangContext.Provider>
  );
};
