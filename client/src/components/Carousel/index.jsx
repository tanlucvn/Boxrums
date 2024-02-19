const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="max-w-screen-md mx-auto">
            {/* Carousel Container */}
            <div className="relative overflow-hidden">
                {/* Slides Container */}
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="w-full">
                            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover" />
                        </div>
                    ))}
                </div>
                {/* Navigation Arrows */}
                <button className="absolute top-1/2 left-2 transform -translate-y-1/2 focus:outline-none" onClick={prevSlide}>
                    Previous
                </button>
                <button className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none" onClick={nextSlide}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Carousel