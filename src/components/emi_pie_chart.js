import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Cell, Pie, PieChart, Sector} from "recharts";

export default function EmiPieChart(props) {
  const [graphActiveIndex, setGraphActiveIndex] = React.useState(0);
  const emi = props.emi;
  const data = [{name: 'Interest', value: props.total_int_amt}, {name: 'Principal', value: props.principal}];
  const COLORS = ['#FFBB28', '#FF8042'];

  function formatCurrency(value) {
    value = Math.trunc(value);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value).replace(/\D00$/, '');
  }

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 30;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={-30} textAnchor="middle" fontSize={18} fill="#999" fontWeight='bold'>EMI</text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fontSize={25} fontWeight='bold'>{formatCurrency(emi)}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} dy={ey - 18} textAnchor={textAnchor} fill="#999" fontSize={12}
              overflow='visible'>{payload.name}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
              fill="#333">{`${(percent * 100).toFixed(2)}%`}</text>
      </g>
    );
  };

  function onPieEnter(obj, index) {
    setGraphActiveIndex(index)
  }

  return (
    <div>
      <Grid container justify={"center"}>
        <PieChart width={450} height={380}>
          <Pie
            data={data}
            dataKey="value"
            onMouseEnter={onPieEnter}
            activeIndex={graphActiveIndex}
            activeShape={renderActiveShape}
            labelLine={false}
            cy={196}
            startAngle={360}
            endAngle={0}
            innerRadius={80}
          >
            {
              data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
            }
          </Pie>
        </PieChart>

      </Grid>

    </div>
  );
}
