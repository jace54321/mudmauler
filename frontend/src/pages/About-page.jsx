import React from "react";
import "../styles/About-page.css";
import heroBanner from "../assets/magic.png";
import tireProduct from "../assets/tire-product.png";
import Footer from "../components/Footer"; // Import the shared Footer component

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <img src={heroBanner} alt="Off-road vehicles" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-gradient" />
        <div className="hero-content">
          <div className="hero-title-box">
            <h1 className="hero-title">About Us</h1>
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="section section-dark">
        <div className="container">
          <div className="grid-two-col">
            <div className="fade-in">
              <h2 className="section-title">Company Profile</h2>
              <div className="text-content">
                <p>
                  Mudmauler Performance Tires is a premier manufacturer and distributor
                  of high-performance off-road tires, serving adventure enthusiasts and
                  commercial operators across the nation.
                </p>
                <p>
                  Our complete product line includes mud terrain, all-terrain, and
                  highway tires designed for passenger vehicles, light trucks,
                  commercial trucks, and heavy-duty applications.
                </p>
                <p>
                  Since our establishment in 2019, Mudmauler has built an extensive
                  dealer network throughout the country, partnering with trusted
                  tire dealers and automotive specialists in every major region.
                </p>
                <p>
                  We are also a trusted supplier of original equipment tires to
                  vehicle manufacturers and fleet operators nationwide.
                </p>
              </div>
            </div>
            <div className="fade-in delay-1">
              <img src={tireProduct} alt="Mudmauler tire" className="product-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section section-darker">
        <div className="container">
          <div className="philosophy-content fade-in">
            <h2 className="section-title">Our Philosophy</h2>
            <p className="philosophy-text">
              Mudmauler aims to be the leading off-road tire brand, known for our
              exceptional quality products, unwavering commitment to customer
              satisfaction, and deep understanding of what adventurers and
              professionals truly need. We don't just meet expectations—we exceed them.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-dark">
        <div className="container">
          <div className="values-grid">
            {[
              {
                title: "Quality",
                description: "Every tire undergoes rigorous testing to ensure maximum durability and performance in the toughest conditions."
              },
              {
                title: "Innovation",
                description: "We continuously invest in R&D to develop cutting-edge tread patterns and rubber compounds."
              },
              {
                title: "Trust",
                description: "Built on decades of reliability, our reputation speaks through every mile our customers travel."
              }
            ].map((item, index) => (
              <div key={item.title} className={`value-card fade-in delay-${index + 1}`}>
                <h3 className="value-title">{item.title}</h3>
                <p className="value-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Replaced old Footer with the Component */}
      <Footer />
    </div>
  );
};

export default AboutPage;