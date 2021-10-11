let isDragging = false;

function on(element, event, handler) {
  if (element && event && handler) {
    element?.addEventListener(event, handler, false)
  }
}

function off(element, event, handler) {
  if (element && event && handler) {
    element?.removeEventListener(event, handler, false)
  }
}

export default function (element, options) {
  const moveFn = function (event) {
    options.drag?.(event)
  }

  const upFn = function (event) {
    off(globalThis.document, "mousemove", moveFn);
    off(globalThis.document, "mouseup", upFn);
    globalThis.document.onselectstart = null;
    globalThis.document.ondragstart = null;
    isDragging = false;
    options.end?.(event);
  }

  on(element, "mousedown", function (event) {
    if (isDragging) {
      return;
    }
    globalThis.document.onselectstart = () => false;
    globalThis.document.ondragstart = () => false;
    on(globalThis.document, "mousemove", moveFn);
    on(globalThis.document, "mouseup", upFn);
    isDragging = true;
    options.start?.(event);
  })
}
