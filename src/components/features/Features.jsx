import "./features.css";

const Features = ({ data }) => {
  const featuresData = data;
  return (
    <>
      {featuresData?.map((item, index) => {
        return (
          <div key={index} className="col-4 feature px-0">
            <div className="feature-icon">{item.icon}</div>
            <div className="feature-text">
              <span className="feature-text-title">{item.name}</span>
              <span className="feature-text-subtitle">{item.subName}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Features;
