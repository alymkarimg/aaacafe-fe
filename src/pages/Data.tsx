import React, { useEffect, useState } from "react";
import { IData, loadDataAction } from "../redux/modules/data";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../redux";

const Data = (): React.ReactElement => {
  const dispatch = useDispatch();

  const reduxStateData = useSelector((state: State) => state.editableAreas);

  const [data, setData] = useState<IData>({
    name: "",
  });

  return (
    <div>
      <h1>Data Page</h1>
      {reduxStateData.editableAreaProps.map((d, i) => {
        return (
          <li key={i + "datalist"}>
            {d.guid}
            {d.pathname}
          </li>
        );
      })}
    </div>
  );
};

export default Data;
