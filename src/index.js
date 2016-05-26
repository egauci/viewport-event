import isTouch from 'has-touch';
import EventEmitter from 'events';

class ViewPort extends EventEmitter {
  constructor() {
    super();
    const raf = window.requestAnimationFrame;
    let tmr;

    const sendEvent = () => {
      tmr = 0;
      this.emit('viewport', this.getViewport());
    };

    if (raf) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          raf(() => {
            sendEvent();
            ticking = false;
          });
        }
        ticking = true;
      });
      window.addEventListener('resize', () => {
        if (!ticking) {
          raf(() => {
            sendEvent();
            ticking = false;
          });
        }
      });
    } else {
      const timVal = isTouch ? 1 : 200;
      window.addEventListener('scroll', () => {
        if (tmr) {
          clearTimeout(tmr);
        }
        tmr = setTimeout(sendEvent, timVal);
      });
      window.addEventListener('resize', () => {
        if (tmr) {
          clearTimeout(tmr);
        }
        tmr = setTimeout(sendEvent, timVal);
      });
    }
  }
  _width({w, h}) {
    const orientation = window.orientation;
    if (orientation === undefined) {
      return w;
    }
    if (orientation === 0 || orientation === 180) {
      return Math.min(w, h);
    }
    return Math.max(w, h);
  }
  _height({w, h}) {
    const orientation = window.orientation;
    if (orientation === undefined) {
      return h;
    }
    if (orientation === 0 || orientation === 180) {
      return Math.max(h, w);
    }
    return Math.min(h, w);
  }
  getViewport() {
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
    return {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
      width: this._width({w: window.innerWidth, h: window.innerHeight}),
      height: this._height({w: window.innerWidth, h: window.innerHeight}),
      clientWidth: this._width({w: clientWidth, h: clientHeight}),
      clientHeight: this._height({w: clientWidth, h: clientHeight})
    };
  }
}

const theViewPort = new ViewPort();

export default theViewPort;
