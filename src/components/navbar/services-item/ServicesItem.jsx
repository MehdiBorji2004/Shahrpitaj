import { NavLink } from "react-router-dom";
import "./services-item.css";
import UseAdminData from '../../../hooks/UseAdminData.jsx'
import { useEffect } from "react";

const ServicesItem = ({ setIsClicked }) => {
  const {getServices, servicesList} = UseAdminData();

  useEffect(() => {
    getServices();
  }, []);

  return (
    <ul className="services-list">
      {servicesList.map((service, index) => {
        return (
          <li
            key={index}
            className="services-item"
            onClick={() => setIsClicked(false)}
          >
            <NavLink
              to={service.servicePath}
              style={({ isActive }) => {
                return {
                  color: isActive ? "white" : "black",
                  backgroundColor: isActive ? "var(--bs-color-bg)" : "",
                };
              }}
            >
              {service.serviceName}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default ServicesItem;
