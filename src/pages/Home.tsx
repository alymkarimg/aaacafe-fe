import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../redux";
import { IData, loadDataAction } from "../redux/modules/data";
import { IncrementCounter } from "../components/IncrementCounter";
import Data from "./Data";

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

    // shouldnt this contsin the formdata
    await dispatch(loadDataAction);
  };
  return (
    <div>
      <h1>HomePage</h1>
      <IncrementCounter></IncrementCounter>
      <Data></Data>
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
      </form>
    </div>
  );
};

export default Home;
