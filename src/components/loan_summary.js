import React from 'react';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

export default function LoanSummary(props) {

  function formatCurrency(value) {
    value = Math.trunc(value);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value).replace(/\D00$/, '');
  }

  return (
    <div>
      <Grid container className='loan-summary' justify={"center"}>
        <Grid container justify={"space-between"}>
          <Grid item>Principal</Grid>
          <Grid item>{formatCurrency(props.principal)}</Grid>
        </Grid>
        <Grid container justify={"space-between"}>
          <Grid item>Total Interest</Grid>
          <Grid item>{formatCurrency(props.total_int_amt)}</Grid>
        </Grid>
        <Grid container justify={"space-between"}>
          <Grid item>Total Duration</Grid>
          <Grid item>{props.tenure_months} mon / {props.tenure_months / 12} year</Grid>
        </Grid>
        <Divider className='home-loan-divider'/>
        <Grid container className='total-payment' justify={"space-between"}>
          <Grid item>Total Payment</Grid>
          <Grid item>{formatCurrency(props.total_moi)}</Grid>
        </Grid>
      </Grid>
    </div>
  );
}
