import React from 'react'
import AddProductsDesktop from './AddProductsDesktop'

const Products = () => {
  return (
    <div className='flex flex-col items-start justify-start w-full max-w-[1024px] mx-auto my-[67px] px-10'>
      <div className='w-full px-4 pb-10'>
        <h1 className='text-[#202223] font-semibold  text-[16px]'>Add Products</h1>
      </div>
      <div className='hidden md:block'>
        <AddProductsDesktop />
      </div>
      <div className='block md:hidden'>
        <h1>Add Products Mobile</h1>
      </div>
    </div>
  )
}

export default Products
