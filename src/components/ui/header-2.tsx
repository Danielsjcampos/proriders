'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { MessageCircle } from 'lucide-react';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{ name: 'Início', href: '#hero' },
		{ name: 'Sobre', href: '#about' },
		{ name: 'Cursos', href: '#courses' },
		{ name: 'Oficina', href: '#workshop' },
		{ name: 'Depoimentos', href: '#testimonials' },
		{ name: 'Blog', href: '#blog' },
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'fixed top-0 z-50 mx-auto w-full transition-all duration-300 ease-out py-2',
				{
					'bg-brand-dark/80 backdrop-blur-md shadow-lg': scrolled || open,
					'bg-transparent py-4': !scrolled && !open,
				},
			)}
		>
			<nav
				className={cn(
					'container mx-auto flex h-16 w-full items-center justify-between px-4 md:transition-all md:ease-out',
				)}
			>
				{/* Logo */}
				<a href="#hero" className="flex items-center">
					<img
						src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png"
						alt="Pro Riders Logo"
						className={cn("transition-all duration-300", scrolled ? "h-10 md:h-12" : "h-12 md:h-16")}
					/>
				</a>

				{/* Desktop Menu */}
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link, i) => (
						<a 
							key={i} 
							className={buttonVariants({ variant: 'ghost', className: 'text-xs uppercase tracking-widest font-bold' })} 
							href={link.href}
						>
							{link.name}
						</a>
					))}
					<a
						href="https://wa.me/5519999999999"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							buttonVariants({ variant: 'default', className: 'rounded-full font-bold gap-2 ml-4' })
						)}
					>
						<MessageCircle size={18} />
						<span>Fale Conosco</span>
					</a>
				</div>

				{/* Hamburger */}
				<Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden text-white">
					<MenuToggleIcon open={open} className="size-6" duration={300} />
				</Button>
			</nav>

			{/* Mobile Menu */}
			<div
				className={cn(
					'fixed top-[72px] right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden bg-brand-dark/95 backdrop-blur-xl md:hidden transition-all duration-300',
					open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
				)}
			>
				<div
					className={cn(
						'flex h-full w-full flex-col justify-between gap-y-2 p-6',
					)}
				>
					<div className="grid gap-y-4">
						{links.map((link) => (
							<a
								key={link.name}
								className={buttonVariants({
									variant: 'ghost',
									className: 'justify-start text-lg font-bold uppercase tracking-wider h-14',
								})}
								href={link.href}
								onClick={() => setOpen(false)}
							>
								{link.name}
							</a>
						))}
					</div>
					<div className="flex flex-col gap-4 mt-auto mb-10">
						<a
							href="https://wa.me/5519999999999"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								buttonVariants({ variant: 'default', className: 'rounded-lg font-bold gap-2 h-14 text-lg w-full' })
							)}
						>
							<MessageCircle size={24} />
							<span>Fale Conosco agora</span>
						</a>
					</div>
				</div>
			</div>
		</header>
	);
}
