import React, { useState, useEffect} from "react";
import PropTypes from "prop-types";

import styles from "./CustomerStatus.module.scss";


const carStatus = [
  "Booked",
  "Queue",
  "Repairs",
  "Finished",
  "Picked"
];

const CustomerCarStatus = ({ bookingData }) => {
  const currentStatus = bookingData.apptStatus.text;
  const pickupTime = bookingData.pickup_time;
  const pickupDate = bookingData.pickup_date;
  const priceUpdate = bookingData.price;
  // initialProgress is at the active stage circle
  // finalProgress is at the next stage circle
  // this way the progress bar moves between active and next stage
  const initialProgress = (100 / (carStatus.length - 1)) * (bookingData.apptStatus.id - 1);
  const finalProgress = (100 / (carStatus.length - 1)) * bookingData.apptStatus.id;
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    let time;
    // if the apptStatus is the last one, keep progress at 100, not moving
    if (initialProgress === 100) {
      setProgress(100);
    } else {
      time = setTimeout(() => {
        if (initialProgress < 100) {
          let nextProgress = progress + 1;
          if (nextProgress >= finalProgress){
            nextProgress = initialProgress;
          }
          setProgress(nextProgress);
        }
      }, 200);
    }
    return () => {
      clearTimeout(time);
    };
  }, [progress, bookingData.apptStatus]);
  

  const circleStyle = (carIndex) => {
    const index = carStatus.findIndex((car) => car === currentStatus);
    if(index >= carIndex) return {"backgroundColor":"#c13f48"};
  };

  return (
    <div className={styles.container}>  
      <div className={styles.timeline}>
        <div className={styles.bar} style={{ width: `${progress}%`}}/>
        <div className={styles.timelineItems}>
          {carStatus.map((state, index) => {
            return (
              <div key={index} className={styles.circle} style={circleStyle(index)}>
                <div className={styles.stage}>
                  {state}
                </div>
              </div>
            );
          })
          } 
        </div>        
      </div> 
      <div className={styles.estimate}>
        { (pickupDate || pickupTime) === "" ? 
          <p>Estimated pickup time not yet available</p> 
          : 
          <p> Estimated pickup: <strong>{pickupDate}</strong>, at <strong>{pickupTime}</strong> </p>  
        }
      </div>
      <div className={styles.estimate}>
        { priceUpdate === "" ? 
          <p>Estimated price not yet available</p>
          : 
          <p> Estimated price is now: <strong>{priceUpdate}</strong> </p>  
        }
      </div>
    </div>
  );
};

CustomerCarStatus.propTypes = {
  bookingData: PropTypes.object
};

export default CustomerCarStatus;
