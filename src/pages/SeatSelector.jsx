import React from 'react'
import SeatSelectorPage from '../components/SeatSelectorPage'
import PageTransition from '../components/PageTransition'


const SeatSelector = () => {
  return (
    <div>
      <PageTransition>
        <SeatSelectorPage />
      </PageTransition>
    </div>
  )
}

export default SeatSelector
