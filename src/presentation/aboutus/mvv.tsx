import React from "react";

const MVV = () => (
  <div className="informative" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
    <div className="home-fb-card expertise-card">
      <h2 style={{ textAlign: 'center' }}>Mission Statement</h2>
      <p style={{ textAlign: 'justify' }}>
        Drive our Clients' success with “Best in Class” training, auditing, and consulting in sterilization, continuous improvement, and quality management systems, ensuring their processes are efficient, safe, and fully compliant.
      </p>
      <h2 style={{ textAlign: 'center' }}>Vision Statement</h2>
      <p style={{ textAlign: 'justify' }}>
        To be the “Best in Class” partner for our Clients, delivering tailored solutions that ensure compliance, safety, and efficiency, driving their success.
      </p>
      <h2 style={{ textAlign: 'center' }}>Values</h2>
      <ol>
        <li>
          <strong>Integrity</strong>
          <ol type="i">
            <li><strong>Trust Building:</strong> Integrity fosters trust among employees, customers, and stakeholders, which is crucial for long-term relationships.</li>
            <li><strong>Reputation:</strong> A company known for its integrity is likely to attract and retain clients and employees.</li>
            <li><strong>Decision Making:</strong> Integrity ensures that decisions are made based on ethical considerations, leading to sustainable business practices.</li>
          </ol>
        </li>
        <li>
          <strong>Accountability</strong>
          <ol type="i">
            <li><strong>Performance Improvement:</strong> Accountability drives individuals and teams to perform better, knowing they are responsible for their outcomes.</li>
            <li><strong>Trust:</strong> Builds trust with stakeholders, as they see the organization as reliable and responsible.</li>
          </ol>
        </li>
        <li>
          <strong>Excellence</strong>
          <ol type="i">
            <li><strong>Competitive Advantage:</strong> Excellence sets a company apart from its competitors by delivering superior products and services.</li>
            <li><strong>Customer Satisfaction:</strong> High standards of excellence lead to greater customer satisfaction and loyalty.</li>
          </ol>
        </li>
      </ol>
    </div>
  </div>
);

export default MVV;