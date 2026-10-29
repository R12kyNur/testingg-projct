import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { ColorAdapter, defaultColorAdapter } from '../utils/ColorAdapter'

describe('ColorAdapter', () => {
  it('should shift blue hue to pink hue', () => {
    const blue = new THREE.Color(0x0088ff) // hue ~210°
    const pink = defaultColorAdapter.shiftHue(blue, 320, true)
    const hsl = { h: 0, s: 0, l: 0 }
    pink.getHSL(hsl)
    
    const hueDegrees = hsl.h * 360
    expect(hueDegrees).toBeGreaterThanOrEqual(300)
    expect(hueDegrees).toBeLessThanOrEqual(340)
  })

  it('should preserve luminance during hue shift', () => {
    const original = new THREE.Color(0x53838f)
    const originalHSL = { h: 0, s: 0, l: 0 }
    original.getHSL(originalHSL)
    
    const adapted = defaultColorAdapter.shiftHue(original, 320, true)
    const adaptedHSL = { h: 0, s: 0, l: 0 }
    adapted.getHSL(adaptedHSL)
    
    expect(Math.abs(originalHSL.l - adaptedHSL.l)).toBeLessThan(0.1)
  })

  it('should adapt cool colors to pink', () => {
    const cyan = new THREE.Color(0x00ffff) // hue 180°
    const pink = defaultColorAdapter.adaptToPink(cyan)
    
    expect(defaultColorAdapter.isPinkHue(pink)).toBe(true)
  })

  it('should calculate contrast ratio correctly', () => {
    const white = new THREE.Color(0xffffff)
    const black = new THREE.Color(0x000000)
    
    const ratio = defaultColorAdapter.calculateContrastRatio(white, black)
    expect(ratio).toBeGreaterThan(20) // Should be 21:1 for pure white/black
  })

  it('should identify pink hues correctly', () => {
    const pink = new THREE.Color(0xff69b4) // Hot pink
    expect(defaultColorAdapter.isPinkHue(pink)).toBe(true)
    
    const blue = new THREE.Color(0x0000ff)
    expect(defaultColorAdapter.isPinkHue(blue)).toBe(false)
  })
})
