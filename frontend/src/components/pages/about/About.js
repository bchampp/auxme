import React from 'react';
import Image from '../../elements/Image';
import FeaturesTiles from './FeaturesTiles';
import Cta from './Cta';
import FeaturesSplit from './FeaturesSplit';

const About = () => {
    return (
        <div style={{paddingTop: "200px"}} className="hero section center-content illustration-section-01">
            <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
              <Image
                className="has-shadow"
                src={require('./../../../assets/images/lightshow.jpg')}
                alt="Hero"
                width={896}
                height={504} />
        <FeaturesTiles />
      <Cta split />
          </div>
        </div>
    )
}

export default About;