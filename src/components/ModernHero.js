"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagramSquare } from "react-icons/fa";
import { motion } from "framer-motion";

const ModernHero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Main Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 md:p-12 mb-8 hover-lift"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                <span className="gradient-text">Professional</span> Landscaping Services in{" "}
                <span className="text-green-300">Canal Winchester, OH</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-green-100 mb-8"
              >
                Landscaping Services for all needs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/#services">
                  <button className="btn-modern text-lg px-8 py-4">
                    View Our Services
                  </button>
                </Link>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="neumorphism-light p-4 rounded-2xl">
                <Image
                  src="/img/grandpaRon.jpeg"
                  width={500}
                  height={400}
                  alt="Grandpa Ron's Landscaping"
                  className="rounded-xl w-full h-auto"
                  priority
                />
              </div>
              <p className="text-green-200 text-center mt-4 italic">
                Grandpa Ron and Joshua mowing the lawn [2000]
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact & Process Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-dark rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Serving <span className="text-green-300">Canal Winchester</span> & Columbus, Ohio
              </h2>
              <div className="text-2xl md:text-3xl font-bold text-green-300 mb-6 glow">
                (220) 666 2520
              </div>
              
              {/* Social Media */}
              <div className="flex justify-center md:justify-start items-center gap-6 mb-6">
                <span className="text-green-200">Find us online:</span>
                <motion.a 
                  href="https://www.facebook.com/profile.php?id=100088737163765"
                  className="neumorphism-dark p-3 rounded-full text-green-300 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFacebookF size={24} />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/grandparonsllc/"
                  className="neumorphism-dark p-3 rounded-full text-green-300 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagramSquare size={24} />
                </motion.a>
              </div>

              <Link href="/#contact">
                <motion.button 
                  className="btn-modern bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request a Quote
                </motion.button>
              </Link>
            </div>

            {/* Three Steps Process */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Three <span className="gradient-text">Simple Steps</span>:
              </h3>
              
              <div className="space-y-4">
                {[
                  "Contact us with a description of your needs and we will provide a free estimate.",
                  "Schedule physical consultation.",
                  "Initiate contract."
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                    className="neumorphism-inset-dark p-4 rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-green-100">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernHero;