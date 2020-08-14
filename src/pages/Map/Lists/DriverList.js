import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import Rating from '@material-ui/lab/Rating';
// import axios from "axios";

function DriverList({ drivers, routes, props }) {
  console.log("rendering drivers..");
  
  return (
    <React.Fragment>
      {Object.entries(drivers).map((driver, index) => (
        <DriverItem
          key={index}
          props={{
            driver: driver[1],
            id: driver[0],
            routes: routes,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function DriverItem({ props }) {
  const [hidden, setHidden] = useState(true);

//   const sendDriverText = (driverNumber) => {
//     console.log(`Sending Driver ${driverNumber} a text..`);
//   };

//   const skipLocation = (locationNumber) => {
//     console.log(`Skipping Location ${locationNumber}..`);
//   };

//   const changeLocation = (locationNumber) => {
//     console.log(`Editing Location ${locationNumber}..`);
//   };

//   const sendConfirmationText = (locationNumber) => {
//     console.log(`Sending Location ${locationNumber} a text..`);
//   };

//   const sendConfirmationEmail = (locationNumber) => {
//     console.log(`Sending Location ${locationNumber} an email..`);
//   };

  return (
    <div className="box list-item">
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr className="list-item-head">
            <th>
              <span>Driver {props.id}: {`${props.driver.first_name} ${props.driver.last_name}`}</span>
            </th>
            <th>
              <Rating defaultValue={props.driver.rating} size="small" precision={0.25} readOnly />
              <span className="ml-4">Rating</span>
            </th>
            <th />
            <th />
            <th>
              <button
                className="button is-super-small is-pulled-right ml-4"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
              <button
                className="button is-rounded is-pulled-right is-super-small ml-1"
                // onClick={() => sendEmail(idx + 1)}
              >
                <FontAwesomeIcon icon={Icons.faEnvelope} />
              </button>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <button
                className="button is-rounded is-pulled-right is-super-small"
                // onClick={() => sendText(idx + 1)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
              </button>
              {/* <button
                className="button is-rounded is-super-small mx-1"
                // onClick={() => sendText(idx + 1)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
              </button>
              <button
                className="button is-rounded is-super-small mx-1"
                // onClick={() => sendEmail(idx + 1)}
              >
                <FontAwesomeIcon icon={Icons.faEnvelope} />
              </button> */}
            </th>
          </tr>
        </thead>
        <tbody className="is-bordered has-text-centered" hidden={hidden}>
          <tr>
            {/* <Combining2CellsInto1> */}
              <td className="pr-0" style={{ borderRightWidth: 0 }}>
                  First Name
                  <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
                  Last Name
              </td>
              <td className="pl-0 has-text-left" style={{ borderLeftWidth: 0 }}>
                  <p className="ml-2">{props.driver.first_name}</p>
                  <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
                  <p className="ml-2">{props.driver.last_name}</p>
              </td>
            {/* </Combining2CellsInto1> */}
            <td>
                Hours/week<br />{props.driver.weekly_workload}
            </td>
            <td>
                Driver's License<br />{props.driver.drivers_license}
            </td>
            <td>
                Expiration<br />{props.driver.expiration}
            </td>
          </tr>
          <tr>
            <td>
                Rating<br />{props.driver.rating}
            </td>
            <td>
                SSN<br />{props.driver.ssn}
            </td>
            <td>
                Preferred Routes<br />{props.driver.preferred_routes}
            </td>
            <td>
                Days Available<br />{props.driver.day_availability}
            </td>
            <td>
                Times Available<br />{props.driver.time_availability}
            </td>
          </tr>
          <tr>
            <td>
              Insurance Number<br />{props.driver.insurance_number}
            </td>
            <td>
              Driver Password<br />{props.driver.password}
            </td>
            <td>
              Business ID<br />{props.driver.business_id}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DriverList;
