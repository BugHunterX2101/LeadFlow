import { useEffect, useRef, useCallback } from 'react'

export function Modal({ title, onClose, children, className = '' }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Update ref without causing re-render
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const handleBackdropClick = useCallback(() => {
    onCloseRef.current()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.focus()
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <div
        className={`modal-panel ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex="-1"
        ref={panelRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}