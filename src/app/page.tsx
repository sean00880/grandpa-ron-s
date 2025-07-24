import { Metadata } from 'next'
import ClientHeroWrapper from '../components/ClientHeroWrapper'
import ProfessionalAbout from '../components/ProfessionalAbout'
import ModernServices from '../components/ModernServices'
import ModernTestimonials from '../components/ModernTestimonials'
import Faq from '../components/Faq'
import Contact from '../components/Contact'
import ModernFooter from '../components/ModernFooter'
import { data } from '../data'

export const metadata: Metadata = {
  title: 'Professional Landscaping Services in Canal Winchester, OH | Grandpa Ron\'s Lawn and Landscape',
  description: 'Expert landscaping services in Canal Winchester, Ohio. Mulching, mowing, patios, tree removal, leaf cleanup, and more. Serving Canal Winchester and Columbus area.',
}

export default function HomePage() {
  const services = data;
  
  return (
    <>
      <ClientHeroWrapper />
      <ProfessionalAbout />
      <ModernServices services={services} />
      <ModernTestimonials />
      <Faq />
      <Contact />
      <ModernFooter />
    </>
  )
}