import React, {useEffect} from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import {ThemeProvider} from "@material-ui/styles";
import Slider from "@material-ui/core/Slider";
import {createMuiTheme, makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

export default function LoanForm(props) {
  const [loanAmt, setLoanAmt] = React.useState(props.initial_principal);
  const [loanAmtSliderSelected, setLoanAmtSliderSelected] = React.useState(false);
  const [intRate, setIntRate] = React.useState(props.int_rate);
  const [monthSelected, setMonthSelected] = React.useState(false);
  const [tenureYear, setTenureYear] = React.useState(props.tenure_year);
  const [tenureMonth, setTenureMonth] = React.useState(props.tenure_month);
  const [selectedTenure, setSelectedTenure] = React.useState(tenureMonth);
  const [emi, setEmi] = React.useState(0);
  const [totalIntAmt, setTotalIntAmt] = React.useState(0);
  const [totalMoi, setTotalMoi] = React.useState(0);

  let loan_amt_input_value = loanAmtSliderSelected ? (loanAmt * props.multiplier) : loanAmt;
  let loan_amt_slider_value = !loanAmtSliderSelected ? (loanAmt / props.multiplier) : loanAmt;

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));
  const classes = useStyles({});

  const muiTheme = createMuiTheme({
    overrides: {
      MuiSlider: {
        root: {
          color: '#FF8042'
        }
      }
    }
  });

  function valuetext(value) {
    return `${value}L`;
  }

  const handleLoanAmtChange = (event, newValue) => {
    setLoanAmt(newValue);
    setLoanAmtSliderSelected(true);
  };

  const handleIntRateChange = (event, newValue) => {
    setIntRate(newValue);
  };

  const handleTenureChange = (event, newValue) => {
    if (monthSelected) {
      setTenureMonth(newValue);
    } else {
      setTenureYear(newValue);
      setTenureMonth(newValue * 12);
    }
  };

  const handleInputChange = (event, type) => {
    let newValue = event.target.value === '' ? '' : Number(event.target.value);
    if (type === 'loan_amt') {
      setLoanAmt(newValue);
      setLoanAmtSliderSelected(false);
    } else if (type === 'int_rate') {
      setIntRate(newValue);
    } else if (type === 'tenure') {
      if (monthSelected) {
        setTenureMonth(newValue);
      } else {
        setTenureYear(newValue);
        setTenureMonth(newValue * 12);
      }
    }
  };

  useEffect(() => {
    calculateEMI();
  });

  function calculateEMI() {
    let principal = loanAmtSliderSelected ? (loanAmt * props.multiplier) : loanAmt;
    let months = monthSelected ? tenureMonth : (tenureYear * 12);
    setSelectedTenure(months);
    let monthly_ratio = intRate / 12 / 100;
    let tenure = (Math.pow((1 + monthly_ratio), months)) / ((Math.pow((1 + monthly_ratio), months)) - 1);
    let emi_value = principal * monthly_ratio * tenure;
    setEmi(emi_value);
    let total_amt = emi_value * months;
    setTotalMoi(total_amt)
    let int_amt = total_amt - principal;
    setTotalIntAmt(int_amt);
    props.handler({
      loan_amt: loanAmt,
      int_rate: intRate,
      emi: emi,
      total_moi: totalMoi,
      total_int_amt: totalIntAmt,
      selected_tenure: selectedTenure,
      is_month_selected: monthSelected,
      tenure_year: tenureYear,
      tenure_month: tenureMonth,
      loan_amt_slider_selected: loanAmtSliderSelected
    })
  }

  function renderLoanAmount() {
    return <FormControl fullWidth className={classes.margin} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-amount">Loan Amount</InputLabel>
      <OutlinedInput
        className="home-loan-text-box"
        id={props.loan_type + '-loan-amount'}
        value={loan_amt_input_value}
        onChange={(e) => handleInputChange(e, 'loan_amt')}
        startAdornment={<InputAdornment position="start">&#8377;</InputAdornment>}
        labelWidth={95}
        margin={"dense"}
      />
      <ThemeProvider theme={muiTheme}>
        <Slider valueLabelDisplay="auto"
                className="loan-slider"
                value={loan_amt_slider_value}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-small-steps"
                step={0.5}
                min={0}
                max={props.max_steps}
                marks={props.marks}
                onChange={handleLoanAmtChange}
        />
      </ThemeProvider>

      <br/>
      <br/>
    </FormControl>;
  }

  function renderInterestRate() {
    let interest_rate_marks = [];
    for (let i = 5; i <= 20; i = i + 2.5) {
      interest_rate_marks.push({value: i, label: i + '%'})
    }
    return <FormControl fullWidth className={classes.margin} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-interest-rate">Interest Rate</InputLabel>
      <OutlinedInput
        className="home-loan-text-box"
        id={props.loan_type + '-interest-rate'}
        value={intRate}
        onChange={(e) => handleInputChange(e, 'int_rate')}
        endAdornment={<InputAdornment position="start">%</InputAdornment>}
        labelWidth={95}
        margin={"dense"}
      />
      <ThemeProvider theme={muiTheme}>
        <Slider
          value={intRate}
          onChange={handleIntRateChange}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-small-steps"
          step={0.1}
          min={5}
          max={20}
          marks={interest_rate_marks}
          valueLabelDisplay="auto"
        />
      </ThemeProvider>
      <br/>
      <br/>
    </FormControl>;
  }

  function renderTenure() {
    let total_tenure = monthSelected ? (props.max_tenure * 12) : props.max_tenure;
    let step_incr = monthSelected ? (props.tenure_steps_inc * 12) : props.tenure_steps_inc;
    let slider_step = monthSelected ? props.tenure_steps[0] : props.tenure_steps[1];
    let tenure_value = monthSelected ? tenureMonth : tenureYear;
    let tenure_label = monthSelected ? 'Mo' : 'Yr';
    let loan_tenure_marks = [];
    for (let i = 0; i <= total_tenure; i = i + step_incr) {
      loan_tenure_marks.push({value: i, label: i});
    }

    return <FormControl fullWidth className={classes.margin} variant="outlined">
      <Grid container>
        <Grid item xs={10}>
          <InputLabel htmlFor="outlined-adornment-loan-tenure">Loan Tenure</InputLabel>
          <OutlinedInput
            className="home-loan-text-box"
            id={props.loan_type + '-loan-tenure'}
            value={tenure_value}
            onChange={(e) => handleInputChange(e, 'tenure')}
            endAdornment={<InputAdornment position="start">{tenure_label}</InputAdornment>}
            labelWidth={95}
            margin={"dense"}
          />
        </Grid>
        <Grid item xs={2}>
          <ToggleButtonGroup
            value={"center"}
            exclusive
            size={"small"}
            aria-label="text alignment"
            onChange={() => {
              setMonthSelected(!monthSelected);
            }}
          >
            <ToggleButton value="month" selected={monthSelected}>Mo</ToggleButton>
            <ToggleButton value="year" selected={!monthSelected}>Yr</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <ThemeProvider theme={muiTheme}>
        <Slider
          value={tenure_value}
          onChange={handleTenureChange}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-small-steps"
          step={slider_step}
          min={0}
          max={total_tenure}
          marks={loan_tenure_marks}
          valueLabelDisplay="auto"
        />
      </ThemeProvider>
      <br/>
      <br/>
    </FormControl>;
  }

  return (
    <div>
      {renderLoanAmount()}
      {renderInterestRate()}
      {renderTenure()}
    </div>
  );
}
