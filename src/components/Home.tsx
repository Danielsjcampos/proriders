import { Header } from './ui/header-2';
import HeroScroll from './HeroScroll';
import About from './About';
import Courses from './Courses';
import OnlineCourseCTA from './OnlineCourseCTA';
import Workshop from './Workshop';
import Testimonials from './Testimonials';
import Footer from './Footer';

const Home = () => {
    return (
        <div className="bg-brand-dark min-h-screen text-gray-100 font-sans selection:bg-brand-red selection:text-white">
            <Header />
            <HeroScroll />
            <About />
            <Courses />
            <OnlineCourseCTA />
            <Workshop />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default Home;
