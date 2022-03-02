import React, { useState } from "react";

export const IncrementCounter: React.FC = () => {
  let [num, setNum] = useState<number>(0);
  let incNum = (): void => {
    setNum(Number(num) + 1);
  };

  // not 100% sure about the interface used here
  let handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const newValue = e.currentTarget.value;
  };

  return (
    <>
      <div className="col-xl-1">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={num}
            onChange={handleChange}
          />
          <div className="input-group-prepend">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={incNum}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
