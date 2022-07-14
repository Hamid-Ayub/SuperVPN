import Layout from "@app/components/layout";
import React from "react";
import css from 'styled-jsx/css'
import moment from "moment";
import {
  PieChart, Pie, ResponsiveContainer, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area,
} from 'recharts';
import {DatePicker} from "antd";
import {COLORS} from "@app/configs";
import {POST} from "@app/request";
import {connect} from "react-redux";

const styles = css.global`
  .custom-tooltip {
      width: 100px;
      height: fit-content;
      border-radius: 4px;
      padding: 6px;
      background-color: #424242;
      &__title {
        font-size: 9px;
        line-height: 1.56;
        letter-spacing: 1.35px;
        color: #9e9e9e;
      }
      &__content {
        font-size: 13px;
        font-weight: 600;
        line-height: 1.38;
        letter-spacing: 0.3px;
        color: #ffffff;
      }
  }
  .line-custom {
    // border-top: solid 1px #e0e0e0;
    background-color: #fafafa;
    &:nth-child(odd) {
      background-color: #ffffff;
    }
    & > div {
      padding: 12px 16px 10px;
      border-top: solid 1px #e0e0e0;
      border-right: solid 1px #e0e0e0;
    }
    &:last-child {
      border-bottom: solid 1px #e0e0e0;
    }
  }
`

const CustomTooltip = ({active, payload, label}) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        {
          payload?.map((item, index) => (
            <div className="mb-2" key={index}>
              <div className="custom-tooltip__title uppercase">{item?.dataKey}</div>
              <div className="custom-tooltip__content uppercase">{item?.value}</div>
            </div>
          ))
        }
      </div>
    );
  }

  return null;
};

const COLORS2 = ['#89d34f', '#714fff', COLORS.third];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
                                 cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                               }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (percent * 100) > 10 ? (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : '';
};

const renderLegend = (props) => {
  const {payload} = props;

  return (
    <ul className="flex items-center justify-center w-full mt-3">
      {
        payload.map((entry, index) => {
          return (
            <li key={`item-${index}`} className={index < payload.length ? "mr-10" : ""}>
              <div className="flex items-center">
                <div style={{width: 10, height: 10, background: entry?.color, borderRadius: 10}}></div>
                <div className="ml-3">
                  {entry?.value?.split(" ")?.[0] || ""}
                </div>
              </div>
            </li>
          )
        })
      }
    </ul>
  );
}

const Index = ({ global: { user }, ...props }) => {
  const [dashboardOverview, setOverview] = React.useState({})
  const [users, setUser] = React.useState([])
  const [chartByMonth, setChartByMonth] = React.useState([]);
  const [chartByYear, setChartByYear] = React.useState([]);
  const [pieChart, setPieChart] = React.useState({});
  const [currentYear, setYear] = React.useState(moment());
  const [currentMonth, setMonth] = React.useState(moment());

  React.useEffect(() => {
    POST('/admin/dashboard/overview')
      .then(({data}) => {
        setOverview(data?.data)
      })
      .catch((err) => {
      })
  }, [])

  const onChangeYear = (e) => {
    setYear(e);
    getChartByYear(moment(e).format("DD-MM-YYYY"))
  };

  const onChangeMonth = (e) => {
    setMonth(e);
    getChartByMonth(moment(e).format("DD-MM-YYYY"))
  };

  React.useEffect(() => {
    getChartByMonth()
    getChartByYear()
    getPieChart()
  }, []);

  const getChartByMonth = async (date = moment().format("DD-MM-YYYY")) => {
    const { data: { data } } = await POST('/admin/charts/month',
      {
        date,
        adminId: user?.id
      }, {date});
    setChartByMonth(data);
  };

  const getPieChart = async () => {
    const { data: { data } } = await POST('/admin/charts/pie',
      {
        adminId: user?.id
      });
    setPieChart(data);
  };

  const getChartByYear = async (date = moment().format("DD-MM-YYYY")) => {
    const { data: { data } } = await POST('/admin/charts/year',
      {
        adminId: user?.id
      }, {date});
    setChartByYear(data);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <Layout title="Home">
      <div className="flex">
        <div className="core-card flex-1 mr-4 h-24">
          <div className="pa-10 uppercase second-text-color">today users created</div>
          <div className="title-2 uppercase text-black mt-2">{dashboardOverview?.amountTodayUser}</div>
        </div>
        <div className="core-card flex-1 mr-4 h-24">
          <div className="pa-10 uppercase second-text-color">total of users</div>
          <div className="title-2 uppercase text-black mt-2">{dashboardOverview?.amountUser}</div>
        </div>
        <div className="core-card flex-1 mr-4 h-24">
          <div className="pa-10 uppercase second-text-color">happening servers</div>
          <div className="title-2 uppercase text-black mt-2">{dashboardOverview?.amountServer}</div>
        </div>
        <div className="core-card flex-1 h-24 mr-4">
          <div className="pa-10 uppercase second-text-color">total download</div>
          <div className="title-2 uppercase text-black mt-2">{formatBytes(dashboardOverview?.totalDownload || 0)}</div>
        </div>
        <div className="core-card flex-1 h-24">
          <div className="pa-10 uppercase second-text-color">total upload</div>
          <div className="title-2 uppercase text-black mt-2">{formatBytes(dashboardOverview?.totalUpload || 0)}</div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-4">
        <div className="p-4 w-5/12">
          <div className="core-card w-full p-8" style={{maxHeight: 400}}>
            <div className="font-bold pa-14 text-black mb-4">User Status</div>
            <div className="flex">
              <div style={{width: '100%', height: 300}} className="flex-1 overflow-hidden">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      isAnimationActive={false}
                      innerRadius={0}
                      outerRadius={135}
                      data={pieChart?.chart || []}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {
                        (pieChart?.chart || []).map((entry, index) => <Cell key={`cell-${index}`}
                                                                    fill={COLORS2[index % COLORS2.length]}/>)
                      }
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex items-start justify-end">
                <ul>
                  <li className="mb-4 pa-13 font-medium flex items-center">
                    <div style={{width: 10, height: 10, background: "#89d34f", borderRadius: 10}}></div>
                    <div className="ml-4">
                      <div>Active and unknown:</div>
                      <div>{pieChart?.overview?.free?.total || 0} ({pieChart?.overview?.free?.percent || 0}%)</div>
                    </div>
                  </li>
                  <li className="mb-4 pa-13 font-medium flex items-center">
                    <div style={{width: 10, height: 10, background: "#714fff", borderRadius: 10}}></div>
                    <div className="ml-4">
                      <div>Monthly Subscription:</div>
                      <div>{pieChart?.overview?.monthly?.total || 0} ({pieChart?.overview?.monthly?.percent || 0}%)</div>
                    </div>
                  </li>
                  <li className="mb-4 pa-13 font-medium flex items-center">
                    <div style={{width: 10, height: 10, background: COLORS.third, borderRadius: 10}}></div>
                    <div className="ml-4">
                      <div>Weekly Subscription:</div>
                      <div>{pieChart?.overview?.weekly?.total || 0} ({pieChart?.overview?.weekly?.percent || 0}%)</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 w-7/12">
          <div className="core-card w-full p-8" style={{maxHeight: 400}}>
            <div className="flex items-center justify-between  mb-4">
              <div className="font-bold pa-14 text-black">Active Users</div>
              <DatePicker allowClear={false} picker="year" value={currentYear}
                          onChange={onChangeYear}/>
            </div>
            <div style={{width: '100%', height: 300}} className="flex-1">
              <ResponsiveContainer>
                <BarChart
                  isAnimationActive={false}
                  data={chartByYear}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend content={renderLegend}/>
                  <Bar name="Monthly subscription" dataKey="weekly" stackId="a" fill={COLORS.third}/>
                  <Bar name="Weekly subscription" dataKey="monthly" stackId="a" fill="#714fff"/>
                  <Bar name="Free subscription" dataKey="free" stackId="a" fill="#89d34f"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="core-card w-full p-8" style={{maxHeight: 400}}>
          <div className="flex items-center justify-between  mb-4">
            <div className="font-bold pa-14 text-black">Users by Month</div>
            <DatePicker
              value={currentMonth}
              allowClear={false} picker="month" onChange={onChangeMonth}/>
          </div>
          <div style={{width: '100%', height: 300}} className="flex-1">
            <ResponsiveContainer>
              <AreaChart
                data={chartByMonth}
                margin={{
                  top: 10, right: 30, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area stackId="name" dot={{stroke: '#714fff', strokeWidth: 4}}
                      type="linear" dataKey="value" stroke="#714fff"
                      fill="rgba(113, 79, 255, 0.2)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </Layout>
  )
}

export default connect(state => state)(Index)
