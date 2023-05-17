import React from 'react'
import PromptCollection from '../../collections/PromptCollection'
import Txt2ImageComponent from '../../components/Txt2ImageComponent/Txt2ImageComponent'

export default function Playground() {
  const randomPrompt = PromptCollection[Math.floor(Math.random() * PromptCollection.length)].prompt
  return (
    <div>
        <Txt2ImageComponent prompt={randomPrompt}/>
    </div>
  )
}
