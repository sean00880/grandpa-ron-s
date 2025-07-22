import { Metadata } from 'next'
import Intro from '../components/Intro'
import Mission from '../components/Mission'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Contact from '../components/Contact'
import { data } from '../data'

export const metadata: Metadata = {
  title: 'Professional Landscaping Services in Canal Winchester, OH | Grandpa Ron\'s Lawn and Landscape',
  description: 'Expert landscaping services in Canal Winchester, Ohio. Mulching, mowing, patios, tree removal, leaf cleanup, and more. Serving Canal Winchester and Columbus area.',
}

export default function HomePage() {
  const services = data;
  
  return (
    <>
      <Intro />
      <Mission />
      <Services services={services} />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  )
}