import React, { useEffect, useState, ChangeEvent } from "react";
import "./AnimatedBanner.scss";
import Carousel, { CarouselItem } from "../Carousel";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../redux";
import { useLocation } from "react-router";
import { IAnimatedBannerItem } from "../../../redux/modules/edit";
import EditableArea from "../../editableArea/EditableArea";
import Button from "../../button/Button";
import TextField from "../../textfield/Textfield";
import { addToast } from "../../../redux/modules/toast";

interface Props {
  guid: string;
  pathname?: string;
  style?: object;
}

const AnimatedBanner: React.FC<Props> = ({ guid, pathname, style }) => {
  // TODO: Check this isVideo function
  String.prototype.isVideo = function (): boolean {
    function getExtension(path: string): string {
      const basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
        // (supports `\\` and `/` separators)
        pos = basename!.lastIndexOf("."); // get last position of `.`

      if (basename === "" || pos < 1)
        // if file name is empty or ...
        return ""; //  `.` not found (-1) or comes first (0)

      return basename!.slice(pos + 1); // extract extension ignoring `.`
    }

    if (getExtension(this.toString()) === "mp4") return true;
    else return false;
  };

  const dispatch = useDispatch();
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
    items: [{}],
    url: pathname ? pathname : location.pathname,
    activeIndex: 0,
    slidesPerPage: 1,
    autoplay: 0,
  });

  const { items, activeIndex, url, slidesPerPage, autoplay } = values;

  const [videoLoading, setVideoLoading] = useState(false);

  // find data from array of models and populate on page load
  useEffect(() => {
    let animatedBanner = AnimatedBanners.find((q) => {
      return q.pathname === url && q.guid === guid;
    });
    if (animatedBanner) {
      setValues({
        ...values,
        items: animatedBanner.items,
        slidesPerPage: animatedBanner.slidesPerPage,
        autoplay: animatedBanner.autoplay,
      });
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
      dispatch(
        addToast(
          "test",
          "test",
          "warning",
          "Cannot delete slide",
          "Cannot delete the only remaining slide"
        )
      );
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
    setValues({
      ...values,
      slidesPerPage: parseInt(e.target.value, 10)
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
        {items.map((q: IAnimatedBannerItem, index: number) => {
          const backgroundImage = "https://via.placeholder.com/1500";
          return (
            <CarouselItem
              style={{ alignItems: "unset" }}
              key={`carouselItem ${guid} ${index}`}
            >
              {q.media?.isVideo() && (
                <video
                  loop
                  width={"100%"}
                  autoPlay
                  muted
                  style={{ objectFit: "cover" }}
                >
                  <source src={q.media} type="video/webm" />
                  <p>Sorry, your browser does not support embedded videos.</p>
                </video>
              )}

              {!q.media?.isVideo() && (
                <div
                  style={{
                    width: "100%",
                    minHeight: "100%",
                    objectFit: "cover",
                    backgroundImage: q.media
                      ? "url(" + q.media + ")"
                      : "url(" + backgroundImage + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                }}
              >
                {index + 1}
                {(slidesPerPage == undefined || slidesPerPage <= 10) && (
                  <EditableArea
                    guid={`banner ${index} ${guid} `}
                    // TODO: check why I need to give the editable area a color??
                    style={{ minWidth: "100px", color: "black" }}
                  />
                )}
              </div>
            </CarouselItem>
          );
        })}
      </Carousel>
      {isEdit && (
        <div>
          <div className="banner-editor-buttons">
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
