/**
 * WebGLChecker - Utility for detecting WebGL availability
 * Requirements: 1.9 - IF WebGL is not available in the user's browser, 
 *                      THE Confession_Website SHALL display a fallback message
 */

export class WebGLChecker {
  /**
   * Check if WebGL is available in the browser
   * @returns true if WebGL or WebGL2 is available, false otherwise
   */
  static isAvailable(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      return gl !== null
    } catch (e) {
      return false
    }
  }

  /**
   * Get GPU renderer info for debugging/support
   * @returns GPU renderer and vendor strings, or null if unavailable
   */
  static getGPUInfo(): { renderer: string; vendor: string } | null {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      
      if (!gl) {
        return null
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (!debugInfo) {
        return null
      }

      return {
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown',
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown'
      }
    } catch (e) {
      return null
    }
  }
}
