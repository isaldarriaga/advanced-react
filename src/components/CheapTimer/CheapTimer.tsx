import {useEffect, useRef, useState} from "react";
import {getTimeByUnit, padNumber, updateElement} from './utils';

interface ITimerProps {
  beginDate: string;
}

export const CheapTimer = ({beginDate}: ITimerProps) => {
    // prevents ssr/csr dom mismatch
    const [isClient, setIsClient] = useState(false)

    // Timer's render count: equal to its parent's count + 1 (after triggering setIsClient)
    const rc = useRef(0),
      // allows cancelling the last animation frame requested
      rafHandle = useRef(0);

    // references to the DOM elements for direct inner text manipulation
    const daysElement = useRef<HTMLDivElement>(null);
    const hoursElement = useRef<HTMLDivElement>(null);
    const minutesElement = useRef<HTMLDivElement>(null);
    const secondsElement = useRef<HTMLDivElement>(null);
    const millisecondsElement = useRef<HTMLDivElement>(null);

    // initial date and time to begin, preserved between re-renders in multiple formats
    const initialBeginDateTime = useRef(new Date(beginDate).getTime()),
      initialTime = useRef(new Date().getTime()),
      initialTimeToBegin = useRef(
        initialBeginDateTime.current - initialTime.current
      ),
      initialTimeToBeginByUnit = useRef(
        getTimeByUnit(initialTimeToBegin.current)
      );

    // based on profiling in a PC, this function is taking 0.1 ms (100 microseconds) to complete
    const onNewAnimationFrame = () => {
      const newTime = new Date().getTime(),
        newTimeToBegin = initialBeginDateTime.current - newTime,
        newTimeToBeginByUnit = getTimeByUnit(newTimeToBegin);

      console.log(
        `timer(2) rc: ${
          rc.current
        }, to begin: ${JSON.stringify(
          newTimeToBeginByUnit
        )}`
      );

      const daysPromise = Promise.resolve(
          updateElement(daysElement, padNumber(newTimeToBeginByUnit.days, 2))
        ),
        hoursPromise = Promise.resolve(
          updateElement(hoursElement, padNumber(newTimeToBeginByUnit.hours, 2))
        ),
        minutesPromise = Promise.resolve(
          updateElement(
            minutesElement,
            padNumber(newTimeToBeginByUnit.minutes, 2)
          )
        ),
        secondsPromise = Promise.resolve(
          updateElement(
            secondsElement,
            padNumber(newTimeToBeginByUnit.seconds, 2)
          )
        ),
        millisecondsPromise = Promise.resolve(
          updateElement(
            millisecondsElement,
            padNumber(newTimeToBeginByUnit.milliseconds, 3)
          )
        );

      // wait for all ui updates to be dispatched before new animation frame request
      void Promise.all([
        daysPromise,
        hoursPromise,
        minutesPromise,
        secondsPromise,
        millisecondsPromise,
      ]).then(() => {
        if (newTimeToBeginByUnit.days === 0 && newTimeToBeginByUnit.hours === 0 &&
          newTimeToBeginByUnit.minutes === 0 && newTimeToBeginByUnit.seconds === 0 &&
          newTimeToBeginByUnit.milliseconds < 500) {
          cancelAnimationFrame(rafHandle.current)
        } else {
          rafHandle.current = requestAnimationFrame(onNewAnimationFrame);
        }
      });
    };

    useEffect(() => {
      setIsClient(true)
      rc.current++;
      console.
      log(
        `timer(1) rc: ${
          rc.current
        }, beginDate: ${beginDate}, to begin: ${JSON.stringify(
          initialTimeToBeginByUnit.current
        )}`
      );
      // first and last trigger from here
      rafHandle.current = requestAnimationFrame(onNewAnimationFrame);
    });

    return <div>
      {isClient && <table>
          <tbody>
          <tr>
              <td>
                  <div ref={daysElement}>
                    {padNumber(initialTimeToBeginByUnit.current.days, 2)}
                  </div>
              </td>
              <td>:</td>
              <td>
                  <div ref={hoursElement}>
                    {padNumber(initialTimeToBeginByUnit.current.hours, 2)}
                  </div>
              </td>
              <td>:</td>
              <td>
                  <div ref={minutesElement}>
                    {padNumber(initialTimeToBeginByUnit.current.minutes, 2)}
                  </div>
              </td>
              <td>:</td>
              <td>
                  <div ref={secondsElement}>
                    {padNumber(initialTimeToBeginByUnit.current.seconds, 2)}
                  </div>
              </td>
              <td>:</td>
              <td>
                  <div ref={millisecondsElement}>
                    {padNumber(initialTimeToBeginByUnit.current.milliseconds, 3)}
                  </div>
              </td>
          </tr>
          <tr>
              <td>Days</td>
              <td></td>
              <td>Hours</td>
              <td></td>
              <td>Minutes</td>
              <td></td>
              <td>Seconds</td>
              <td></td>
              <td>Milliseconds</td>
          </tr>
          </tbody>
      </table>}
    </div>;
  }
;