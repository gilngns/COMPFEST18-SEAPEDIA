
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../lib/api";
import { getImageUrl } from "../../utils/image";
import SellerLayout from "../../components/seller/SellerLayout";
import { useSeller } from "../../hooks/usecases/useSeller";
import ProductModal from "../../components/seller/ProductModal";
import { Plus, Pencil, Power, PackageOpen, ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function rupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export default function SellerProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("Toko Saya");
  const [storeLogo, setStoreLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { listMyProducts, getMyStore, updateProduct, deleteProduct } = useSeller();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prodData, storeData] = await Promise.all([
        listMyProducts(),
        getMyStore(),
      ]);
      setProducts(prodData || []);
      if (storeData) {
        setStoreName(storeData.name);
        setStoreLogo(storeData.logoUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [listMyProducts, getMyStore]);

  useEffect(() => {
    load();
    
    if (searchParams.get("new") === "1") {
      setEditing(null);
      setModalOpen(true);
      setSearchParams({});
    }
  }, [load, searchParams, setSearchParams]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setModalOpen(true);
  }

  
  async function toggleActive(product) {
    try {
      if (product.isActive) {
        
        await deleteProduct(product.id);
      } else {
        
        await updateProduct(product.id, { isActive: true });
      }
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Produk berhasil di${product.isActive ? "nonaktifkan" : "aktifkan"}`,
        timer: 1500,
        showConfirmButton: false,
      });
      load();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || err.message || "Gagal mengubah status",
      });
    }
  }

  if (loading) {
    return (
      <SellerLayout storeName={storeName} storeLogo={storeLogo}>
        <div className="flex items-center justify-center h-64 text-gray-500 font-medium">Memuat data produk...</div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout storeName={storeName} storeLogo={storeLogo}>
      {}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Manajemen Produk</h2>
          <p className="text-gray-500 text-[15px]">
            Kelola inventaris, harga, dan ketersediaan stok laut Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A]"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#ff8c00] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#e67e00] transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Produk
          </button>
        </div>
      </div>

      {}
      <div className="w-full flex-1 flex flex-col">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden p-8 text-center text-gray-400 shadow-sm">
             Memuat...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden p-12 text-center shadow-sm">
            <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada produk. Tambah produk pertamamu!</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-[#006B7A]">
                    <tr className="text-white text-[12px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-5 border-b-0">Produk</th>
                      <th className="py-4 px-5 w-[20%] border-b-0">Harga</th>
                      <th className="py-4 px-5 w-[15%] border-b-0">Stok</th>
                      <th className="py-4 px-5 w-[12%] text-center border-b-0">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {p.images && p.images.length > 0 ? (
                                <img src={getImageUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <PackageOpen className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h4 className="font-bold text-gray-900 text-[16px]">{p.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {p.stock > 10 ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-700">Tersedia</span>
                                ) : p.stock > 0 ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-100 text-orange-700">Stok Menipis</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-700">Habis Terjual</span>
                                )}
                                <span className="text-[13px] text-gray-500 line-clamp-1 max-w-xs">{p.description || "Tidak ada deskripsi"}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-bold text-[#006B7A] text-[15px]">{rupiah(p.price)}</span>
                          <span className="text-gray-500 text-[13px]"> / {p.unit || 'pcs'}</span>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`text-[14px] ${p.stock === 0 ? 'text-red-500 font-medium' : p.stock <= 10 ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                            {p.stock} {p.unit || 'pcs'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => openEdit(p)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => toggleActive(p)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {}
            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-6 border-t border-gray-200">
                <p className="text-[13px] text-gray-500">
                  Menampilkan <span className="font-medium text-gray-900">{currentProducts.length}</span> dari <span className="font-medium text-gray-900">{products.length}</span> produk
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded text-[13px] font-medium transition-colors ${
                          currentPage === i + 1 
                            ? 'bg-[#006B7A] text-white border border-[#006B7A]' 
                            : 'text-gray-600 border border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {}
      {modalOpen && (
        <ProductModal
          product={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </SellerLayout>
  );
}