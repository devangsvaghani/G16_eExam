import React from 'react'
import Loader from '../assets/loader.gif'
import './Loading.css'

function Loding() {
  return (
    <div className='loading-container'>
      <img src={Loader} alt="" className='loading-background'/>
      <div class="loader"></div>
    </div>
  )
}

export default Loding
