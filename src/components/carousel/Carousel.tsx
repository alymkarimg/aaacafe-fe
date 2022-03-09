import React, { useEffect, useState } from "react";
// import { useSwipeable } from "react-swipeable";
import "./Carousel.scss";

interface CarouselItemProps {
  children: React.ReactNode;
  style?: object;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({
  children,
  style,
}) => {
  return (
    <div style={style} className="carousel-item">
      {children}
    </div>
  );
};

interface CarouselProps {
  children: React.ReactNode;
  index?: number;
  isEdit?: boolean;
  autoplay?: number;
  style?: object;
  slidesPerPage?: number;
  updateAnimatedBannerIndex?: (newIndex: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  index,
  isEdit,
  autoplay = 0,
  style = { width: "100%" },
  slidesPerPage = 1,
  updateAnimatedBannerIndex = undefined,
}) => {
  const [activeIndex, setActiveIndex] = useState(index ? index : 0);
  const [paused, setPaused] = useState(autoplay ? false : true);

  const updateIndex = (newIndex: number): void => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }

    updateAnimatedBannerIndex ? updateAnimatedBannerIndex(newIndex) : undefined;
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (autoplay != 0) {
      const interval = setInterval(() => {
        if (!paused) {
          updateIndex(activeIndex + 1);
        }
      }, autoplay);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  });

  useEffect(() => {
    if (index != undefined) {
      updateIndex(index);
    }
  }, [index]);

  // TODO: Add swipe functionality
  //   const handlers = useSwipeable({
  //     onSwipedLeft: () => updateIndex(activeIndex + 1),
  //     onSwipedRight: () => updateIndex(activeIndex - 1)
  //   });
  return (
    <div
      // {...handlers}
      className="carousel"
      style={style}
      onMouseEnter={(): void => setPaused(true)}
      onMouseLeave={(): void => setPaused(false)}
    >
      <div
        className="inner"
        style={{
          transform: `translateX(-${activeIndex * (1 / slidesPerPage) * 100}%)`,
        }}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as React.ReactElement, {
            style: {
              width: `${(1 / slidesPerPage) * 100}%`,
              border:
                isEdit && index === activeIndex ? "5px solid yellow" : "none",
            },
          });
        })}
      </div>
      <div className="indicators">
        <button
          onClick={(): void => {
            updateIndex(activeIndex - 1);
            // updateIndex(Math.max(activeIndex - slidesPerPage, 0));
          }}
        >
          Prev
        </button>
        {React.Children.map(children, (child, index) => {
          return (
            <button
              className={`${index === activeIndex ? "active" : ""}`}
              onClick={(): void => {
                updateIndex(index);
              }}
            >
              {index + 1}
            </button>
          );
        })}
        <button
          onClick={(): void => {
            updateIndex(activeIndex + 1);
            // updateIndex(
            //   Math.min(
            //     activeIndex + slidesPerPage,
            //     React.Children.toArray(children).length - slidesPerPage
            //   )
            // );
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
