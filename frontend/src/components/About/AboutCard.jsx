import React from "react"
import Heading from "../common/Heading"
import "./about.css"

import Awrapper from "./Awrapper"

const AboutCard = () => {
  return (
    <>
     <div className="container" >
     <div className="aboutt">
        <h1>Welcome to our site</h1>
        <p>We provide long standing experience for online teaching and learning by highly 
        experienced instructors, for students who want to deepen their knowledge.          <br/>
        School is live 24 hours everyday with full tutoring, refresher courses for those in need.
        Online quizzes and exams. Pursue your academic and professional goals 
        by taking online courses on a schedule that fits your convenience.</p>
      </div>
      </div>
      <section className='aboutHomes'>
   
        
        <div className='container flexSB'>
          <div className='rights row'>
            <Heading subtitle='LEARN ANYTHING' 
            title='Benefits About Online Learning Expertise' />
            <div className='items'>
                  <div className='item flexSB'>
                    {/* <div className="box"> */}
                          <div className='img'>
                            <img src="https://img.icons8.com/dotty/80/000000/storytelling.png" alt='' />
                          </div>
                          <div className='text'>
                            <h2>Online Courses</h2>
                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
                            </p>
                          </div>
                    </div>
                    {/* <div className="box"> */}
                    <div className='item flexSB'>
                          <div className='img'>
                            <img src="https://img.icons8.com/dotty/80/000000/storytelling.png" alt='' />
                          </div>
                          <div className='text'>
                            <h2>Online Courses</h2>
                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
                            </p>
                          </div>
                    </div>
                 
                    {/* <div className="box"> */}
                    <div className='item flexSB'>
                          <div className='img'>
                            <img src="https://img.icons8.com/dotty/80/000000/storytelling.png" alt='' />
                          </div>
                          <div className='text'>
                            <h2>Online Courses</h2>
                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
                            </p>
                          </div>
                    {/* </div> */}
                  </div>
                
            </div>
          </div>
        </div>
      </section>
      <Awrapper />
    </>
  )
}
export default AboutCard