import React from "react";
import ProgressBar, { ProgressBarProps } from "react-bootstrap/ProgressBar";
import useInterval from "../../hooks/useInterval";

interface TimedProgressBarProps extends ProgressBarProps {
  // Timeout in ms
  timeout : number;

  // Delay between progress bar updates in ms
  delay? : number;

  // Stop the progress bar
  stopped? : boolean;

  // To which precision the display label number should be displayed in seconds
  displayPrecision? : number;

  // Format the label as this element
  labelAs? : React.ElementType;

  // Optional function to call on timeout, if none is given, no function is called
  onTimeout? : VoidFunction;
}

// Timed progress bar. Decrements a counter for a specified number of seconds. If onTimeout is passed as a function, it
// is called when the timer reaches 0.
const TimedProgressBar : React.FC<TimedProgressBarProps> = ({
  timeout,
  delay = 1000,  // Default timeout is 1000 ms
  stopped = false,
  displayPrecision = 0,  // Default precision is 0 (round to the nearest integer)
  onTimeout,
  labelAs = "span",
  ...progressBarProps
}) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(timeout);
  const [intervalDelay, setIntervalDelay] = React.useState<number | null>(delay);

  // Function which fires after one interval delay
  const afterDelay = () => {
    if (timeLeft - delay >= 0) {  // Decrement the time left when it is not below 0 yet
      setTimeLeft(timeLeft - delay);

    } else {  // Stop the interval when the time left is 0 or lower and call the onTimeout function if it is passed
      setIntervalDelay(null);
      if (onTimeout) {  // If onTimeout is passed, call it
        onTimeout();
      }
    }
  };

  // Set the interval
  useInterval(afterDelay, intervalDelay);

  // Use an effect to handle updates to the stopped or delay properties
  React.useEffect(() => {
    if (stopped) {
      setIntervalDelay(null);
    } else {
      setIntervalDelay(delay);
    }
  }, [delay, stopped]);

  // Label to display the amount of seconds left
  const displayLabel = () => {
    const LabelComponent = labelAs;  // Get the component specified by labelAs

    if (stopped) {
      return <LabelComponent className="text-reset m-auto">
        Stopped
      </LabelComponent>;
    } else {
      return <LabelComponent
        className="text-reset m-auto">{`${(timeLeft / 1000).toFixed(displayPrecision)}s`}
      </LabelComponent>;
    }
  };

  return <ProgressBar {...progressBarProps} // Destructure props to pass all other props to the ProgressBar
                      max={timeout}
                      min={0}
                      now={timeLeft}
                      label={displayLabel()} />;
};


// Exports
export default TimedProgressBar;