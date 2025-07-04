import facebook_icon from '../assets/facebook_icon.svg'
import twitter_icon from '../assets/twitter_icon.svg'
import instagram_icon from '../assets/instagram_icon.svg'
import bulb from '../assets/bulb.png'
const Footer = () => {
  return (
    <div className='w-full min-h-12 border-t border-gray-400'>
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left px-4'>
      {/* left */}
      <div className='flex items-center gap-2'>
        <img className='hidden md:block w-7 border rounded-full border-gray-400 '
          src={bulb} alt="" />
        <div className='hidden md:block h-9 w-px bg-gray-500/60'></div>
        <p className='py-4 text-center text-xs md:text-sm text-gray-500'>
          Copyright 2025 © Agnik Mukherjee. | All Rights Reserved.
        </p>
      </div>
      {/* right */}
      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#"><img src={facebook_icon} alt="" className='w-6'/> </a>
        <a href="#"><img src={twitter_icon} alt="" className='w-6'/> </a>
        <a href="#"><img src={instagram_icon} alt="" className='w-6'/> </a>
      </div>
    </footer>
    </div>

  )
}

export default Footer