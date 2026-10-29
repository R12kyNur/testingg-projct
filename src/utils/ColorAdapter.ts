import * as THREE from 'three'

/**
 * ColorAdapter - Utility for shifting colors to pink theme
 * Requirements: 2.1-2.6 - Pink color theme adaptation
 */

export interface ColorAdaptationConfig {
  targetHueRange: [number, number]  // 300-340 degrees (pink)
  minSaturation: number              // 0.3 - 0.9
  contrastRatio: number              // 3:1 minimum
  preserveLuminance: boolean         // true
}

export interface ColorMapping {
  original: { r: number; g: number; b: number }
  adapted: { r: number; g: number; b: number }
  hueShift: number
}

export class ColorAdapter {
  private config: ColorAdaptationConfig

  constructor(config?: Partial<ColorAdaptationConfig>) {
    this.config = {
      targetHueRange: config?.targetHueRange ?? [300, 340],
      minSaturation: config?.minSaturation ?? 0.3,
      contrastRatio: config?.contrastRatio ?? 3,
      preserveLuminance: config?.preserveLuminance ?? true,
    }
  }

  /**
   * Shift hue of a THREE.Color to target pink range
   * @param color - Original color
   * @param targetHue - Target hue in degrees (0-360)
   * @param preserveLuminance - Whether to preserve luminance
   * @returns Adapted color
   */
  shiftHue(color: THREE.Color, targetHue: number, preserveLuminance: boolean = true): THREE.Color {
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    
    // Convert target hue to normalized value (0-1)
    const targetHueNormalized = targetHue / 360
    
    // Create new color with shifted hue
    const adapted = new THREE.Color()
    adapted.setHSL(targetHueNormalized, hsl.s, preserveLuminance ? hsl.l : hsl.l)
    
    return adapted
  }

  /**
   * Adapt a color to pink theme
   * Shifts cool colors (cyan/blue) to pink range
   * @param color - Original color
   * @returns Adapted color in pink spectrum
   */
  adaptToPink(color: THREE.Color): THREE.Color {
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    
    const hueDegrees = hsl.h * 360
    
    // Shift cool colors (180-240 degrees) to pink (300-340 degrees)
    if (hueDegrees >= 180 && hueDegrees <= 240) {
      // Map 180-240 to 300-340
      const normalizedPosition = (hueDegrees - 180) / 60 // 0 to 1
      const targetHue = 300 + normalizedPosition * 40    // 300 to 340
      return this.shiftHue(color, targetHue, this.config.preserveLuminance)
    }
    
    // Shift near-red/magenta colors to pink range
    if (hueDegrees >= 270 && hueDegrees <= 360) {
      const targetHue = Math.max(this.config.targetHueRange[0], 
                                  Math.min(this.config.targetHueRange[1], hueDegrees))
      return this.shiftHue(color, targetHue, this.config.preserveLuminance)
    }
    
    // For warm colors (orange/yellow), add pink undertones
    if (hueDegrees >= 0 && hueDegrees < 60) {
      // Shift slightly towards pink
      const targetHue = this.config.targetHueRange[0] + 10
      return this.shiftHue(color, targetHue, this.config.preserveLuminance)
    }
    
    // Return original color for other ranges
    return color.clone()
  }

  /**
   * Validate contrast ratio between two colors
   * Requirements: 2.5 - minimum 3:1 contrast ratio
   * @param foreground - Foreground color
   * @param background - Background color
   * @returns Contrast ratio
   */
  calculateContrastRatio(foreground: THREE.Color, background: THREE.Color): number {
    const fgLuminance = this.getLuminance(foreground)
    const bgLuminance = this.getLuminance(background)
    
    const lighter = Math.max(fgLuminance, bgLuminance)
    const darker = Math.min(fgLuminance, bgLuminance)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Get relative luminance of a color
   * @param color - THREE.Color
   * @returns Luminance value (0-1)
   */
  private getLuminance(color: THREE.Color): number {
    const r = color.r
    const g = color.g
    const b = color.b
    
    // Convert to sRGB
    const srgb = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    // Calculate luminance
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
  }

  /**
   * Check if a color is within the target pink hue range
   * @param color - Color to check
   * @returns true if color is in pink range
   */
  isPinkHue(color: THREE.Color): boolean {
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    
    const hueDegrees = hsl.h * 360
    return hueDegrees >= this.config.targetHueRange[0] && 
           hueDegrees <= this.config.targetHueRange[1]
  }
}

// Default instance with pink theme configuration
export const defaultColorAdapter = new ColorAdapter({
  targetHueRange: [300, 340],
  minSaturation: 0.3,
  contrastRatio: 3,
  preserveLuminance: true,
})
