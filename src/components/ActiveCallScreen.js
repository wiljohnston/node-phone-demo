import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import Button from "./Button";
import Scrambler from "../components/Scrambler";
import getRandomName from "../utils/getRandomName";

const ActiveCallScreen = ({ className, borderColour }) => {
  const { currentEvent, hangUpCall } = useContext(AppContext);
  const [startTime] = useState(moment(new Date()));
  const [counter, setCounter] = useState(`00:00:00`);
  const [randomName, setRandomName] = useState(null);

  const formatNumber = rawNumber => {
    const chars = [];

    const splitNumber = rawNumber.split("");

    if (splitNumber[0] != '+'){
      chars.push("+"); 
    }

    if (splitNumber[1] != '6'){
      chars.push("6"); 
    }

    if (splitNumber[2] != '1'){
      chars.push("1"); 
    }

    if (splitNumber[0] === '0'){
      chars.splice(0, 1); 
    }
    
    return [...chars, ...splitNumber].join("")

  }

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const nowTime = moment(new Date());
      const diffTime = moment.utc(nowTime.diff(startTime));
      setCounter(diffTime.format("HH:mm:ss"));
    }, 1000);

    setRandomName(getRandomName());

    setInterval(() => {
      setRandomName(getRandomName());
    }, 3000)

    return () => {
      
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className={className}>
      <div className="w-full flex flex-col items-center" >
      <h2 className="f4">{`You're talking to your buddy,`}</h2>
      <h2 className="f4 mt-2"><Scrambler text={randomName ? `${randomName}?` : ""} iterations={5} /></h2>
      <p className="b1 mt-4">{counter}</p>
      <h2 className="mt-8 f3 italic">{`${formatNumber(currentEvent?.callerId)}` || `???`}</h2>
      
      </div>
      <Button className={`f3 pt-2 pb-1 px-8 mt-12 border-thick border-${borderColour} border-dotted`} onClick={hangUpCall} text="I've had enough" />
    </div>
  );
};

export default ActiveCallScreen;
