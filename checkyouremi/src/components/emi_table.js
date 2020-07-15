import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

class EmiTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emi: props.emi
    }
    this.emi_entries = [];
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.setState({
      emi: this.props.emi
    });
    this.createEMIEntries();
  }

  render() {
    const YearTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: '#efbe00',
        color: theme.palette.common.black,
        fontFamily: 'Titillium Web, Roboto, sans-serif',
        fontSize: 16,
      },
      body: {
        fontSize: 14,
        fontFamily: 'Titillium Web, Roboto, sans-serif',
        fontWeight: 'bold'
      },
    }))(TableCell);

    const MonthTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: '#eee',
        color: theme.palette.common.black,
        fontFamily: 'Titillium Web, Roboto, sans-serif',
        fontSize: 14,
        fontWeight: 'bold'
      },
      body: {
        fontSize: 14,
        fontFamily: 'Titillium Web, Roboto, sans-serif',
      },
    }))(TableCell);

    function Row(props) {
      const {row} = props;
      const [open, setOpen] = React.useState(false);
      let rowClass = (props.counter % 2 === 0) ? 'emi-table-year-row' : 'emi-table-year-row-odd'

      return (
        <React.Fragment>
          <TableRow className={rowClass}>
            <YearTableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
              </IconButton>
            </YearTableCell>
            <YearTableCell component="th" scope="row">{row.year}</YearTableCell>
            <YearTableCell align="right">{row.principal}</YearTableCell>
            <YearTableCell align="right">{row.interest}</YearTableCell>
            <YearTableCell align="right">{row.emi}</YearTableCell>
            <YearTableCell align="right">{row.balance}</YearTableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={2}>
                  <Typography gutterBottom component="div">
                    <Box fontWeight="fontWeightBold">{row.year} Breakdown</Box>
                  </Typography>
                  <Table size="small" aria-label="yearly-emi">
                    <TableHead>
                      <TableRow>
                        <MonthTableCell align="center">Month</MonthTableCell>
                        <MonthTableCell align="right">Principal</MonthTableCell>
                        <MonthTableCell align="right">Interest</MonthTableCell>
                        <MonthTableCell align="right">EMI</MonthTableCell>
                        <MonthTableCell align="right">Balance</MonthTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.month_wise.map((month) => (
                        <TableRow key={month.month_name}>
                          <MonthTableCell align="center">{month.month_name}</MonthTableCell>
                          <MonthTableCell align="right">{month.principal}</MonthTableCell>
                          <MonthTableCell align="right">{month.interest}</MonthTableCell>
                          <MonthTableCell align="right">{month.emi}</MonthTableCell>
                          <MonthTableCell align="right">{month.balance}</MonthTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    }

    Row.propTypes = {
      row: PropTypes.shape({
        principal: PropTypes.number.isRequired,
        interest: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired,
        emi: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired,
        month_wise: PropTypes.array.isRequired
      }).isRequired,
    };

    return (
      <div>
        <h2>EMI Table</h2>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <YearTableCell/>
              <YearTableCell>Year</YearTableCell>
              <YearTableCell align="right">Principal</YearTableCell>
              <YearTableCell align="right">Interest</YearTableCell>
              <YearTableCell align="right">EMI</YearTableCell>
              <YearTableCell align="right">Balance</YearTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.emi_entries.map((row, counter) => (
              <Row key={row.year} row={row} counter={counter}/>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  createEMIEntries() {
    let month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let months = !this.props.is_month_selected ? (this.props.tenure * 12) : this.props.tenure;
    let balance = null;
    let total_months = 12;
    let monthly_ratio = this.props.int_rate / total_months / 100;
    let current_year = new Date().getFullYear();
    let current_month = new Date().getMonth();
    let yearly_emi = 0;
    let yearly_principal = 0;
    let yearly_interest = 0;
    let month_counter = current_month;
    let year_counter = 0;
    let month_wise = [];
    this.emi_entries = [];

    for (let counter = 1; counter <= months; counter++) {
      let p = !balance ? this.props.principal : balance;
      let paid_principal = parseFloat(this.props.emi - (p * monthly_ratio)).toFixed(2);
      let paid_interest = this.props.emi - paid_principal;
      balance = parseFloat(p - paid_principal).toFixed(2);
      month_wise.push({
        principal: parseInt(paid_principal),
        interest: parseInt(paid_interest),
        balance: counter === months ? 0 : Math.floor(balance),
        emi: Math.round(this.props.emi),
        month_name: month_names[month_counter],
      });

      yearly_principal += parseInt(paid_principal);
      yearly_interest += paid_interest;
      yearly_emi += this.props.emi;

      if (month_counter === 11) {
        this.emi_entries.push({
          principal: parseInt(yearly_principal),
          interest: parseInt(yearly_interest),
          balance: counter === months ? 0 : Math.floor(balance),
          emi: Math.round(yearly_emi),
          year: current_year + year_counter,
          month_wise: month_wise
        });
        year_counter += 1;
        month_counter = 0;
        month_wise = [];
      } else {
        month_counter += 1;
      }
    }
  }
}

EmiTable.propTypes = {};

export default EmiTable;