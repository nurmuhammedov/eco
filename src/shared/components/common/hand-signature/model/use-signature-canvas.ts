import { useCallback, useRef, useState } from 'react'

export interface SignaturePoint {
  x: number
  y: number
  pressure: number
  time: number
}

export type SignatureStroke = SignaturePoint[]

interface UseSignatureCanvasOptions {
  minWidth?: number
  maxWidth?: number
  color?: string
  outputWidth?: number
  outputHeight?: number
}

const DEFAULTS = {
  minWidth: 1.2,
  maxWidth: 3.2,
  color: '#0F172A',
  outputWidth: 480,
  outputHeight: 144,
}

const distance = (a: SignaturePoint, b: SignaturePoint) => Math.hypot(b.x - a.x, b.y - a.y)

export function useSignatureCanvas(options: UseSignatureCanvasOptions = {}) {
  const { minWidth, maxWidth, color, outputWidth, outputHeight } = { ...DEFAULTS, ...options }

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const strokesRef = useRef<SignatureStroke[]>([])
  const activeStrokeRef = useRef<SignatureStroke | null>(null)
  const lastWidthRef = useRef(maxWidth)
  const pointerIdRef = useRef<number | null>(null)

  const [isEmpty, setIsEmpty] = useState(true)

  const getContext = useCallback(() => canvasRef.current?.getContext('2d') ?? null, [])

  const computeWidth = useCallback(
    (from: SignaturePoint, to: SignaturePoint) => {
      const elapsed = Math.max(to.time - from.time, 1)
      const velocity = distance(from, to) / elapsed
      const target = Math.max(maxWidth - velocity * 2.2, minWidth)
      const smoothed = target * 0.3 + lastWidthRef.current * 0.7
      lastWidthRef.current = smoothed
      const pressure = to.pressure > 0 ? to.pressure : 0.5
      return smoothed * (0.6 + pressure * 0.8)
    },
    [maxWidth, minWidth]
  )

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: SignatureStroke, scale = 1, offsetX = 0, offsetY = 0) => {
      if (stroke.length === 0) return

      ctx.strokeStyle = color
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (stroke.length === 1) {
        const point = stroke[0]
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc((point.x - offsetX) * scale, (point.y - offsetY) * scale, (maxWidth / 2) * scale, 0, Math.PI * 2)
        ctx.fill()
        return
      }

      lastWidthRef.current = maxWidth
      for (let index = 1; index < stroke.length; index++) {
        const from = stroke[index - 1]
        const to = stroke[index]
        const previous = stroke[index - 2] ?? from
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        const previousMidX = (previous.x + from.x) / 2
        const previousMidY = (previous.y + from.y) / 2

        ctx.lineWidth = computeWidth(from, to) * scale
        ctx.beginPath()
        ctx.moveTo((previousMidX - offsetX) * scale, (previousMidY - offsetY) * scale)
        ctx.quadraticCurveTo(
          (from.x - offsetX) * scale,
          (from.y - offsetY) * scale,
          (midX - offsetX) * scale,
          (midY - offsetY) * scale
        )
        ctx.stroke()
      }
    },
    [color, computeWidth, maxWidth]
  )

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return

    const ratio = window.devicePixelRatio || 1
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(ratio, ratio)

    strokesRef.current.forEach((stroke) => drawStroke(ctx, stroke))
    if (activeStrokeRef.current) drawStroke(ctx, activeStrokeRef.current)
  }, [drawStroke, getContext])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ratio = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (width === 0 || height === 0) return

    const nextWidth = Math.round(width * ratio)
    const nextHeight = Math.round(height * ratio)
    if (canvas.width === nextWidth && canvas.height === nextHeight) return

    canvas.width = nextWidth
    canvas.height = nextHeight
    redraw()
  }, [redraw])

  const setCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      canvasRef.current = node
      if (!node) return

      resizeCanvas()
      const observer = new ResizeObserver(resizeCanvas)
      observer.observe(node)
      observerRef.current = observer
    },
    [resizeCanvas]
  )

  const pointFromEvent = useCallback((event: React.PointerEvent<HTMLCanvasElement>): SignaturePoint => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pointerType === 'pen' ? event.pressure : 0.5,
      time: event.timeStamp,
    }
  }, [])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!event.isPrimary) return
      event.currentTarget.setPointerCapture(event.pointerId)
      pointerIdRef.current = event.pointerId
      lastWidthRef.current = maxWidth
      activeStrokeRef.current = [pointFromEvent(event)]
      redraw()
    },
    [maxWidth, pointFromEvent, redraw]
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const stroke = activeStrokeRef.current
      if (!stroke || pointerIdRef.current !== event.pointerId) return

      const point = pointFromEvent(event)
      if (distance(stroke[stroke.length - 1], point) < 1) return

      stroke.push(point)
      redraw()
    },
    [pointFromEvent, redraw]
  )

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (pointerIdRef.current !== event.pointerId) return
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      const stroke = activeStrokeRef.current
      pointerIdRef.current = null
      activeStrokeRef.current = null
      if (!stroke || stroke.length === 0) return

      strokesRef.current = [...strokesRef.current, stroke]
      setIsEmpty(false)
      redraw()
    },
    [redraw]
  )

  const clear = useCallback(() => {
    strokesRef.current = []
    activeStrokeRef.current = null
    setIsEmpty(true)
    redraw()
  }, [redraw])

  const undo = useCallback(() => {
    strokesRef.current = strokesRef.current.slice(0, -1)
    setIsEmpty(strokesRef.current.length === 0)
    redraw()
  }, [redraw])

  const toPngBase64 = useCallback((): string | null => {
    const strokes = strokesRef.current
    if (strokes.length === 0) return null

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    strokes.forEach((stroke) =>
      stroke.forEach((point) => {
        if (point.x < minX) minX = point.x
        if (point.y < minY) minY = point.y
        if (point.x > maxX) maxX = point.x
        if (point.y > maxY) maxY = point.y
      })
    )

    const padding = maxWidth * 2
    const sourceWidth = Math.max(maxX - minX + padding * 2, 1)
    const sourceHeight = Math.max(maxY - minY + padding * 2, 1)

    const target = document.createElement('canvas')
    target.width = outputWidth
    target.height = outputHeight

    const ctx = target.getContext('2d')
    if (!ctx) return null

    const scale = Math.min(outputWidth / sourceWidth, outputHeight / sourceHeight)
    const offsetX = minX - padding - (outputWidth / scale - sourceWidth) / 2
    const offsetY = minY - padding - (outputHeight / scale - sourceHeight) / 2

    strokes.forEach((stroke) => drawStroke(ctx, stroke, scale, offsetX, offsetY))

    return target.toDataURL('image/png').split(',')[1] ?? null
  }, [drawStroke, maxWidth, outputHeight, outputWidth])

  return {
    canvasRef: setCanvasRef,
    isEmpty,
    clear,
    undo,
    toPngBase64,
    canvasHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  }
}
