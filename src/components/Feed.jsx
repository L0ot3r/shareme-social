import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import { MasonryLayout, Spinner } from './'


const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState([])
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    if(categoryId) {
      const query = searchQuery(categoryId)

      client.fetch(query).then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [categoryId])

  if(loading) return <Spinner message='Nous ajoutons de nouvelles idées à votre fil !' />

  if(!pins?.length) return <h2 className='text-center mt-7 text-3xl font-bold'>Il n'y rien à vous montrer ici 😕</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed