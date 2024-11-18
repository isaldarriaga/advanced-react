import {RefObject} from 'react';
import {
  HOURS_IN_DAY,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_SECOND,
  MINUTES_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "./constants";
import {ITimeFlag, ITimeOffset} from './types';

const getPreciseMillisecondsByUnit = (milliseconds: number) => {
  return {
    days: milliseconds / MILLISECONDS_IN_DAY,
    hours: milliseconds / MILLISECONDS_IN_HOUR,
    minutes: milliseconds / MILLISECONDS_IN_MINUTE,
    seconds: milliseconds / MILLISECONDS_IN_SECOND,
    milliseconds: milliseconds,
  };
};

export function getTimeByUnit(ms: number) {
  const precise = getPreciseMillisecondsByUnit(ms);

  let days = Math.floor(precise.days),
    hours = Math.floor(precise.hours - days * HOURS_IN_DAY),
    minutes = Math.floor(
      precise.minutes - days * MINUTES_IN_DAY - hours * MINUTES_IN_HOUR
    ),
    seconds = Math.floor(
      precise.seconds -
      days * SECONDS_IN_DAY -
      hours * SECONDS_IN_HOUR -
      minutes * SECONDS_IN_MINUTE
    ),
    milliseconds = Math.floor(
      precise.milliseconds -
      days * MILLISECONDS_IN_DAY -
      hours * MILLISECONDS_IN_HOUR -
      minutes * MILLISECONDS_IN_MINUTE -
      seconds * MILLISECONDS_IN_SECOND
    );

  // console.log(`precise milliseconds: ${precise.milliseconds.toFixed(3)}, milliseconds: ${milliseconds}`);

  const isTimeReset: ITimeFlag = {};

  if (milliseconds < 0) {
    seconds--;
    milliseconds = MILLISECONDS_IN_SECOND - 1;
    isTimeReset.milliseconds = true;
  }

  if (seconds < 0) {
    minutes--;
    seconds = SECONDS_IN_MINUTE + seconds;
    isTimeReset.seconds = true;
  }

  if (minutes < 0) {
    hours--;
    minutes = MINUTES_IN_HOUR + minutes;
    isTimeReset.minutes = true;
  }

  if (hours < 0) {
    days--;
    hours = HOURS_IN_DAY + hours;
    isTimeReset.hours = true;
  }

  if (days < 0) {
    days = 0;
    isTimeReset.days = true;
  }

  if (isTimeReset.days && isTimeReset.hours && isTimeReset.minutes && isTimeReset.seconds && isTimeReset.milliseconds) {
    // no longer update the timer
    days = hours = minutes = seconds = 0;
  }

  return {days, hours, minutes, seconds, milliseconds};
}

export const padNumber = (
  num: number,
  length: number,
  padChar: string = "0"
): string => {
  return num.toString().padStart(length, padChar);
};

export const updateElement = (
  element: RefObject<HTMLDivElement>,
  newValue: string
) => {
  if (element.current) {
    // direct update to the DOM: no state change -> no diffing -> no re-render
    element.current.innerText = newValue;
  }

  return newValue;
};

export const getFutureISODate = (offset: ITimeOffset) => {
  const now = new Date();

  now.setFullYear(now.getFullYear() + (!!offset.years ? offset.years : 0));
  now.setMonth(now.getMonth() + (!!offset.months ? offset.months : 0));
  now.setDate(now.getDate() + (!!offset.days ? offset.days : 0));
  now.setHours(now.getHours() + (!!offset.hours ? offset.hours : 0));
  now.setMinutes(now.getMinutes() + (!!offset.minutes ? offset.minutes : 0));
  now.setSeconds(now.getSeconds() + (!!offset.seconds ? offset.seconds : 0));
  now.setMilliseconds(now.getMilliseconds() + (!!offset.milliseconds ? offset.milliseconds : 0));

  return now.toISOString();
};

  export const isDateInTheFuture = (date: string)=> {
  return (new Date(date).getTime() - new Date().getTime()) > 0;
}