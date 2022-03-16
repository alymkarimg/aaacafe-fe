import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableArea from "../components/editableArea/EditableArea";
import AnimatedBanner from "../components/carousel/animatedBanner/AnimatedBanner";
import { State } from "../redux";
import { IData, loadDataAction } from "../redux/modules/data";
import Carousel, { CarouselItem } from "../components/carousel/Carousel";

const Home = (): React.ReactElement => {
  const dispatch = useDispatch();

  const reduxStateData = useSelector((state: State) => state.data);

  const [data, setData] = useState<IData>({
    name: "",
  });

  //test comment

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await dispatch(loadDataAction);
  };
  return (
    <div>
      <h1>HomePage</h1>
      <ul>
        {reduxStateData.data.map((d, i) => {
          return <li key={i + "datalist"}>{d.name}</li>;
        })}
      </ul>

      <form onSubmit={(e): Promise<void> => handleSubmit(e)}>
        <input
          type="text"
          value={data.name}
          onChange={(e): void =>
            setData((data) => {
              e.persist();
              const { value } = e.target;
              return {
                ...data,
                name: value,
              };
            })
          }
        />
        <button type="submit">Submit</button>
        <EditableArea pathname="/" guid="ea_homepage"></EditableArea>
        {/* maxHeight: "300px" */}
        <AnimatedBanner
          guid="homepage_banner"
          style={{ height: "500px", width: "100%" }}
        />
        <Carousel style={{ height: "100px" }} autoplay={0} slidesPerPage={3}>
          <CarouselItem>Item1</CarouselItem>
          <CarouselItem>Item2</CarouselItem>
          <CarouselItem>Item3</CarouselItem>
          <CarouselItem>Item4</CarouselItem>
          <CarouselItem>Item5</CarouselItem>
          <CarouselItem>Item6</CarouselItem>
          <CarouselItem>Item7</CarouselItem>
        </Carousel>
      </form>
    </div>
  );
};

export default Home;
