import React, {Component} from 'react';
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "@material-ui/core/Slider";
import FormControl from "@material-ui/core/FormControl";

class Car extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 5000000
    }
  }

  render() {

    function valuetext(value) {
      return `${value}L`;
    }
    const loan_amount_marks = [
      {
        value: 0,
        label: '0',
      },
      {
        value: 25,
        label: '25L',
      },
      {
        value: 50,
        label: '50L',
      },
      {
        value: 75,
        label: '75L',
      },
      {
        value: 100,
        label: '1Cr',
      },
      {
        value: 125,
        label: '1.25Cr',
      },
      {
        value: 150,
        label: '1.50Cr',
      },
      {
        value: 175,
        label: '1.75Cr',
      },
      {
        value: 200,
        label: '2Cr',
      }
    ];

    return (
      <div>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-car-amount">Loan Amount</InputLabel>
          <OutlinedInput
            className="home-loan-text-box"
            id="outlined-adornment-car-amount"
            value={this.state.amount}
            onChange={(e) => this.handleInputChange(e)}
            startAdornment={<InputAdornment position="start">&#8377;</InputAdornment>}
            labelWidth={95}
            margin={"dense"}
          />
          <Slider
            defaultValue={this.state.amount / 100000}
            // value={this.state.amount / 100000}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            min={0}
            max={200}
            marks={loan_amount_marks}
            onChange={(e) => this.handleChange(e)}
            valueLabelDisplay="auto"
          />
          <input
            id="typeinp"
            type="range"
            min="0" max="200"
            // value={this.state.amount/100000}
            onChange={(e) => this.handleChange(e)}
            step="1"/>
        </FormControl>
      </div>
    );
  }

  handleChange(e) {
    console.log(e.target.value)
    this.setState({amount: e.target.value*100000})
  }

  handleInputChange(e) {
    console.log('input' + e.target.value)
    this.setState({amount: e.target.value})
  }
}

export default Car;