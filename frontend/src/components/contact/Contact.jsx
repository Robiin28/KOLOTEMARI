import React from "react";
import Back from "../common/title/title";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faDribbble } from '@fortawesome/free-brands-svg-icons';
import "./contact.css";

export const Contact = () => {
  const map = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d325.9875742583212!2d38.75896363079387!3d9.035300501766267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f71ce36828d%3A0x547df70116d2afd9!2sDenver%20Boutique%20Hotel!5e0!3m2!1sam!2set!4v1721387488882!5m2!1sam!2set";

  return (
    <>
      <Back title='Contact us' />
      <section className='contacts padding'>
        <div className='container shadow flexSB'>
          <div className='mapContainer'>
            <iframe src={map} title="Google Map" className="map"></iframe>
          </div>
          <div className='rightContact'>
            <h1>Contact us</h1>
            <p>We're open for any suggestion or just to have a chat</p>

            <div className='items grid22'>
              <div className='box'>
                <h4>ADDRESS:</h4>
                <p>ARAT Kilo, Adwa Set, Denver Boutique Hotel, 3rd floor</p>
              </div>
              <div className='box'>
                <h4>EMAIL:</h4>
                <p>KoloTemari@gmail.com</p>
              </div>
              <div className='box'>
                <h4>PHONE:</h4>
                <p>+251 986991447</p>
              </div>
            </div>

            <form action=''>
              <div className='flexSB'>
                <input type='text' placeholder='Name' />
                <input type='email' placeholder='Email' />
              </div>
              <input type='text' placeholder='Subject' />
              <textarea cols='30' rows='10' placeholder='Create a message here...'></textarea>
              <button className='primary-btn'>SEND MESSAGE</button>
            </form>

            <h3 className="headContact">Follow us here</h3>
            <div className='social-icons'>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faDribbble} /></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
