import React, { useEffect, useState } from "react";
import Button from "../button/Button";
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
  const length = React.Children.count(children);
  const [activeIndex, setActiveIndex] = useState(index ? index : 0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [paused, setPaused] = useState(autoplay ? false : true);

  const updateIndex = (newIndex: number): void => {
    const oldIndex = newIndex;
    if (newIndex < 0) {
      newIndex = length - 1;
    } else if (newIndex >= length) {
      newIndex = 0;
    }

    updateAnimatedBannerIndex ? updateAnimatedBannerIndex(newIndex) : undefined;
    setActiveIndex(newIndex);

    let imageIndex = newIndex;

    // handle empty spaces
    if (
      isEdit &&
      newIndex > length - slidesPerPage &&
      newIndex <= length &&
      slidesPerPage !== 1
    ) {
      imageIndex = length - slidesPerPage;
    }

    if (
      !isEdit &&
      newIndex > length - slidesPerPage &&
      newIndex <= length &&
      slidesPerPage !== 1 &&
      oldIndex != -1
    ) {
      imageIndex = 0;
      setActiveIndex(0);
      updateAnimatedBannerIndex ? updateAnimatedBannerIndex(0) : undefined;
    } else if (
      !isEdit &&
      newIndex > length - slidesPerPage &&
      newIndex <= length &&
      slidesPerPage !== 1 &&
      oldIndex === -1
    ) {
      imageIndex = length - slidesPerPage;
      setActiveIndex(length - slidesPerPage);
      updateAnimatedBannerIndex
        ? updateAnimatedBannerIndex(length - slidesPerPage)
        : undefined;
    }

    setActiveImageIndex(imageIndex);
  };

  useEffect(() => {
    if (autoplay != 0) {
      const interval = setInterval(() => {
        if (!paused) {
          updateIndex(
            activeIndex > length - slidesPerPage
              ? length - slidesPerPage
              : activeIndex + 1
          );
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
  if (slidesPerPage > 0)
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
            height: "100%",
            transform: `translateX(-${
              activeImageIndex * (1 / slidesPerPage) * 100
            }%)`,
          }}
        >
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                style: {
                  ...child.props.style,
                  height: "calc(100% - 5px)",
                  width: `calc(${(1 / slidesPerPage) * 100}%)`,
                  border:
                    isEdit && index === activeIndex
                      ? "5px solid yellow"
                      : undefined,
                },
              });
            }
          })}
        </div>
        {length / slidesPerPage > 1 && (
          <Button
            title="<"
            className="left-indicator"
            onClick={(): void => {
              updateIndex(activeIndex - 1);
            }}
          >
            Prev
          </Button>
        )}
        <div className="indicators">
          {React.Children.map(children, (child, index) => {
            if (isEdit || index <= length - slidesPerPage) {
              return (
                <Button
                  title={(index + 1).toString()}
                  className={`${index === activeIndex ? "active" : ""}`}
                  onClick={(): void => {
                    updateIndex(index);
                  }}
                />
              );
            }
          })}
        </div>
        {length / slidesPerPage > 1 && (
          <Button
            title=">"
            className="right-indicator"
            onClick={(): void => {
              updateIndex(activeIndex + 1);
            }}
          >
            Next
          </Button>
        )}
      </div>
    );
  return <div>Banner wont work with 0 slides per page</div>;
};

export default Carousel;
