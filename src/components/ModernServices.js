"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";

const ModernServices = ({ services }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '🌿' },
    { id: 'lawn', name: 'Lawn Care', icon: '🌱' },
    { id: 'landscape', name: 'Landscaping', icon: '🌳' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
    { id: 'seasonal', name: 'Seasonal', icon: '❄️' }
  ];

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(service => service.category === activeFilter);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-emerald-900"
      id="services"
    >
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ultra-Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-20"
          style={{ y, opacity }}
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-lg border border-emerald-500/30 rounded-full px-6 py-3 mb-8"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-emerald-400 text-lg"
            >
              🏆
            </motion.span>
            <span className="text-emerald-300 font-heading font-semibold">Premium Landscaping Services</span>
          </motion.div>

          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-thin text-white leading-[0.9] tracking-tight mb-8"
            style={{
              textShadow: '0 0 40px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)',
              transformStyle: 'preserve-3d'
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 40px rgba(16, 185, 129, 0.6)',
                  '0 0 60px rgba(16, 185, 129, 0.9)',
                  '0 0 40px rgba(16, 185, 129, 0.6)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Our
            </motion.span>
            <br />
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Services
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl sm:text-2xl text-white/90 font-sans font-light leading-relaxed max-w-3xl mx-auto mb-12"
            style={{ textShadow: '0 3px 15px rgba(0, 0, 0, 0.9)' }}
          >
            Professional landscaping solutions that transform your outdoor space into a
            <motion.span
              className="text-emerald-400 font-medium"
              animate={{
                textShadow: [
                  '0 0 15px rgba(16, 185, 129, 0.6)',
                  '0 0 25px rgba(16, 185, 129, 0.9)',
                  '0 0 15px rgba(16, 185, 129, 0.6)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {' '}masterpiece of natural beauty
            </motion.span>
          </motion.p>

          {/* Enhanced Decorative Line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Enhanced Service Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {serviceCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-2xl font-heading font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 backdrop-blur-lg'
                  : 'bg-black/40 text-white/70 border border-white/20 backdrop-blur-lg hover:bg-emerald-500/20 hover:text-emerald-300'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Ultra-Enhanced Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredService(service.id)}
              onHoverEnd={() => setHoveredService(null)}
              className="group relative transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link href={`/services/${service.name}`}>
                <motion.div
                  className="relative overflow-hidden rounded-3xl h-96 cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    rotateY: 5,
                    z: 50
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Ultra-Enhanced Background Card */}
                  <div
                    className="absolute inset-0 rounded-3xl transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4), rgba(16, 185, 129, 0.1))',
                      backdropFilter: 'blur(25px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {/* Service Icon/Image */}
                    <div className="absolute top-8 left-8 right-8 h-32 flex items-center justify-center">
                      <motion.div
                        className="p-6 rounded-2xl transition-all duration-500"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                        whileHover={{ scale: 1.1, rotateY: 10 }}
                      >
                        <Image
                          src={`/img/${service.desc}`}
                          width={80}
                          height={80}
                          alt={service.title || 'Service icon'}
                          className="w-full h-full object-contain filter brightness-110"
                        />
                      </motion.div>
                    </div>

                    {/* Service Title */}
                    <div className="absolute top-48 left-8 right-8">
                      <motion.h3
                        className="text-xl font-heading font-semibold text-white text-center mb-4 transition-all duration-300"
                        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}
                        whileHover={{
                          textShadow: '0 0 20px rgba(16, 185, 129, 0.8)',
                          scale: 1.05
                        }}
                      >
                        {service.title}
                      </motion.h3>
                    </div>

                    {/* Enhanced Hover Image */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl overflow-hidden"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{
                        opacity: hoveredService === service.id ? 1 : 0,
                        scale: hoveredService === service.id ? 1 : 1.1
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <Image
                        src={`/img/${service.photo}`}
                        width={400}
                        height={384}
                        alt={service.title || 'Service photo'}
                        className="w-full h-full object-cover"
                      />
                      {/* Enhanced Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      {/* Enhanced Hover Content */}
                      <motion.div
                        className="absolute bottom-8 left-8 right-8 text-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: hoveredService === service.id ? 0 : 20,
                          opacity: hoveredService === service.id ? 1 : 0
                        }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-2xl font-heading font-bold mb-3" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
                          {service.title}
                        </h3>
                        <motion.p
                          className="text-emerald-300 font-semibold flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          View Details
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </motion.p>
                      </motion.div>
                    </motion.div>

                    {/* Enhanced Floating Elements */}
                    <motion.div
                      className="absolute top-6 right-6 w-4 h-4 bg-emerald-400 rounded-full"
                      animate={{
                        scale: hoveredService === service.id ? [1, 1.5, 1] : [1, 1.2, 1],
                        opacity: hoveredService === service.id ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <motion.div
                      className="absolute bottom-6 left-6 w-3 h-3 bg-green-300 rounded-full"
                      animate={{
                        scale: hoveredService === service.id ? [1, 1.4, 1] : [1, 1.1, 1],
                        opacity: hoveredService === service.id ? [0.4, 0.9, 0.4] : [0.2, 0.5, 0.2]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    />

                    {/* Service Badge */}
                    <motion.div
                      className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.2))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#10b981'
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      Premium
                    </motion.div>
                  </div>

                  {/* Ultra-Enhanced Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{
                      boxShadow: hoveredService === service.id
                        ? "0 0 50px rgba(16, 185, 129, 0.4), 0 0 100px rgba(16, 185, 129, 0.2)"
                        : "0 0 0px rgba(16, 185, 129, 0)"
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Ultra-Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            className="max-w-4xl mx-auto p-12 rounded-3xl transform-gpu"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(16, 185, 129, 0.1))',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 50px rgba(16, 185, 129, 0.1)',
              transformStyle: 'preserve-3d'
            }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
          >
            <motion.h3
              className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6"
              style={{ textShadow: '0 0 30px rgba(16, 185, 129, 0.6)' }}
            >
              Ready to Transform Your Landscape?
            </motion.h3>
            <motion.p
              className="text-xl text-white/90 font-sans font-light leading-relaxed mb-8 max-w-2xl mx-auto"
              style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}
            >
              Get a personalized consultation and discover how we can create your dream outdoor space in Canal Winchester, Ohio
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/#contact">
                <motion.button
                  className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl font-heading font-semibold text-lg shadow-2xl cursor-pointer relative overflow-hidden group transform-gpu"
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"
                    initial={{ x: "-200%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      📞
                    </motion.span>
                    Get Free Consultation
                  </span>
                </motion.button>
              </Link>

              <motion.div
                className="flex items-center gap-2 text-emerald-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">⭐</span>
                <span className="font-heading font-semibold">500+ Happy Clients</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernServices;