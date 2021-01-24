import React from "react";
import FeaturesTiles from "./FeaturesTiles";

const About = () => {
  return (
    <div
      style={{ paddingTop: "100px" }}
      className="hero section center-content illustration-section-01"
    >
      <div
        className="hero-figure reveal-from-bottom illustration-element-01"
        data-reveal-value="20px"
        data-reveal-delay="800"
      >
        <FeaturesTiles />
      </div>
    </div>
  );
};

export default About;
