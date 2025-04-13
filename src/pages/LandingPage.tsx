
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calculator, 
  FileText, 
  Download, 
  Mail, 
  Settings, 
  Ruler, 
  Columns 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const goToQuotationBuilder = () => {
    navigate('/quotation-builder');
  };
  
  const goToQuotations = () => {
    navigate('/quotations');
  };
  
  const goToLogin = () => {
    navigate('/login');
  };
  
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const featureItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header/Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-alu-primary">
                TheAluVision
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-alu-primary dark:hover:text-alu-primary font-medium">
                Home
              </a>
              <a href="#features" className="text-gray-700 dark:text-gray-200 hover:text-alu-primary dark:hover:text-alu-primary font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-200 hover:text-alu-primary dark:hover:text-alu-primary font-medium">
                How It Works
              </a>
              <Button onClick={goToQuotations} variant="outline">
                View Quotations
              </Button>
              <Button 
                onClick={goToQuotationBuilder}
                className="bg-alu-primary hover:bg-alu-primary/90 text-white"
              >
                Create Quotation
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Home
              </a>
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                How It Works
              </a>
              <Button 
                onClick={goToQuotations} 
                variant="outline"
                className="w-full justify-start"
              >
                View Quotations
              </Button>
              <Button 
                onClick={goToQuotationBuilder}
                className="w-full justify-start bg-alu-primary hover:bg-alu-primary/90 text-white"
              >
                Create Quotation
              </Button>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
                Quick and Accurate Quotes for <span className="text-alu-primary">Aluminum Windows & Glass</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Easily create custom quotations based on size, quantity, and material. Perfect for contractors, suppliers, and homeowners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={goToQuotationBuilder}
                  size="lg"
                  className="bg-alu-primary hover:bg-alu-primary/90 text-white"
                >
                  Create Your Quotation Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={goToLogin}
                  size="lg"
                  variant="outline"
                >
                  Login to Your Account
                </Button>
              </div>
            </motion.div>
            
            <div className="lg:w-1/2 pl-0 lg:pl-12">
              <motion.div 
                className="relative rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1627842468153-98e5e0420d78?q=80&w=2080&auto=format&fit=crop"
                  alt="Aluminum Windows Display"
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="inline-block bg-alu-primary text-white px-3 py-1 text-sm font-semibold rounded-full mb-2">
                    Professional Quotations
                  </span>
                  <h3 className="text-white text-xl font-bold">Streamline Your Estimation Process</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our quotation system is designed to make your estimation process faster and more accurate
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureItem}
            >
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Fast Estimation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quickly calculate prices based on dimensions, materials, and quantity with our intuitive interface
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureItem}
            >
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Customizable Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Adjust pricing with different series options, taxes, discounts, and wastage calculations
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureItem}
            >
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Professional PDFs
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate professionally formatted quotation PDFs ready to share with your customers
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureItem}
            >
              <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Email Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send quotations directly to customers via email with just a few clicks
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create accurate quotations in just three simple steps
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="rounded-full bg-alu-primary text-white flex items-center justify-center w-16 h-16 text-2xl font-bold mb-6">
                  1
                </div>
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 w-20 h-20 flex items-center justify-center mb-6">
                  <Ruler className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Product & Enter Dimensions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose from our catalog of aluminum and glass products, then enter specific dimensions and quantities
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="rounded-full bg-alu-primary text-white flex items-center justify-center w-16 h-16 text-2xl font-bold mb-6">
                  2
                </div>
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 w-20 h-20 flex items-center justify-center mb-6">
                  <Calculator className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Get Accurate Price Estimates
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our system automatically calculates accurate pricing based on dimensions, materials, and quantity
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="rounded-full bg-alu-primary text-white flex items-center justify-center w-16 h-16 text-2xl font-bold mb-6">
                  3
                </div>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 w-20 h-20 flex items-center justify-center mb-6">
                  <Download className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Download or Send Your Quotation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Save as a draft, download as PDF, print, or email the quotation directly to your customer
                </p>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              onClick={goToQuotationBuilder}
              size="lg"
              className="bg-alu-primary hover:bg-alu-primary/90 text-white"
            >
              Create Your First Quotation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-alu-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to streamline your quotation process?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who use TheAluVision to create precise quotations for their aluminum and glass projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={goToSignup}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-alu-primary"
              >
                Sign Up for Free
              </Button>
              <Button 
                onClick={goToQuotationBuilder}
                size="lg"
                className="bg-white text-alu-primary hover:bg-gray-100"
              >
                Try Without Account
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">TheAluVision</h3>
              <p className="text-gray-400">
                Professional quotation software for aluminum windows, doors, and glass products.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400 mb-2">
                info@thealuvision.com
              </p>
              <p className="text-gray-400 mb-4">
                +91 98765 43210
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-700" />
          
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} TheAluVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
  
  function goToSignup() {
    navigate('/signup');
  }
};

export default LandingPage;
