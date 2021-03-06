import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
// import axios from "axios";

function ConstraintList({ constraints, ...props }) {
  console.log("rendering constraints..");
  const [constraintList, setConstraintList] = useState(Object.entries(constraints));
  
  const toggleSort = (type) => {
    switch (type) {
      case 'id': console.log(constraintList); break;
      default: console.log("Sorting... invalid type");
    }
  }

  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>
            Constraint ID
            <FontAwesomeIcon icon={Icons.faSort} className="ml-1" onClick={() => toggleSort("id")} />
          </th>
          <th>Business Name</th>
          <th>Business Address</th>
          <th>Business Phone Number</th>
          <th>Number of Drivers</th>
          <th>
            <p style={{borderBottom: "1px solid lightgrey"}}>Distance per Driver</p>
            <MinMax />
          </th>
          <th>
            <p style={{borderBottom: "1px solid lightgrey"}}>Time per Driver</p>
            <MinMax />
          </th>
          <th>
            <p style={{borderBottom: "1px solid lightgrey"}}>Number of Deliveries</p>
            <MinMax />
          </th>
        </tr>
      </thead>
      <tbody>
        {constraintList.map((constraint, index) => (
          <VehicleItem
            key={index}
            index={index}
            constraint={constraint[1]}
            business_id={constraint[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function MinMax() {
  return (
    <div className="level has-text-light-weight has-text-weight-light">
      <div
        className="level-left is-split">
        <div className="level-item">Min</div>
      </div>
      <div className="level-right is-split">
        <div className="level-item">Max</div>
      </div>
    </div>
  );
}

function VehicleItem({ constraint, business_id, ...props }) {
  // const [hidden, setHidden] = useState(true);
  const address = `${constraint.business_street}${(constraint.business_unit ? ` ${constraint.business_unit}` : "")} 
                   ${constraint.business_city} ${constraint.business_state} ${constraint.business_zip}`;;
  // console.log(constraint);
  
  return (
    <tr>
      <td>{business_id}</td>
      <td>{constraint.business_name}</td>
      <td>{address}</td>
      <td>{constraint.business_phone}</td>
      <td>{constraint.num_drivers}</td>
      <td>
        <div className="level">
          <span className="level-item is-split left">{constraint.min_distance || "N/A"}</span>
          <span className="level-item is-split">{constraint.max_distance || "N/A"}</span>  
        </div>  
      </td>
      <td>
        <div className="level">
          <span className="level-item is-split left">{constraint.min_time || "N/A"}</span>
          <span className="level-item is-split">{constraint.max_time || "N/A"}</span>  
        </div>  
      </td>
      <td>
        <div className="level">
          <span className="level-item is-split left">{constraint.min_deliveries || "N/A"}</span>
          <span className="level-item is-split">{constraint.max_deliveries || "N/A"}</span>  
        </div>  
      </td>
      {/* <td><InputValue /></td>
      <td><InputValue value={constraint.driver_count} hasRange /></td>
      <td><InputValue value={constraint.time_per_driver} hasRange /></td>
      <td><InputValue value={constraint.delivery_count} hasRange /></td> */}
    </tr>
  );
}

// function InputValue(props) {
//   return (
//     <React.Fragment>
//       {props.hasRange ? (
//         <InputRange min={props.value} max={props.value} />
//       ) : (
//         <input className="input is-small has-text-centered" style={{ width: "50px" }} value={props.value} onChange={(e) => console.log(e)} />
//       )}
//     </React.Fragment>
//   );
// }

// function InputRange(props) {
//   // console.log("rendering ranges..");
//   return (
//     <div className={"level has-text-light-weight" + (props.isHeader ? " has-text-weight-light" : "")}>
//       <div
//         className="level-left is-split">
//         <div className="level-item">
//           <input className="input is-small has-text-centered" style={{ width: "50px" }} value={props.min} onChange={(e) => console.log(e)} />
//         </div>
//       </div>
//       <div className="level-right is-split">
//         <div className="level-item">
//           <input className="input is-small has-text-centered" style={{ width: "50px" }} value={props.max} onChange={(e) => console.log(e)} />
//         </div>
//       </div>
//     </div>
//   );
// }

export default ConstraintList;
  