import "./styling/resizable.css";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import React, { useEffect, useState } from "react";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;

  //change states whenever the browser window resizes
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);
  const [width, setWidth] = useState<number>(window.innerWidth * 0.75);
  const [height, setHeight] = useState<number>(window.innerHeight * 0.25);
  useEffect(() => {
    const resizeListener = () => {
      const timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        //fixes the constraint skip when child component is updated with the prop
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
        if (window.innerHeight * 1.75 < height) {
          setHeight(window.innerHeight * 1.75);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    };

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [width, height]);

  //props for ResizableBox
  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.25, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      height: Infinity,
      width: width,
      resizeHandles: ["e"],
      onResizeStop: (evt, data) => {
        //callback to Resizable component width state
        setWidth(data.size.width);
      },
    };
  } else {
    //direction === 'vertical'
    resizableProps = {
      minConstraints: [Infinity, innerHeight * 0.25],
      maxConstraints: [Infinity, innerHeight * 1.75],
      height: height,
      width: Infinity,
      resizeHandles: ["s"],
      onResizeStop: (evt, data) => {
        //callback to Resizable component height state
        setHeight(data.size.height);
      },
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
