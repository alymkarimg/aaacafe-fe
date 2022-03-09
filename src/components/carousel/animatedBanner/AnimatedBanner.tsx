import React, { useEffect, useState } from "react";
import "./AnimatedBanner.scss";
import Carousel, { CarouselItem } from "../Carousel";
import { useSelector } from "react-redux";
import { State } from "../../../redux";
import { useLocation } from "react-router";
import { IAnimatedBannerItems } from "../../../redux/modules/edit";
import EditableArea from "../../editableArea/EditableArea";

interface Props {
  guid: string;
  pathname?: string;
  style?: object;
  autoplay?: number;
  slidesPerPage?: number;
}

const AnimatedBanner: React.FC<Props> = ({
  guid,
  pathname,
  style,
  autoplay = 0,
  slidesPerPage,
}) => {
  const AnimatedBanners = useSelector(
    (state: State) => state.edit
  ).animatedBanners;

  const isEdit = useSelector((state: State) => state.edit).edit;

  const location = useLocation();

  const [values, setValues] = useState({
    items: [] as IAnimatedBannerItems[],
    url: pathname ? pathname : location.pathname,
    activeIndex: 0,
  });

  const { items, activeIndex, url } = values;

  // find data from array of models and populate on page load
  useEffect(() => {
    const animatedBanner = AnimatedBanners.find((q) => {
      return q.pathname === url && q.guid === guid;
    });
    if (animatedBanner) {
      setValues({ ...values, items: animatedBanner.items });
    } else {
      // TODO: create animated banner in db
    }
  }, [AnimatedBanners]);

  const addSlide = (): void => {
    const newItems = [...items];
    newItems.push({
      media: undefined,
    });
    setValues({
      ...values,
      activeIndex: newItems.length - 1,
      items: newItems,
    });
  };

  const removeSlide = (): void => {
    const newItems = [...items];
    if (newItems.length > 1) {
      newItems.splice(activeIndex, 1);
      setValues({
        ...values,
        activeIndex: activeIndex - 1,
        items: newItems,
      });
    } else {
      // TODO: add UI message informing user that current slide cannot be deleted
    }
  };

  const uploadMedia = (): void => {
    // TODO: add image/video uploading mechanism
  };

  return (
    <>
      <Carousel
        isEdit={isEdit}
        slidesPerPage={slidesPerPage}
        style={style}
        updateAnimatedBannerIndex={(newIndex): void => {
          setValues({ ...values, activeIndex: newIndex });
        }}
        index={activeIndex}
        autoplay={isEdit ? 0 : autoplay ? autoplay : 0}
      >
        {/* TODO: add support for video format */}
        {items.map((q: IAnimatedBannerItems, index: number) => {
          return (
            <CarouselItem key={`carouselItem ${guid} ${index}`}>
              <img
                src={q.media ? q.media : "https://via.placeholder.com/1500"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt=""
              />
              <div
                style={{
                  position: "absolute",
                }}
              >
                {index + 1}
                <EditableArea
                  guid={`banner ${index} ${guid} `}
                  // TODO: check why I need to give the editable area a color??
                  style={{ minWidth: "150px", color: "black" }}
                />
              </div>
            </CarouselItem>
          );
        })}
      </Carousel>
      {isEdit && (
        <div>
          <div className="bannerEditorButtons">
            {/* Add media uploader functionaility */}
            <div>
              <button onClick={uploadMedia}>Upload media</button>
              <button onClick={addSlide}>Add Slide</button>
              <button onClick={removeSlide}>Remove Slide</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimatedBanner;
