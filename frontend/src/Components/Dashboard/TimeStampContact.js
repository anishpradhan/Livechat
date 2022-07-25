import React, { useState, useEffect } from "react";

const TimeStampContact = ({ time }) => {
  const [TimeStamp, setTimeStamp] = useState('');
  useEffect(() => {
    var interval = setInterval(() => {
      setTimeStamp(second => second +1);
    }, 10000);
    return(() => clearInterval(interval));

  }, [TimeStamp]);

  const renderTimestamp = (timestamp) => {
    let prefix = "";
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      // less than one minute ago
      prefix = `just now...`;
    } else if (timeDiff < 60 && timeDiff >= 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff}m`;
    } else if (timeDiff < 24 * 60 && timeDiff >= 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)}h`;
    } else if (timeDiff < 7 * 24 * 60 && timeDiff >= 24 * 60) {
      // less than 7 days ago
      prefix = `${weekday[new Date(timestamp).getDay()]}`;
    } else if (timeDiff >= 7 * 24 * 60) {
      // less than 7 days ago
      prefix = `${
        month[new Date(timestamp).getMonth()] +
        " " +
        new Date(timestamp).getDate()
      }`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  };

  return <span className="text-[12px] font-medium">{renderTimestamp(time)}</span>;
};

export default TimeStampContact;
