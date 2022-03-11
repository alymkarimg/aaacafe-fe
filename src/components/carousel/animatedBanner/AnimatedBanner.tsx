import React, { useEffect, useState, ChangeEvent } from "react";
import "./AnimatedBanner.scss";
import Carousel, { CarouselItem } from "../Carousel";
import { useSelector } from "react-redux";
import { State } from "../../../redux";
import { useLocation } from "react-router";
import { IAnimatedBannerItem } from "../../../redux/modules/edit";
import EditableArea from "../../editableArea/EditableArea";
import Button from "../../button/Button";
import TextField from "../../textfield/Textfield";

interface Props {
  guid: string;
  pathname?: string;
  style?: object;
}

const AnimatedBanner: React.FC<Props> = ({ guid, pathname, style }) => {
  const AnimatedBanners = useSelector(
    (state: State) => state.edit
  ).animatedBanners;

  const isEdit = useSelector((state: State) => state.edit).edit;

  const location = useLocation();

  const [values, setValues] = useState<{
    items: IAnimatedBannerItem[];
    url: string;
    activeIndex: number;
    slidesPerPage?: number;
    autoplay: number;
  }>({
    items: [],
    url: pathname ? pathname : location.pathname,
    activeIndex: 0,
    slidesPerPage: 1,
    autoplay: 0,
  });

  const { items, activeIndex, url, slidesPerPage, autoplay } = values;

  // find data from array of models and populate on page load
  useEffect(() => {
    const animatedBanner = AnimatedBanners.find((q) => {
      return q.pathname === url && q.guid === guid;
    });
    if (animatedBanner) {
      setValues({
        ...values,
        items: animatedBanner.items,
        slidesPerPage: animatedBanner.slidesPerPage,
        autoplay: animatedBanner.autoplay,
      });
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

  const handleChangeAutoplay = (e: ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, autoplay: parseInt(e.target.value, 10) });
  };

  const handleChangeSlidesPerPage = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    // TODO: check that max slides is working as intended
    setValues({
      ...values,
      slidesPerPage:
        parseInt(e.target.value, 10) > 0 && parseInt(e.target.value, 10) <= 25
          ? parseInt(e.target.value, 10)
          : undefined,
      activeIndex: 0,
    });
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
        {items.map((q: IAnimatedBannerItem, index: number) => {
          const backgroundImage = "https://via.placeholder.com/1500";
          return (
            <CarouselItem key={`carouselItem ${guid} ${index}`}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "none",
                  backgroundImage: q.media
                    ? "url(" + q.media + ")"
                    : "url(" + backgroundImage + ")",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
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
                  style={{ minWidth: "100px", color: "black" }}
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
            <Button title="Upload Media" onClick={uploadMedia} />
            <Button title="Add Slide" onClick={addSlide} />
            <Button title="Remove Slide" onClick={removeSlide} />
            <TextField
              id={`animatedBanner AutoPlay ${guid}`}
              type={"number"}
              min={0}
              label={"AutoPlay (ms)"}
              onChange={handleChangeAutoplay}
              value={autoplay.toString()}
              placeholder={"Autoplay"}
            />
            <TextField
              id={`animatedBanner SlidesPerPage ${guid}`}
              type={"number"}
              min={1}
              max={25}
              label={"Slides per page"}
              onChange={handleChangeSlidesPerPage}
              value={slidesPerPage ? slidesPerPage.toString() : undefined}
              placeholder={"Slides per page"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AnimatedBanner;
