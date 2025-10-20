import React from 'react'
import '../../styles/componentsStyles/footer.css'

function Footer() {
  return (
    <section id='Contact' className='footer-section'
      style={{ height: "100vh" }}>
      <div className='contact-container'>          
        <div className='contact-title'>
          <h1>Contactez-nous</h1>
        </div>
        <div className='contact-form-container'>
          <form className='contact-form'>
            <div className='form-row'>
              <div className='form-field'>
                <label>Saisissez votre nom *</label>
                <input type="text" placeholder="Prénom" />
              </div>
              <div className='form-field'>
                <label>Saisissez votre e-mail *</label>
                <input type="email" placeholder="E-mail" />
              </div>
            </div>
            <div className='form-field full-width'>
              <label>Écrivez votre message ici...</label>
              <textarea placeholder="Message" rows="4"></textarea>
            </div>
            <button type="submit" className='submit-button'>Envoyer</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Footer