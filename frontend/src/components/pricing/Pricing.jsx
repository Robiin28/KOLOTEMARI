import React from "react"
import Title from "../common/title/title"
import PriceCard from "./PriceCard"
import "./price.css"

export const Pricing = () => {
  return (
    <>
      <Title title='Choose The Right Plan' />
      <section className='price padding'>
        <div className='container grid'>
          <PriceCard />
        </div>
      </section>
     
    </>
  )
}