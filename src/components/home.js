import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import './home.css'
import './emi_table'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import EmiTable from "./emi_table";
import EmiPieChart from "./emi_pie_chart";
import LoanSummary from "./loan_summary";

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

export default function Home() {
  const classes = useStyles({});
  const [loanAmt, setLoanAmt] = React.useState(1000000);
  const [loanAmtSliderSelected, setLoanAmtSliderSelected] = React.useState(false);
  const [intRate, setIntRate] = React.useState(8.8);
  const [monthSelected, setMonthSelected] = React.useState(false);
  const [tenureYear, setTenureYear] = React.useState(20);
  const [tenureMonth, setTenureMonth] = React.useState(240);
  const [selectedTenure, setSelectedTenure] = React.useState(tenureMonth);
  const [emi, setEmi] = React.useState(0);
  const [totalIntAmt, setTotalIntAmt] = React.useState(0);
  const [totalMoi, setTotalMoi] = React.useState(0);

  let max_steps = 200;
  let multiplier = 100000;
  let loan_amt_input_value = loanAmtSliderSelected ? (loanAmt * multiplier) : loanAmt;
  let loan_amt_slider_value = !loanAmtSliderSelected ? (loanAmt / multiplier) : loanAmt;

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
      }
    }
  };

  useEffect(() => {
    calculateEMI();
  });

  function calculateEMI() {
    let principal = loanAmtSliderSelected ? (loanAmt * multiplier) : loanAmt;
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
  }

  function renderLoanAmount() {
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
        value: max_steps,
        label: '2Cr',
      }
    ];
    return <FormControl fullWidth className={classes.margin} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-amount">Loan Amount</InputLabel>
      <OutlinedInput
        className="home-loan-text-box"
        id="outlined-adornment-amount"
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
                max={max_steps}
                marks={loan_amount_marks}
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
        id="outlined-adornment-interest-rate"
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
    let total_tenure = monthSelected ? 360 : 30;
    let step_incr = monthSelected ? 60 : 5;
    let slider_step = monthSelected ? 6 : 1;
    let slider_max = monthSelected ? 360 : 30;
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
            id="outlined-adornment-loan-tenure"
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
          max={slider_max}
          marks={loan_tenure_marks}
          valueLabelDisplay="auto"
        />
      </ThemeProvider>
      <br/>
      <br/>
    </FormControl>;
  }

  let emi_props = {
    principal: loan_amt_input_value,
    emi: emi,
    int_rate: intRate,
    is_month_selected: monthSelected,
    tenure: monthSelected ? tenureMonth : tenureYear,
    tenure_months: selectedTenure,
    total_int_amt: totalIntAmt,
    total_moi: totalMoi
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item xs={10}>
          <Grid item className="home-loan-calc-widget-container" md>
            <h2>EMI Calculator for Home Loan</h2>
            {renderLoanAmount()}
            {renderInterestRate()}
            {renderTenure()}
            <EmiTable {...emi_props}/>
          </Grid>

          <Grid item className="home-loan-summary-container" md>
            <EmiPieChart {...emi_props}/>
            <LoanSummary {...emi_props}/>
          </Grid>
        </Grid>

        <Grid item md>
          <Paper className={classes.paper}>Ad</Paper>
        </Grid>
      </Grid>
    </div>
  );
}