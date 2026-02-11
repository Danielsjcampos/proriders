import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Início', href: '#hero' },
        { name: 'Sobre', href: '#about' },
        { name: 'Cursos', href: '#courses' },
        { name: 'Oficina', href: '#workshop' },
        { name: 'Depoimentos', href: '#testimonials' },
        { name: 'Blog', href: '#blog' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${isScrolled ? 'bg-brand-dark/80 backdrop-blur-md shadow-lg py-4' : 'bg-brand-dark/20 backdrop-blur-sm py-6'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                {/* Logo */}
                <a href="#hero" className="flex items-center">
                    <img
                        src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png"
                        alt="Pro Riders Logo"
                        className="h-12 md:h-16 w-auto object-contain"
                    />
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-brand-red transition-colors text-sm uppercase tracking-wide font-medium"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="https://wa.me/5519999999999" // TODO: Add real number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold transition-transform hover:scale-105"
                    >
                        <MessageCircle size={18} />
                        <span>Fale Conosco</span>
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-brand-red transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-brand-dark border-t border-gray-800"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-300 hover:text-brand-red text-lg font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="https://wa.me/5519999999999"
                                className="flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg font-bold w-full"
                            >
                                <MessageCircle size={20} />
                                <span>Fale Conosco</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
