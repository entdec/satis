const debounce = (func, wait = 500) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

const getInitialTheme = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme")
    if (typeof storedPrefs === "string") {
      return storedPrefs
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)")
    if (userMedia.matches) {
      return "dark"
    }
  }

  // If you want to use dark theme as the default, return 'dark' instead
  return "light"
}

const popperSameWidth = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`
  },
}

const isPointInsideElement = (element, clientX, clientY, options= null)=> {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return false
  options = Object.assign({ bufferSize: 0}, options)

  const bounds = element.getBoundingClientRect()
  let insideBounds =
    (clientX >= bounds.left - options.bufferSize) && (clientX < bounds.right + options.bufferSize) &&
    (clientY >= bounds.top - options.bufferSize) && (clientY < bounds.bottom + options.bufferSize)

  if (!insideBounds) {
    const elements = document.elementsFromPoint(clientX, clientY)
    for (let i = 0; i < elements.length; i++) {
      const childElement = elements[i]
      if(childElement.style.display === 'none' || childElement.style.visibility === 'hidden' || childElement.style.opacity === '0') continue;
      insideBounds = element === childElement || element.contains(childElement)
      if (insideBounds){
        break
      }
    }
  }
  return insideBounds
}

export { debounce, getInitialTheme, popperSameWidth, isPointInsideElement }
