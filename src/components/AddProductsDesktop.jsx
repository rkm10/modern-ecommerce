import React, { useState } from 'react';
import { RxDragHandleDots2 } from 'react-icons/rx';
// import SearchPopup from './SearchPopup';
import Popup from './Popup';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MdModeEdit } from 'react-icons/md';
import { IoIosClose } from 'react-icons/io';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const AddProductsDesktop = () => {
    const [count, setCount] = useState(1);
    const [showDiscounts, setShowDiscounts] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProductsArray, setSelectedProductsArray] = useState([null]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showVarients, setShowVarients] = useState(false);
    const [dragProductIndex, setDragProductIndex] = useState(null);
    const [draggingVariant, setDraggingVariant] = useState({
        productIndex: null,
        variantIndex: null,
    });

    const increaseCount = () => {
        setCount(prev => prev + 1);
        setSelectedProductsArray(prev => [...prev, null]);
    };

    const decreaseCount = index => {
        if (count > 1) {
            setCount(prev => prev - 1);
            setSelectedProductsArray(prev => {
                const updated = [...prev];
                updated.splice(index, 1);
                return updated;
            });
            setShowDiscounts(prev => {
                const updated = { ...prev };
                delete updated[index];
                return updated;
            });
        }
    };

    const handleAddProducts = products => {
        setSelectedProductsArray(prev => {
            const updated = [...prev];
            updated.splice(editingIndex, 1, ...products);
            return updated;
        });
        setCount(prev => prev - 1 + products.length);
        setShowPopup(false);
    };

    const handleDeleteVariant = (productIndex, variantId) => {
        setSelectedProductsArray(prev => {
            const updated = [...prev];
            const product = updated[productIndex];
            if (!product || !product.variants) return prev;

            const filteredVariants = product.variants.filter(
                variant => variant.id !== variantId
            );

            updated[productIndex] = {
                ...product,
                variants: filteredVariants,
            };

            return updated;
        });
    };

    const handleProductsDragDrop = index => {
        if (dragProductIndex !== null && dragProductIndex !== index) {
            setSelectedProductsArray(prev => {
                const updated = [...prev];
                const [draggedItem] = updated.splice(dragProductIndex, 1);
                updated.splice(index, 0, draggedItem);
                return updated;
            });
            setDragProductIndex(null);
        }
    };

    const handleVariantDrop = (productIndex, dropIndex) => {
        const { productIndex: dragProductIndex, variantIndex: dragVariantIndex } =
            draggingVariant;

        if (dragVariantIndex === null || dragProductIndex !== productIndex) return;

        setSelectedProductsArray(prev => {
            const updated = [...prev];
            const product = updated[productIndex];
            if (!product || !product.variants) return prev;

            const reorderedVariants = [...product.variants];
            const [dragged] = reorderedVariants.splice(dragVariantIndex, 1);
            reorderedVariants.splice(dropIndex, 0, dragged);

            updated[productIndex] = {
                ...product,
                variants: reorderedVariants,
            };

            return updated;
        });

        setDraggingVariant({ productIndex: null, variantIndex: null });
    };

    return (
        <>
            <div className="relative">
                <div className="flex flex-col justify-center items-start gap-6">
                    {[...Array(count)].map((_, index) => (
                        <div
                            key={index}
                            style={{ opacity: dragProductIndex === index ? 0.5 : 1 }}
                            className="flex flex-col justify-center items-start max-w-[700px] gap-2 cursor-grab active:cursor-grabbing"
                            draggable={draggingVariant.productIndex === null}
                            onDragStart={() => {
                                if (draggingVariant.productIndex === null) {
                                    setDragProductIndex(index);
                                }
                            }}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => handleProductsDragDrop(index)}
                            onDragEnd={() => setDragProductIndex(null)}
                        >
                            <div className="flex flex-row justify-center items-center w-full">
                                <div>
                                    <RxDragHandleDots2 />
                                </div>
                                <div className="ml-2">{index + 1}.</div>

                                <div className="relative w-full flex flex-row justify-center items-center pt-2 pb-2 ml-2">
                                    <Button
                                        variant="ghost"
                                        className="absolute right-3 text-[#0003] h-[20px] w-[20px] cursor-pointer"
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setShowPopup(true);
                                        }}
                                    >
                                        <MdModeEdit />
                                    </Button>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedProductsArray[index]?.title || ''}
                                        placeholder="Select Product"
                                        className="w-full p-1.5 border border-[#0003] rounded focus:outline-none focus:border-[#000] placeholder:text-[#0003] shadow"
                                    />
                                </div>

                                <div className="ml-2">
                                    {!showDiscounts[index] ? (
                                        <Button
                                            className="bg-[#008060] text-[#F5F5F5] font-semibold text-[14px] px-4 py-2 rounded-md"
                                            onClick={() =>
                                                setShowDiscounts(prev => ({ ...prev, [index]: true }))
                                            }
                                        >
                                            Add Discount
                                        </Button>
                                    ) : (
                                        <div className="flex flex-row items-center gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Discount"
                                                className="p-2 w-[100px]"
                                            />
                                            <Select>
                                                <SelectTrigger className="w-[100px]">
                                                    <SelectValue placeholder="" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="% off">% off</SelectItem>
                                                    <SelectItem value="Flat off">Flat off</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>

                                {count > 1 && (
                                    <Button variant="ghost" onClick={() => decreaseCount(index)}>
                                        <IoIosClose className="text-[#0003]" />
                                    </Button>
                                )}
                            </div>

                            {selectedProductsArray[index]?.variants?.length > 1 && (
                                <div className="flex flex-col justify-end items-end text-sm text-gray-600 w-full gap-2">
                                    {showVarients ? (
                                        <>
                                            <div className="flex justify-end w-full">
                                                <a
                                                    className="flex flex-row items-center gap-1 text-sm text-blue-600 underline cursor-pointer"
                                                    onClick={() => setShowVarients(false)}
                                                >
                                                    Hide Variants <FaAngleUp />
                                                </a>
                                            </div>
                                            {selectedProductsArray[index].variants.map((variant, i) => (
                                                <div
                                                    key={variant.id}
                                                    style={{
                                                        opacity:
                                                            draggingVariant.productIndex === index &&
                                                                draggingVariant.variantIndex === i
                                                                ? 1
                                                                : 1,
                                                    }}
                                                    className="flex flex-row items-center w-[80%] gap-2 cursor-grab active:cursor-grabbing"
                                                    draggable
                                                    onDragStart={e => {
                                                        e.stopPropagation();
                                                        setDraggingVariant({
                                                            productIndex: index,
                                                            variantIndex: i,
                                                        });
                                                    }}
                                                    onDragOver={e => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    onDrop={e => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleVariantDrop(index, i);
                                                    }}
                                                >
                                                    <div>
                                                        <RxDragHandleDots2 />
                                                    </div>
                                                    <div className="ml-2">{i + 1}.</div>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={variant.title}
                                                        className="w-full p-1.5 border border-[#0003] rounded focus:outline-none focus:border-[#000] placeholder:text-[#0003] shadow cursor-grab active:cursor-grabbing"
                                                    />
                                                    <div className="flex flex-row gap-2">
                                                        <Input
                                                            type="text"
                                                            placeholder="Discount"
                                                            className="p-2 w-[100px]"
                                                        />
                                                        <Select>
                                                            <SelectTrigger className="w-[100px]">
                                                                <SelectValue placeholder="" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="% off">% off</SelectItem>
                                                                <SelectItem value="Flat off">Flat off</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleDeleteVariant(index, variant.id)
                                                        }
                                                    >
                                                        <IoIosClose className="text-[#0003]" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="flex justify-end w-full">
                                            <a
                                                className="flex flex-row items-center gap-1 text-sm text-blue-600 underline cursor-pointer"
                                                onClick={() => setShowVarients(true)}
                                            >
                                                Show Variants <FaAngleDown />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="w-full flex flex-row justify-end">
                        <Button
                            className="text-[#008060] bg-transparent border border-[#008060] font-semibold text-[14px] px-4 py-2 rounded-md mt-4 hover:bg-[#008060] hover:text-[#fff]"
                            onClick={increaseCount}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <Popup
                    id="searchpopup"
                    setShowPopup={setShowPopup}
                    onAddProducts={handleAddProducts}
                />
            )}
        </>
    );
};

export default AddProductsDesktop;
