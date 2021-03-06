import React from 'react';
import './home.css'
import './emi_table'
import Grid from '@material-ui/core/Grid';
import EmiTable from "./emi_table";
import EmiPieChart from "./emi_pie_chart";
import LoanSummary from "./loan_summary";
import LoanForm from "./loan_form";

export default function Home() {
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

  let loan_form_props = {
    loan_type: 'home',
    marks: loan_amount_marks,
    max_steps: max_steps,
    initial_principal: loanAmt,
    int_rate: intRate,
    multiplier: multiplier,
    tenure_year: tenureYear,
    tenure_months: tenureMonth,
    max_tenure: 30,
    tenure_steps: [6, 1],
    tenure_steps_inc: 5
  };

  function handleFormChange(state) {
    setLoanAmt(state.loan_amt);
    setIntRate(state.int_rate);
    setEmi(state.emi);
    setTotalMoi(state.total_moi);
    setTotalIntAmt(state.total_int_amt);
    setSelectedTenure(state.selected_tenure);
    setMonthSelected(state.is_month_selected);
    setTenureYear(state.tenure_year);
    setTenureMonth(state.tenure_month);
    setLoanAmtSliderSelected(state.loan_amt_slider_selected);
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid container item xs={10}>
          <Grid item className="home-loan-calc-widget-container" md>
            <h2>EMI Calculator for Home Loan</h2>
            <LoanForm {...loan_form_props} handler={handleFormChange}/>
            <EmiTable {...emi_props}/>
          </Grid>
          <Grid item className="home-loan-summary-container" md>
            <EmiPieChart {...emi_props}/>
            <LoanSummary {...emi_props}/>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}