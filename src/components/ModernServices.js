"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const ModernServices = ({ services }) => {
  const [hoveredService, setHoveredService] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white" id="services">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredService(service.id)}
              onHoverEnd={() => setHoveredService(null)}
              className="group relative"
            >
              <Link href={`/services/${service.name}`}>
                <div className="relative overflow-hidden rounded-3xl h-80 cursor-pointer">
                  {/* Background Card */}
                  <div className="absolute inset-0 glass rounded-3xl transition-all duration-500 group-hover:bg-white/20 group-hover:scale-105">
                    {/* Service Icon/Image */}
                    <div className="absolute top-6 left-6 right-6 h-32 flex items-center justify-center">
                      <div className="neumorphism-light p-4 rounded-2xl transition-all duration-500 group-hover:scale-110">
                        <Image
                          src={`/img/${service.desc}`}
                          width={80}
                          height={80}
                          alt={service.title || 'Service icon'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Service Title */}
                    <div className="absolute top-44 left-6 right-6">
                      <h3 className="text-xl font-bold text-gray-800 text-center mb-4 transition-all duration-300 group-hover:text-green-700">
                        {service.title}
                      </h3>
                    </div>

                    {/* Hover Image */}
                    <motion.div 
                      className="absolute inset-0 rounded-3xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredService === service.id ? 1 : 0,
                        scale: hoveredService === service.id ? 1 : 1.1
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={`/img/${service.photo}`}
                        width={400}
                        height={320}
                        alt={service.title || 'Service photo'}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      {/* Hover Content */}
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                        <p className="text-green-300 font-semibold">View Details →</p>
                      </div>
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
                      animate={{
                        scale: hoveredService === service.id ? [1, 1.5, 1] : 1,
                        opacity: hoveredService === service.id ? [0.5, 1, 0.5] : 0.5
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <motion.div
                      className="absolute bottom-4 left-4 w-2 h-2 bg-green-300 rounded-full"
                      animate={{
                        scale: hoveredService === service.id ? [1, 1.3, 1] : 1,
                        opacity: hoveredService === service.id ? [0.3, 0.8, 0.3] : 0.3
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    />
                  </div>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    animate={{
                      boxShadow: hoveredService === service.id 
                        ? "0 0 30px rgba(34, 197, 94, 0.3)" 
                        : "0 0 0px rgba(34, 197, 94, 0)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 mb-6">
              We offer personalized landscaping services tailored to your specific needs in Canal Winchester and surrounding areas.
            </p>
            <Link href="/#contact">
              <motion.button 
                className="btn-modern px-8 py-4 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Custom Quote
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernServices;