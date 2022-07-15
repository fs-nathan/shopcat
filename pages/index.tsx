import type { NextPage } from 'next'
import { useEffect } from 'react'
import ProductComponent from '../components/product'

const Home: NextPage = () => {

  useEffect(() => {
    if (window) {
      console.log('This code gets executed on browser');
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)

      window.addEventListener('resize', () => {
        const verticalHeight = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${verticalHeight}px`)
      })
    }
  }, []);

  return (
    <div className='h-[100vh] non-mobile:flex non-mobile:justify-center'>
      <ProductComponent />
    </div>
  )
}

export default Home
