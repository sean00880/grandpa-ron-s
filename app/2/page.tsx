import LawncareHero from '@/components/premium/lawncare-hero'
import LawncareServices from '@/components/premium/lawncare-services'
import LawncareHowItWorks from '@/components/premium/lawncare-how-it-works'
import LawncareTestimonials from '@/components/premium/lawncare-testimonials'
import LawncareStats from '@/components/premium/lawncare-stats'
import LawncareCTA from '@/components/premium/lawncare-cta'
import { ToolsSection } from '@/components/ToolsSection'
import { GoogleReviewsWidget } from '@/components/GoogleReviewsWidget'

export const metadata = {
    title: "Grandpa Ron's Landscaping | Professional Lawn Care in Central Ohio",
    description: 'Family-owned landscaping company serving 24 cities in Central Ohio since 1985. Professional lawn mowing, landscaping, tree removal, and more.',
}

const ReviewsSection = () => {
    return (
        <section className="py-32 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-4 md:px-8">
                <GoogleReviewsWidget maxReviews={6} showHeader={true} />
            </div>
        </section>
    )
}

export default function PremiumLandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <LawncareHero />
            <LawncareServices />
            <LawncareHowItWorks />
            <ToolsSection />
            <LawncareStats />
            <LawncareTestimonials />
            <ReviewsSection />
            <LawncareCTA />
        </div>
    )
}
