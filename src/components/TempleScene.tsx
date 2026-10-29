import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

/**
 * TempleScene - Three.js scene wrapper component
 * Requirements: 1.1, 1.2 - Load and display TempleNightScene with Three.js r149
 */

export interface TempleSceneProps {
  onLoadComplete?: () => void
  onLoadProgress?: (progress: number) => void
  onLoadError?: (error: Error) => void
  onFPSUpdate?: (fps: number) => void
}

export function TempleScene({
  onLoadComplete,
  onLoadProgress,
  onLoadError,
  onFPSUpdate,
}: TempleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    animationId: number
  } | null>(null)
  const lastFrameTime = useRef<number>(0)

  const measureFPS = useCallback(() => {
    if (!sceneRef.current || !onFPSUpdate) return

    const now = performance.now()
    if (lastFrameTime.current > 0) {
      const fps = 1000 / (now - lastFrameTime.current)
      onFPSUpdate(Math.round(fps))
    }
    lastFrameTime.current = now
  }, [onFPSUpdate])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let animationId = 0

    try {
      // Initialize renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2
      container.appendChild(renderer.domElement)

      // Initialize scene and camera
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      )

      // Store references
      sceneRef.current = { renderer, scene, camera, animationId: 0 }

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        measureFPS()
        renderer.render(scene, camera)
      }

      animate()
      onLoadProgress?.(100)
      onLoadComplete?.()

    } catch (error) {
      onLoadError?.(error as Error)
    }

    // Cleanup function
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(animationId)
        sceneRef.current.renderer.dispose()
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
        sceneRef.current = null
      }
    }
  }, [measureFPS, onLoadComplete, onLoadError, onLoadProgress])

  return <div ref={containerRef} className="temple-scene-container" />
}
