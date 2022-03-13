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
  const length = React.Children.toArray(children).length;
  const [activeIndex, setActiveIndex] = useState(index ? index : 0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [paused, setPaused] = useState(autoplay ? false : true);

  const updateIndex = (newIndex: number): void => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }

    updateAnimatedBannerIndex ? updateAnimatedBannerIndex(newIndex) : undefined;
    setActiveIndex(newIndex);

    if (slidesPerPage != 1) {
      let imageIndex = newIndex;

      // handle empty spaces
      if (!isEdit && newIndex > length - slidesPerPage && newIndex != 0) {
        imageIndex = 0;
        setActiveIndex(0);
      } else if (!isEdit && newIndex < length - slidesPerPage) {
        imageIndex === length - slidesPerPage;
      }

      if (
        isEdit === true &&
        newIndex >= length - slidesPerPage &&
        newIndex != 0
      ) {
        imageIndex = length - slidesPerPage;
      }

      setActiveImageIndex(imageIndex);

      if (newIndex === 0) {
        setActiveIndex(0);
      }
    } else {
      // handle single slide case
      setActiveImageIndex(newIndex);
    }
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
                  height: "calc(100%)",
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
            if (isEdit || index <= length - slidesPerPage)
              return (
                <Button
                  title={(index + 1).toString()}
                  className={`${index === activeIndex ? "active" : ""}`}
                  onClick={(): void => {
                    updateIndex(index);
                  }}
                />
              );
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
