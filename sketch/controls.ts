// https://www.demo2s.com/javascript/javascript-p5-js-zoom-in-out-at-mouse-position-in-canvas.html

interface View {
  x: number;
  y: number;
  zoom: number;
  zoomStep: number;
}

interface ViewPos {
  prevX?: number;
  prevY?: number;
  isDragging: boolean;
}

class Controls {
  private readonly _viewPos: ViewPos;
  private readonly _lerpedView: View;
  private readonly _view: View;

  constructor() {
    this._view = {
      x: 0,
      y: 0,
      zoom: 1,
      zoomStep: 1,
    };

    this._lerpedView = {
      x: 0,
      y: 0,
      zoom: 1,
      zoomStep: 1,
    };

    this._viewPos = {
      isDragging: false,
    };
  }

  public update = () => {
    this._view.x = lerp(this._view.x, this._lerpedView.x, 0.1);
    this._view.y = lerp(this._view.y, this._lerpedView.y, 0.1);
    this._view.zoom = lerp(this._view.zoom, this._lerpedView.zoom, 0.1);
  };

  public mousePressed = (event: MouseEvent) => {
    this._viewPos.isDragging = true;
    this._viewPos.prevX = event.clientX;
    this._viewPos.prevY = event.clientY;
  };

  public mouseDragged = (event: MouseEvent) => {
    if (!this._viewPos.isDragging) return;

    if (this._viewPos.prevX || this._viewPos.prevY) {
      const dx = event.clientX - this._viewPos.prevX;
      const dy = event.clientY - this._viewPos.prevY;
      this._lerpedView.x += dx;
      this._lerpedView.y += dy;

      this._viewPos.prevX = event.clientX;
      this._viewPos.prevY = event.clientY;
    }
  };

  public mouseReleased = () => {
    this._viewPos.isDragging = false;
    this._viewPos.prevX = null;
    this._viewPos.prevY = null;
  };

  public mouseWheel = (event: WheelEvent) => {
    const direction = event.deltaY > 0 ? -1 : 1;

    const easedZoom = this.cssCubicBezier(
      0.83,
      0.0,
      0.17,
      1.0,
      this._view.zoomStep
    ).y;
    let zoom = Math.max(easedZoom * 0.3, 0.05) * direction;

    const wx = (event.x - this._lerpedView.x) / (width * this._lerpedView.zoom);
    const wy =
      (event.y - this._lerpedView.y) / (height * this._lerpedView.zoom);
    this._lerpedView.x -= wx * width * zoom;
    this._lerpedView.y -= wy * height * zoom;

    this._lerpedView.zoom += zoom;
    this._lerpedView.zoomStep -= direction * 0.01;
  };

  public cssCubicBezier = (
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    t: number
  ): p5.Vector => {
    const y =
      3 * Math.pow(1 - t, 2) * t * p1y +
      3 * (1 - t) * Math.pow(t, 2) * p2y +
      Math.pow(t, 3);
    const x =
      3 * Math.pow(1 - t, 2) * t * p1x +
      3 * (1 - t) * Math.pow(t, 2) * p2x +
      Math.pow(t, 3);
    return createVector(x, y);
  };

  get view(): View {
    return this._view;
  }
}
