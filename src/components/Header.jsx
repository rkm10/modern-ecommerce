import React from 'react'
import logo  from '../assets/logo.png'

const Header = () => {
  return (
    <div className='flex flex-col'>
        <div className='flex start items-center border booder-b-2 border-[#D1D1D1] py-5 px-10 w-full mx-auto'>
            <img src={logo} alt="" />
            <h1 className='text-[16px] font-semibold text-[#7E8185] ml-2'>Monk Upsell & Cross-sell</h1>
        </div>
      
    </div>
  )
}

export default Header
