
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { HowItWorks } from "@/components/HowItWorks";
import { ToolsSection } from "@/components/ToolsSection";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";
import Link from "next/link";

const ReviewsSection = () => {
  return (
    <section className="py-32 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 md:px-8">
        <GoogleReviewsWidget maxReviews={6} showHeader={true} />
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section id="contact" className="py-32 bg-green-900 dark:bg-green-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500 rounded-full filter blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600 rounded-full filter blur-[100px] opacity-10 -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
        <h2 className="font-heading font-normal text-5xl md:text-7xl mb-8 tracking-tight">Ready to transform your property?</h2>
        <p className="font-subheading text-green-100 text-xl max-w-2xl mx-auto mb-12 italic leading-relaxed">
          Contact us with a description of your needs and we will provide a free estimate. Quality work that lasts generations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/quote" className="bg-white text-green-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:-translate-y-1 hover:scale-105">
            Request a Quote
          </Link>
          <a href="tel:2206662520" className="bg-green-700 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] transform hover:-translate-y-1 hover:scale-105">
            Call (220) 666-2520
          </a>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <main>
        <Hero />
        <Services />
        <Gallery />
        <HowItWorks />
        <ToolsSection />
        <ReviewsSection />
        <CtaSection />
      </main>
    </div>
  );
}
