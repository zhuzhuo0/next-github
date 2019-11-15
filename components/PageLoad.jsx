import { Spin } from "antd";

export default () => (
  <div className={"pageLoad"}>
    <Spin />
    <style jsx>
      {`
        .pageLoad {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.3);
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}
    </style>
  </div>
);
