let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (x, y) => {
      requestAnimationFrame(() => {
        if (!this.rotating) {
          this.mouseX = x;
          this.mouseY = y;
          this.velX = this.mouseX - this.prevMouseX;
          this.velY = this.mouseY - this.prevMouseY;
        }
        const dirX = x - this.mouseTouchX;
        const dirY = y - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

        if (this.rotating) {
          this.rotation = degrees;
        }

        if (this.holdingPaper) {
          if (!this.rotating) {
            this.currentPaperX += this.velX * 0.5;
            this.currentPaperY += this.velY * 0.5;
          }
          this.prevMouseX = this.mouseX;
          this.prevMouseY = this.mouseY;
          paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        }
      });
    };

    document.addEventListener("mousemove", (e) => moveHandler(e.clientX, e.clientY));
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        moveHandler(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    const startHandler = (x, y, isRightClick) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      if (!isRightClick) {
        this.mouseTouchX = x;
        this.mouseTouchY = y;
        this.prevMouseX = x;
        this.prevMouseY = y;
      } else {
        this.rotating = true;
      }
    };

    paper.addEventListener("mousedown", (e) => startHandler(e.clientX, e.clientY, e.button === 2));
    paper.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        startHandler(e.touches[0].clientX, e.touches[0].clientY, false);
      }
    }, { passive: true });

    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
    window.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}
const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
