import React from "react"
import Title from "../common/title/title"
import TeamCard from "./TeamCard"
import "./team.css"

import "../About/about.css"

export const Team = () => {
  return (
    <>
      <Title title='Team' />
      <section className='team padding'>
        <div className='container grid22'>
          <TeamCard />
        </div>
      </section>
    
    </>
  )
}
