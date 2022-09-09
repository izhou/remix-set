import React, { Component } from "react";

type ClockProps = {
  // startTime: number,
  paused: boolean;
  ref: React.RefObject<unknown>;
};

type ClockState = {
  pausedTime: number;
  totalTime: number;
  timerStart?: number;
  interval?: NodeJS.Timer;
};
export default class Clock extends React.Component<ClockProps, ClockState> {
  constructor(props: any) {
    super(props);
    //This declared the state of time at the very beginning
    this.state = {
      timerStart: 0,
      pausedTime: 0,
      totalTime: 0,
      interval: undefined,
    };
  }

  componentDidMount() {
    this.setState({
      timerStart: Date.now(),
      interval: setInterval(() => this.updateClock(), 1000),
    });
  }

  componentDidUpdate(prevProps: ClockProps, prevState: ClockState) {
    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        clearInterval(this.state.interval);
        this.setState({
          pausedTime: this.state.totalTime,
          timerStart: undefined,
        });
      } else {
        this.setState({
          timerStart: Date.now(),
          interval: setInterval(() => this.updateClock(), 1000),
        });
      }
    }
  }

  //This section clears setInterval by calling intervalID so as to optimise memory
  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  //This function set the state of the time to a new time
  updateClock() {
    let timerStart = this.state.timerStart || 0;

    this.setState({
      totalTime: Date.now() - timerStart + this.state.pausedTime,
    });
  }

  getFormattedTime() {
    return new Date(this.state.totalTime).toISOString().slice(11, 19);
  }

  render() {
    return <>{this.getFormattedTime()}</>;
  }
}
