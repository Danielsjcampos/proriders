import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black py-12 border-t border-gray-900 relative overflow-hidden">
            {/* Background Overlay Effect */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none z-0">
                <img
                    src="https://proriders.com.br/wp-content/uploads/2025/09/capa-kwify.png"
                    alt="Background Decoration"
                    className="w-full h-full object-cover mask-image-left"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <a href="#hero" className="inline-block mb-4">
                            <img
                                src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png"
                                alt="Pro Riders Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </a>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Oficina especializada e escola de mecânica para BMW GS. Paixão, técnica e transparência em um só lugar.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Navegação</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#hero" className="hover:text-brand-red transition-colors">Início</a></li>
                            <li><a href="#about" className="hover:text-brand-red transition-colors">Sobre</a></li>
                            <li><a href="#courses" className="hover:text-brand-red transition-colors">Cursos</a></li>
                            <li><a href="#workshop" className="hover:text-brand-red transition-colors">Oficina</a></li>
                            <li><a href="#contact" className="hover:text-brand-red transition-colors">Contato</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contato</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2">
                                <MapPin size={18} className="text-brand-red" />
                                <span>Campinas, SP</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={18} className="text-brand-red" />
                                <span>(19) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={18} className="text-brand-red" />
                                <span>contato@proriders.com.br</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Pro Riders. Todos os direitos reservados.
                    </p>

                    <div className="flex gap-4">
                        <SocialLink href="#" icon={<Instagram size={20} />} />
                        <SocialLink href="#" icon={<Facebook size={20} />} />
                        <SocialLink href="#" icon={<Youtube size={20} />} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }: { href: string, icon: any }) => (
    <a
        href={href}
        className="bg-gray-800 text-gray-400 hover:bg-brand-red hover:text-white p-2 rounded-full transition-colors"
    >
        {icon}
    </a>
);

export default Footer;
