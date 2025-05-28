import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button"

const Popup = ({ setShowPopup, onAddProducts }) => {
  const productsAPIKey = import.meta.env.VITE_API_KEY;
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://stageapi.monkcommerce.app/task/products/search?search=${encodeURIComponent(searchTerm)}&page=0&limit=20`,
          {
            method: 'GET',
            headers: {
              'x-api-key': productsAPIKey,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data); // Assuming API returns array of products
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchTerm, productsAPIKey]);


  const handleProductToggle = (product) => {
    const isSelected = selectedProducts.includes(product.id);

    if (isSelected) {
      setSelectedProducts(prev => prev.filter(id => id !== product.id));
      setSelectedVariants(prev => prev.filter(variantId =>
        !product.variants.some(v => v.id === variantId)
      ));
    } else {
      setSelectedProducts(prev => [...prev, product.id]);
      setSelectedVariants(prev => [
        ...prev,
        ...product.variants
          .filter(v => !prev.includes(v.id))
          .map(v => v.id)
      ]);
    }
  };

  const handleVariantToggle = (variant, productId) => {
    const isSelected = selectedVariants.includes(variant.id);
    let updatedVariants;

    if (isSelected) {
      updatedVariants = selectedVariants.filter(id => id !== variant.id);
    } else {
      updatedVariants = [...selectedVariants, variant.id];
    }

    setSelectedVariants(updatedVariants);

    // Update product selection state
    const product = products.find(p => p.id === productId);
    const allVariantsSelected = product.variants.every(v => updatedVariants.includes(v.id));

    if (allVariantsSelected) {
      setSelectedProducts(prev => [...new Set([...prev, productId])]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };


  const handleAdd = () => {
    const selected = products.filter(p => selectedProducts.includes(p.id)).map(p => (
      {
        ...p,
        variants: p.variants.filter(v => selectedVariants.includes(v.id))
      }
    ));
    onAddProducts(selected);
    setShowPopup(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0003] flex justify-center items-center overflow-hidden">
      <div className='relative flex flex-col justify-start items-start w-full max-w-[700px] bg-white max-h-[90vh]'>

        {/* Header */}
        <div className='flex flex-col justify-start items-start px-8 py-3 w-full border-b border-[#0000001a]'>
          <h1 className='text-[18px] font-medium'>Select Products</h1>
        </div>

        {/* Search */}
        <div className='relative flex flex-col justify-start items-start px-8 py-3 w-full border-b border-[#0000001a]'>
          <input
            type="text"
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-1.5 pl-10 border border-[#0003] rounded focus:outline-none focus:border-[#000] placeholder:text-[#0003] shadow"
          />
          <CiSearch className="absolute left-10 top-1/2 -translate-y-1/2 text-[#0003] h-[20px] w-[20px]" />
        </div>

        {/* Product list */}
        <div className='flex flex-col w-full overflow-y-auto h-[400px] px-0'>
          {loading ? (
            <div className='text-center py-10 w-full'>Loading...</div>
          ) : products.length === 0 ? (
            <div className='text-center py-10 w-full'>No products found.</div>
          ) : (
            products.map(product => (
              <div key={product.id} className='flex flex-col justify-start items-center'>
                <div className='flex flex-row justify-start items-center w-full gap-3 border-b border-[#0003] px-8 py-3'>
                  <input
                    type="checkbox"
                    className="w-[20px] h-[20px] border border-[#008060] rounded accent-[#008060]"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductToggle(product)}
                  />
                  <img src={product.image?.src} alt={product.title} className='w-[50px] h-[50px] object-cover rounded border' />
                  <h4 className='font-normal text-[16px]'>{product.title}</h4>
                </div>

                {product.variants?.map(variant => (
                  <div key={variant.id} className='w-full border-b border-[#0003] flex justify-end'>
                    <div className='w-[90%] flex flex-row justify-between items-center px-8 py-3 gap-3'>
                      <div className='flex flex-row justify-center items-center gap-3'>
                        <input
                          type="checkbox"
                          className="h-[24px] w-[24px] border border-[#008060] rounded accent-[#008060]"
                          checked={selectedVariants.includes(variant.id)}
                          onChange={() => handleVariantToggle(variant, product.id)}
                        />
                        <h4 className='font-normal text-[16px]'>{variant.title}</h4>
                      </div>
                      <h2 className='font-normal text-[16px]'>${variant.price}</h2>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className='bottom-0 left-0 right-0 flex flex-row justify-between items-center px-8 py-3 w-full border-t border-[#0000001a] bg-white'>
          {
            selectedProducts.length > 0 ?
              selectedProducts.length === 1 ? <h1>{selectedProducts.length} product selected</h1> : <h1>{selectedProducts.length} products selected</h1>
              : <h1>No product selected</h1>
          }
          <div className='w-[50%] flex flex-row justify-end items-center gap-3'>
            <Button
              className="text-[#0006] bg-transparent border border-[#0006] font-semibold text-[14px] px-4 py-2 rounded-md cursor-pointer hover:text-[#fff]"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </Button>
            <Button
              className="text-white bg-[#008060] border border-[#008060] font-semibold text-[14px] px-4 py-2 rounded-md cursor-pointer hover:bg-[#006647]"
              onClick={handleAdd}
              disabled={selectedProducts.length === 0}
            >
              Add
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Popup;


