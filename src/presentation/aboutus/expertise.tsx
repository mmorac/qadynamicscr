import React from "react";

const Expertise = () => (
  <div className="informative" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
    <div className="home-fb-card expertise-card">
      <h2 style={{ textAlign: 'center' }}>Our Expertise</h2>
      <p style={{ textAlign: 'justify' }}>
        With more than 13 years of experience, QA Dynamics CR ensures the efficiency, safety, and regulatory compliance of your processes.
      </p>
      <p style={{ textAlign: 'justify' }}>
        Our team brings deep industry knowledge and a proven track record in delivering tailored solutions for sterilization, quality management, and continuous improvement. We partner with organizations of all sizes to address unique challenges, implement best practices, and achieve sustainable results. Trust QA Dynamics CR to be your reliable advisor in navigating complex regulatory landscapes and driving operational excellence.
      </p>
      <img src="/img/alonso_angulo.jpg" alt="Alonso Angulo" className="expertise-img" />
    </div>
  </div>
);

export default Expertise;