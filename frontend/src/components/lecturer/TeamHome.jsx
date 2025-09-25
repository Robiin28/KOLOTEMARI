import React from 'react';
import { TeamCardHome } from './TeamCardHome';

export const TeamHome = () => {
  return (
    <>
      <section className='team padding'>
     
    <div className='sect'> 
       <h1>Professional staff</h1>
       <p>A wonderful serenity has taken possession of my entire soul, like these sweet mornings
       of spring which I enjoy with my whole heart.</p>
    </div> 
     
     
        <div className='container grid22'>
       
          <TeamCardHome />
        </div>
      </section>
      
    </>
  )
}
