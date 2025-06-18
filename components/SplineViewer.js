'use client'

import Spline from '@splinetool/react-spline'

export default function SplineViewer({ url }) {
  return (
    <Spline scene={url} />
  )
}