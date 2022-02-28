import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../redux";
import { IData, loadDataAction } from "../redux/modules/data";

const Home = (): React.ReactElement => {
  const dispatch = useDispatch();

  const reduxStateData = useSelector((state: State) => state.data);

  const [data, setData] = useState<IData>({
    name: "",
  });

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

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={data.name}
          onChange={(e) =>
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
