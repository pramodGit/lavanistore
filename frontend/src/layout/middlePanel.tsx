import BestSellerSlider from '../components/BestSellers';
import CategorySlider from '../components/CategorySlider';
import LazyLoad from '../components/LazyLoad';
import Skeleton from '@mui/material/Skeleton';
import { banners } from '../data/mockData';
import HeroBannerCarousel from '../components/HeroBannerCarousel';
import Aboutus from '../components/Aboutus';
import OurBrand from '../components/OurBrand';

export default function MiddlePanel() {
    const handleSelect = (category: string) => {
        console.log('Selected:', category);
        // Filter products or navigate accordingly
    };
    return (
        <main>
            <section id="middlePanel" className="middle-panel">
                <HeroBannerCarousel banners={banners} autoplayDelay={4000} />
                <LazyLoad fallback={<Skeleton variant="rectangular" height={200} animation="wave" />}>
                    <CategorySlider />
                </LazyLoad>
                <LazyLoad height={400}>
                    <BestSellerSlider />
                </LazyLoad>
                <LazyLoad>
                    <Aboutus />
                    <OurBrand />
                </LazyLoad>
            </section>
        </main>
    );
}