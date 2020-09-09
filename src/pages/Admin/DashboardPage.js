import React, { useState, useReducer, useEffect } from "react";

import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import LeafletMap from "./LeafletMap";
import DeliveryList from "./Lists/DeliveryList";
import DriverList from "./Lists/DriverList";
import BusinessList from "./Lists/BusinessList";
import CustomerList from "./Lists/CustomerList";
import VehicleList from "./Lists/VehicleList";
import OrderList from "./Lists/OrderList";
import PaymentList from "./Lists/PaymentList";
import CouponList from "./Lists/CouponList";
import ConstraintList from "./Lists/ConstraintList";
import DeliveryView from "./DeliveryView";
import AppIcon from "utils/Icons/app_icon.png";
// import axios from "axios";
// created another file for functions that load data from server, since this file was getting too large for my liking,
// should I stick to this or revert this change?
import { 
  createRoutes, 
  createDrivers, 
  createBusinesses, 
  createCustomers, 
  createOrders 
} from "utils/Functions/DataFunctions";

const initState = {
  isLoading: true,
  filter: undefined, // { type: "routes", option: "business_id", value: "200-00001" }
  routes: {},
  routes_dates: [],
  routes_times: [],
  drivers: {},
  businesses: {},
  customers: {},
  vehicles: {},
  orders: {},
  payments: {},
  coupons: {},
  constraints: {},
};

function reducer(state, action) {
  switch(action.type) {
    case 'load':
      let routes_dates = [];
      let routes_times = ['1', '2', '3', '4', '5']; // NOTE: TEMP

      for (let route of Object.values(action.payload.data.routes)) {
        route["Business Name"] = action.payload.data.businesses[route.business_id] ? action.payload.data.businesses[route.business_id].name : null;
        route["Driver Name"] = action.payload.data.drivers[route.driver_id] ? action.payload.data.drivers[route.driver_id].first_name + ' ' + action.payload.data.drivers[route.driver_id].last_name : null;
        
        if (!routes_dates.includes(route.date)) routes_dates.push(route.date);
        // SAME THING BUT FOR TIMES
      }

      // more loops needed for future situations where object x requires object y's data
      return {
        ...state, 
        ...action.payload.data,
        routes_dates,
        routes_times,
      };
    case 'filter':
      return {
        ...state,
        filter: action.payload.filter,
      };
    // case 'filter-routes':
    //   let routes = { ...state.routes };
    //   for (let key of Object.keys(routes)) {
    //     routes[key].visible = action.payload.keys.includes(key) ? true : false; 
    //   }
    //   return {
    //     ...state,
    //     routes,
    //   };
    case 'toggle-visibility':
      return { 
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.id]: {
            ...state[action.payload.type][action.payload.id],
            visible: !state[action.payload.type][action.payload.id].visible,
          }
        }
      };
    case 'update-route-drivers':
      let newRoutes = { ...state.routes };
      const routeDrivers = Object.entries(action.payload.route_drivers);
      routeDrivers.forEach(entry => {
        newRoutes[entry[0]] = { ...state.routes[entry[0]], driver_id: entry[1].id, "Driver Name": entry[1].name }
      });
      console.log(newRoutes);
      return {
        ...state,
        routes: newRoutes,
        // routes: {
        //   ...state.routes,
        //   ...routeDrivers.map(entry => {
        //     return {
        //       [entry[0]]: {
        //         ...state.routes[entry[0]],
        //         driver_id: entry[1],
        //       }
        //     };
        //   })
        // },
      }; 
    default:
      return state;
  }
}

// object of empty items for testing display
const testObj = { 0: {}, 1: {}, 2: {} };

function DashboardPage() {
  console.log("rendering page..");

  // possibly use this with useContext, figure out how to reduce rerenders upon data change
  const [data, dispatch] = useReducer(reducer, initState);
  console.log(data);
  // const [times, setTimes] = useState([
  //   { value: "00 am - 00 pm" },
  //   { value: "01 am - 01 pm" },
  //   { value: "02 am - 02 pm" },
  //   { value: "03 am - 03 pm" },
  //   { value: "04 am - 04 pm" },
  // ]); // useState(GET_ROUTE_TIMES)
  // const [dates, setDates] = useState([]);
  
  // useEffect(() => {
  //   if (Object.values(data.routes).length) setDates(() => {
  //     let datesArray = [];
  //     for (let route of Object.values(data.routes)) {
  //       if (!datesArray.includes(route.date)) datesArray.push(route.date);
  //     }
  //     return datesArray;
  //   });
  // }, [data.routes])

  const [timeSlot, setTimeSlot] = useState(Number(window.localStorage.getItem("timeSlot")) || 0); 
  const [dateSlot, setDateSlot] = useState(Number(window.localStorage.getItem("dateSlot")) || 0);
  const [headerTab, setHeaderTab] = useState(Number(window.localStorage.getItem("headerTab")) || 0); 
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    window.localStorage.setItem("headerTab", headerTab);
  }, [headerTab]);

  useEffect(() => {
    window.localStorage.setItem("timeSlot", timeSlot);
  }, [timeSlot]);

  useEffect(() => {
    window.localStorage.setItem("dateSlot", dateSlot);
  }, [dateSlot]);

  useEffect(() => {
    Promise.allSettled([
      createRoutes(),
      createDrivers(),
      createBusinesses(),
      createCustomers(),
      createOrders(),
    ])
    .then((result) => {
      const data = {
        isLoading: false,
        ...result[0].value && { routes: result[0].value },
        ...result[1].value && { drivers: result[1].value },
        ...result[2].value && { businesses: result[2].value },
        ...result[3].value && { customers: result[3].value },
        vehicles: testObj, // FIXME: CALL API
        ...result[4].value && { orders: result[4].value },
        payments: testObj,
        coupons: testObj,
        constraints: testObj, // FIXME: CALL API
      };
      dispatch({ type: "load", payload: { data } });
    });
  }, []);

  const handleBurger = (onItemSelect=false) => {
    console.log("Burger interaction..");

    const element = document.getElementById("selections");
    if (onItemSelect) {
      element.style.display = "none";
    } else {
      element.style.display =
        element.style.display === "block" ? "none" : "block";
    }
  };

  const [onView, setOnView] = useState("none");
  const handleView = (type) => {
    console.log("Open day view..");

    handleBurger(true);
    setOnView(onView === type ? "none" : type);
    // open day view modal
  };

  const handleHeaderTab = () => {
    // might as well also handle time/date slots here!
    if (timeSlot && (
        Math.floor(timeSlot) !== timeSlot || 
        timeSlot < 0 || 
        timeSlot > data.routes_times.length - 1)) {
      setTimeSlot(0);
    }
    if (dateSlot && (
      Math.floor(dateSlot) !== dateSlot || 
      dateSlot < 0 || 
      dateSlot > data.routes_dates.length - 1)) {
    setDateSlot(0);
  }

    switch (headerTab) {
      case 0:
        return (
          <DeliveryList
            routes={data.routes}
            drivers={data.drivers}
            filter={data.filter}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            dispatch={dispatch}
          />
        );
      case 1:
        return (
          <DriverList
            drivers={data.drivers}
            routes={data.routes} // for creating route preferences, probably
            filter={data.filter}
            dispatch={dispatch}
          />
        );
      case 2:
        return (
          <BusinessList 
            businesses={data.businesses}
            filter={data.filter}
            dispatch={dispatch}
          />
        );
      case 3:
        return (
          <CustomerList 
            customers={data.customers}
            filter={data.filter}
            dispatch={dispatch}
          />
        );
      case 4:
        return (
          <VehicleList 
            vehicles={data.vehicles}
          />
        );
      case 5:
        return (
          <OrderList 
            orders={data.orders}
          />
        );
      case 6:
        return (
          <PaymentList
            payments={data.payments}
          />
        );
      case 7:
        return (
          <CouponList
            coupons={data.coupons}
          />
        )
      case 8:
        return (
          <ConstraintList
            constraints={data.constraints}
          />
        );
      default:
        setHeaderTab(0);
    }
  };

  return (
    <React.Fragment>
      <Header 
        tab={headerTab}
        changeTab={setHeaderTab}
        handleBurger={handleBurger} 
        handleDayView={() => handleView("day")}
        handleWeekView={() => handleView("week")}
        dispatch={dispatch}
      />
      {/* Views */}
      <DeliveryView
        type="day"
        times={data.routes_times}
        timeSlot={timeSlot}
        visible={onView === "day"}
        onClick={() => handleView("day")}
      />
      <DeliveryView
        type="week"
        // times={times}
        visible={onView === "week"}
        onClick={() => handleView("week")}
      />
      {data.isLoading ? (
        <div className="loading-screen" />
      ) : (
        <div className="map-page">
          <div className="columns" style={{ margin: "auto" }}>
            {headerTab < 4 && (
              <div className="column is-half" style={{ padding: "0" }}>
                <RouteTimes
                  times={data.routes_times}
                  dates={data.routes_dates}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  dateSlot={dateSlot}
                  setDateSlot={setDateSlot}
                />
                <div className="sticky">
                  <LeafletMap
                    header={headerTab}
                    routes={data.routes}
                    drivers={data.drivers}
                    businesses={data.businesses}
                    customers={data.customers}
                    filter={data.filter}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    dispatch={dispatch}
                  />
                </div>
              </div>
            )}
            <div
              className={"column" + (headerTab < 4 ? " is-half" : " is-full")}
              style={{ padding: "0 0.75rem"/*, marginTop: (headerTab < 4 ? "" : "1vh")*/ }}
            >
              <FilterDropdown data={data} header={headerTab} dispatch={dispatch} />
              <div className={"box" + (headerTab < 4 ? " map" : " no-map")}>
                {handleHeaderTab()}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function Header(props) {
  console.log("rendering header..");
  const tabs = ["Delivery", "Drivers", "Businesses", "Customers", "Vehicles", "Purchases", "Payments", "Coupons", "Constraints"];

  const handleTabChange = (index) => {
    if (props.tab !== index) {
      props.dispatch({ type: "filter", payload: { filter: undefined } });
      props.changeTab(index);
    }
  }

  return (
    <div className="header-parent">
      <div className="header-main">
        <img
          className="has-text-left"
          src={AppIcon}
          alt="Just Delivered"
          style={{ alignSelf: "center", maxHeight: "5vh" }}
        />
        <h1
          className="has-text-centered"
          style={{ width: "100%", fontSize: "3vh" }}
        >
          ADMIN DASHBOARD
        </h1>
        {tabs.map((value, index) => (
          <button 
            key={index} 
            className="button is-lightgrey is-sharp is-tilted-right header-button"
            onClick={() => handleTabChange(index)}
            style={{ backgroundColor: props.tab === index && "yellow" }}
          >
            {value}
          </button>
        ))}
        <button
          className="button is-white is-fullheight ml-2"
          onClick={() => props.handleBurger()}
        >
          <FontAwesomeIcon icon={Icons.faBars} />
        </button>
      </div>
      <ul id="selections" className="header-burger">
        <li>
          <button
            className="button is-white is-fullwidth"
            onClick={props.handleDayView}
          >
            Day View
          </button>
        </li>
        <li>
          <button
            className="button is-white is-fullwidth"
            onClick={props.handleWeekView}
          >
            Week View
          </button>
        </li>
      </ul>
    </div>
  );
}

function RouteTimes(props) {
  console.log("rendering times..");

  const [open, setOpen] = useState({ date: false, time: false });

  const handleTimeChange = (index) => {
    // console.log(index);
    if (props.timeSlot !== index) props.setTimeSlot(index);
    setOpen(prevOpen => ({ ...prevOpen, time: false }));
  };

  const handleDateChange = (index) => {
    // console.log(index);
    if (props.dateSlot !== index) props.setDateSlot(index);
    setOpen(prevOpen => ({ ...prevOpen, date: false }));
  };

  return (
    <div className="columns routes" style={{ margin: 0 }}>
      <div className="column">
        {/* <span style={{ verticalAlign: "middle" }}>Selected Date:</span> */}
        <div className={"dropdown ml-2" + (open.date ? " is-active" : "")}>
          <div className="dropdown-trigger">
            <button className="button is-small is-fullwidth" onClick={() => setOpen(prevOpen => ({ ...prevOpen, date: !prevOpen.date }))} aria-haspopup="true" aria-controls="dropdown-menu">
              Date: {props.dates.length ? props.dates[0] : 'NONE'}
              <FontAwesomeIcon icon={Icons.faCaretDown} className= "ml-2" />
            </button>
          </div>
          <div className="dropdown-menu" style={{ paddingTop: 0 }} id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {props.dates.map((date, index) => (
                <button key={index} className="button is-small is-white dropdown-item" onClick={() => handleDateChange(index)}>{date}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        {/* <span style={{ verticalAlign: "middle" }}>Selected Time:</span> */}
        <div className={"dropdown ml-2" + (open.time ? " is-active" : "")}>
          <div className="dropdown-trigger">
            <button className="button is-small" onClick={() => setOpen(prevOpen => ({ ...prevOpen, time: !prevOpen.time }))} aria-haspopup="true" aria-controls="dropdown-menu">
              Time: {props.times.length ? props.times[props.timeSlot]: 'NONE'}
              <FontAwesomeIcon icon={Icons.faCaretDown} className= "ml-2" />
            </button>
          </div>
          <div className="dropdown-menu" style={{ paddingTop: 0 }} id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {props.times.map((time, index) => (
                <button key={index} className="button is-small is-white dropdown-item" onClick={() => handleTimeChange(index)}>{time}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ data, header, ...props }) {
  const [open, setOpen] = useState(false);
  const [dataType, setDataType] = useState();
  const [filterItems, setFilterItems] = useState([]);

  useEffect(() => {
    let type;
    switch(header) {
      case 0: 
        setFilterItems(['Business Name'/*, 'Driver Name'*/]); // add other filter values for each header
        type = data.routes; break;
      case 1: 
        type = data.drivers; break;
      case 2: 
        type = data.businesses; break;
      case 3: 
        type = data.customers; break;
      case 4: 
        type = data.vehicles; break;
      case 5: 
        type = data.orders; break;
      case 6: 
        type = data.payments; break;
      case 7: 
        type = data.coupons; break;
      case 8: 
        type = data.constraints; break;
      default: break;
    }
    // console.log(type);
    // if (data.filter) props.dispatch({ type: "filter", payload: { filter: undefined } });
    if (document.getElementById("filter-value").value) document.getElementById("filter-value").value = "";
    setDataType(type);
    // handleHeaderChange();
  }, [header]);

  // const handleHeaderChange = () => {
  //   let filterItems;
  //   switch (header) {
  //     case 0: 
  //       filterItems = [
  //         'Business Name'
  //       ]; break;
  //     // other cases
  //     default: filterItems = []; break;
  //   }
  //   setFilterItems(filterItems);
  // }

  const handleFilter = (option) => {
    // console.log(option);
    if (option) {
      console.log(Object.keys(data)[header + 2]); // get name of data type, +2 is for ignoring isLoading and filter keys
      const type = Object.keys(data)[header + 2];
      const filter = {
        type,
        option,
        value: undefined,
      };
      console.log(filter);
      props.dispatch({ type: "filter", payload: { filter } });
    }
    else { props.dispatch({ type: "filter", payload: { filter: undefined } }); }
    if (document.getElementById("filter-value").value) document.getElementById("filter-value").value = "";
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(document.getElementById("filter-value").value);
    if (document.getElementById("filter-value").value) {
      const filter = {
        ...data.filter,
        value: document.getElementById("filter-value").value,
      }
      props.dispatch({ type: "filter", payload: { filter } });
    }
  };

  return (
    <div className="level" style={{ height: "5vh", margin: 0, justifyContent: "end" }}>
      <div className="level-item" style={{ flexGrow: 0 }}>
        <div className={"dropdown" + (open ? " is-active" : "")}>
          <div className="dropdown-trigger">
            <button className="button is-small" onClick={() => setOpen(prevOpen => !prevOpen)} aria-haspopup="true" aria-controls="dropdown-menu">
              <span>Filter: {data.filter ? data.filter.option : "NONE"}</span>
              <FontAwesomeIcon icon={Icons.faCaretDown} className= "ml-2" />
            </button>
          </div>
          <div className="dropdown-menu" style={{ paddingTop: 0 }} id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <button className="button is-small is-white dropdown-item" disabled={!data.filter} onClick={() => handleFilter()}>NONE</button>
              <hr className="dropdown-divider" />
              {dataType && Object.keys(Object.values(dataType)[0]).map((option, index) => (
                <React.Fragment key={index}>
                  {filterItems.includes(option) && (
                    <button className="button is-small is-white dropdown-item" disabled={data.filter && data.filter.option === option} onClick={() => handleFilter(option)}>{option}</button>
                  )}
                </React.Fragment>
              ))}
              {/* {filterItems && filterItems.map((item, index) => (
                <button key={index} className="button is-small is-white dropdown-item" onClick={() => handleFilter(item)}>{item}</button>
              ))} */}
            </div>
          </div>
        </div>
      </div>
      <div className="level-item" style={{ flexGrow: 0 }}>
        <form onSubmit={handleSubmit}>
          <div className="level">
            <div className="level-item px-2">
              <input className="input is-small" id="filter-value" type="text" disabled={!data.filter} />
            </div>
            <div className="level-item">
              <button className="button is-small" type="submit" disabled={!data.filter}>
                <FontAwesomeIcon icon={Icons.faCheck} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DashboardPage;
