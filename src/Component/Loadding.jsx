import React from 'react'
import style from '../assets/css/Loadding.module.css'
export default function Loadding() {
  return (
    <div className={`${style["overload"]}`}>
      <span className={`${style["loader"]}`}></span>
    </div>
  )
}
