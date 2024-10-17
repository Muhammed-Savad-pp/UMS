import React from 'react'
import Header from '../../../components/Header'
import './Home.css' 

export default function Home() {
  return (
    <div>
      <Header /> 
      <div className="home-background">
        <div style={{ color: 'white', fontSize: '4rem' }}>WELCOME...</div>
      </div>
    </div>
  )
}
