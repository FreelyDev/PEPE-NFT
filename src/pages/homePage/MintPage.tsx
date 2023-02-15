import Loading from 'components/loading/Loading';
import Menu from 'components/menu/Menu';
import Topbar from 'components/topbar/Topbar';
import { useEagerConnect } from 'hooks/useEagerConnect';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import Mint from 'components/mint/Mint';
import RoadMap from 'components/roadMap/RoadMap';

export default function MintPage() {
    useEagerConnect();
    const [isLoading, setIsLoading] = useState(true);


    const [menuOpen, setMenuOpen] = useState(false);
    const isTabletOrMobile = useMediaQuery({ query: "screen and (max-width: 768px) and (orientation:portrait)", });
    const isLandOrMobile = useMediaQuery({ query: "screen and (max-height: 768px) and (orientation:landscape)", });
    useEffect(() => {
        if (!isLandOrMobile && !isTabletOrMobile) {
            setMenuOpen(false);
        }
    }, [isLoading, isTabletOrMobile, isLandOrMobile]);
    
    AOS.init();

    window.onload = () => {
        setIsLoading(false)
        AOS.init({
            // Global settings:
            disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
            startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
            initClassName: 'aos-init', // class applied after initialization
            animatedClassName: 'aos-animate', // class applied on animation
            useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
            disableMutationObserver: false, // disables automatic mutations' detections (advanced)
            debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
            throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


            // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
            offset: 120, // offset (in px) from the original trigger point
            delay: 0, // values from 0 to 3000, with step 50ms
            duration: 400, // values from 0 to 3000, with step 50ms
            easing: 'ease', // default easing for AOS animations
            once: false, // whether animation should happen only once - while scrolling down
            mirror: false, // whether elements should animate out while scrolling past them
            anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

        });
    };

    return (
        <>
            <Topbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Loading isLoading={isLoading} />
            <div className="sections">
                <Mint setIsLoading = {setIsLoading}/>
                <RoadMap/>
                <div className="documentIcon">
                    <a href="https://its-just-pepe.gitbook.io/its-just-pepe" target={'_blank'} rel="noreferrer"><i className="fas fa-book"></i></a>
                </div>
            </div>
        </>
    )
}
