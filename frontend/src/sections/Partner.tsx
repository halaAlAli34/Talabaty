import React, { useState } from 'react';
import '../styles/Partner.css';

const PartnerSection: React.FC = () => {
  const [businessType, setBusinessType] = useState<string>('');

  return (
    <section id="partner-form" className="partner-section container-fluid px-md-5 mt-5 pt-4 pb-3">
      <div className="row align-items-center justify-content-between g-4 g-lg-5">
        
        {/* Left Column Text details */}
        <div className="col-lg-5">
          <span className="text-uppercase fw-bold text-brand-blue tracking-wider small">Grow Your Business</span>
          <h2 className="fw-bold display-6 text-brand-blue mt-2 mb-4">
            Become a Talabaty <br />Partner
          </h2>
          <p className="text-muted mb-4">Join 50+ local businesses already growing with Talabaty across the Bekaa region.</p>
          
          <ul className="list-unstyled d-flex flex-column gap-3 checklist-container">
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Free to join — no setup fees
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Reach thousands of customers in Bekaa
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Manage your own products and pricing
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Track all your orders in real time
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Support from our team every step of the way
            </li>
          </ul>
        </div>

        {/* Right Column Interactive Form Card */}
        <div className="col-lg-6 pe-lg-0 px-3 mt-4 mt-lg-0">
          <div className="custom-form-card p-4 rounded-4 shadow-sm border">
            <h4 className="fw-bold text-brand-blue mb-1">Partner application</h4>
            <p className="text-muted small mb-4">Fill in your info and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label-custom">Business Name</label>
                <input type="text" className="form-control custom-input" placeholder="e.g. Beit El Mouneh" />
              </div>
              
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Owner Full Name</label>
                  <input type="text" className="form-control custom-input" placeholder="Full name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Phone Number</label>
                  <input type="text" className="form-control custom-input" placeholder="+961 ... ... ..." />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Email Address</label>
                <input type="email" className="form-control custom-input" placeholder="business@example.com" />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Business Type</label>
                  <select 
                    className="form-select custom-input text-muted"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    <option value="" disabled hidden>Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="clothes_store">Clothes Store</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Location (Town)</label>
                  <input type="text" className="form-control custom-input" placeholder="e.g. Zahle, Chtaura" />
                </div>
              </div>

              {businessType === 'other' && (
                <div className="mb-3 animate-fade-in">
                  <label className="form-label-custom">Please specify business type</label>
                  <input 
                    type="text" 
                    className="form-control custom-input" 
                    placeholder="e.g. Bakery, Flower Shop..." 
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label-custom">Tell us about your business</label>
                <textarea className="form-control custom-input" rows={3} placeholder="Brief description of what you sell..."></textarea>
              </div>

              <button type="submit" className="btn btn-partner-submit w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2">
                Submit application <i className="bi bi-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PartnerSection;