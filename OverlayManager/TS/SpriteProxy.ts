﻿class GameTime {
  static now(): number {
    return performance.now();
  }
}

class SpriteProxy {
  isRemoving: boolean;
  haveCycledOnce: boolean;
  systemDrawn: boolean = true;
  owned: boolean;
  cropped: boolean;
  fadeOnDestroy: boolean = true;
  frameIndex: number;
  expirationDate: number;
  timeStart: number;
  velocityX: number;
  velocityY: number;
  cropTop: number;
  cropLeft: number;
  cropRight: number;
  cropBottom: number;
  opacity: number;
  startX: any;
  startY: any;
  lastX: number;
  lastY: number;

  constructor(startingFrameNumber: number, public x: number, public y: number, lifeSpanMs: number = -1) {
    this.opacity = 1;
    this.frameIndex = startingFrameNumber;
    this.timeStart = performance.now();
    this.velocityX = 0;
    this.velocityY = 0;
    this.startX = x;
    this.startY = y;
    if (lifeSpanMs > 0)
      this.expirationDate = this.timeStart + lifeSpanMs;
    else
      this.expirationDate = null;
  }

  set delayStart(delayMs: number) {
    this.timeStart = performance.now() + delayMs;
  }

  destroyBy(lifeTimeMs: number): any {
    if (!this.expirationDate)
      this.expirationDate = performance.now() + Math.round(Math.random() * lifeTimeMs);
  }

  removing(): void {
  	
  }

  getHorizontalThrust(now: number): number {
    return 0;
  }

  getVerticalThrust(now: number): number {
    return gravityGames.activePlanet.gravity;
  }

  stillAlive(now: number): boolean {
    let lifeRemaining: number = 0;
    if (this.expirationDate) {
      lifeRemaining = this.expirationDate - now;
    }
    return lifeRemaining >= 0;
  }

  getAlpha(now: number): number {
    if (!this.expirationDate)
      return this.opacity;

    let lifeRemaining: number = this.expirationDate - now;
    const fadeOutTime: number = 4000;
    if (lifeRemaining < fadeOutTime && this.fadeOnDestroy) {
      return this.opacity * lifeRemaining / fadeOutTime;
    }
    return this.opacity;
  }


  bounce(left: number, top: number, right: number, bottom: number, width: number, height: number, now: number) {
    var secondsPassed = (now - this.timeStart) / 1000;
    var horizontalBounceDecay = 0.9;
    var verticalBounceDecay = 0.9;

    var velocityX = Physics.getFinalVelocity(secondsPassed, this.velocityX, this.getHorizontalThrust(now));
    var velocityY = Physics.getFinalVelocity(secondsPassed, this.velocityY, this.getVerticalThrust(now));

    var hitLeftWall = velocityX < 0 && this.x < left;
    var hitRightWall = velocityX > 0 && this.x + width > right;

    var hitTopWall = velocityY < 0 && this.y < top;
    var hitBottomWall = velocityY > 0 && this.y + height > bottom;

    var newVelocityX = velocityX;
    var newVelocityY = velocityY;
    if (hitLeftWall || hitRightWall)
      newVelocityX = -velocityX * horizontalBounceDecay;
    if (hitTopWall || hitBottomWall)
      newVelocityY = -velocityY * verticalBounceDecay;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
      this.x = this.startX + Physics.metersToPixels(Physics.getDisplacement(secondsPassed, this.velocityX, this.getHorizontalThrust(now)));
      this.y = this.startY + Physics.metersToPixels(Physics.getDisplacement(secondsPassed, this.velocityY, this.getVerticalThrust(now)));
      this.changeVelocity(newVelocityX, newVelocityY, now);
    }
    return hitBottomWall;
  }

  destroying(): void {

  }

  advanceFrame(frameCount: number, now: number, returnFrameIndex: number = 0, startIndex: number = 0, endBounds: number = 0) {
    if (now < this.timeStart)
      return;
    this.frameIndex++;
    if (endBounds != 0) {
      if (this.frameIndex >= endBounds) {
        this.frameIndex = startIndex;
        this.haveCycledOnce = true;
      }
    }
    else if (this.frameIndex >= frameCount) {
      this.frameIndex = returnFrameIndex;
      this.haveCycledOnce = true;
    }
  }

  isHitBy(thisSprite: SpriteProxy): boolean {
    const minDistanceForHit: number = 70;
    return this.getDistanceTo(thisSprite) < minDistanceForHit;
  }

  getDistanceTo(otherSprite: SpriteProxy): number {
    // TODO: Consider measuring from the middle of the sprites.
    let deltaX: number = this.x - otherSprite.x;
    let deltaY: number = this.y - otherSprite.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  pathVector(spriteWidth: number, spriteHeight: number): Line {
    let halfWidth: number = spriteWidth / 2;
    let halfHeight: number = spriteHeight / 2;
    return Line.fromCoordinates(this.lastX + halfWidth, this.lastY + halfHeight,
      this.x + halfWidth, this.y + halfHeight);
  }

  changingDirection(now: number): void {
    var secondsPassed = (now - this.timeStart) / 1000;
    var velocityX = Physics.getFinalVelocity(secondsPassed, this.velocityX, this.getHorizontalThrust(now));
    var velocityY = Physics.getFinalVelocity(secondsPassed, this.velocityY, this.getVerticalThrust(now));
    this.changeVelocity(velocityX, velocityY, now);
  }

  changeVelocity(velocityX: number, velocityY: number, now: number) {
    this.timeStart = now;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.startX = this.x;
    this.startY = this.y;
  }

  draw(baseAnimation: Part, context: CanvasRenderingContext2D, now: number, spriteWidth: number, spriteHeight: number): void {
    baseAnimation.drawByIndex(context, this.x, this.y, this.frameIndex);
  }

  
  drawAdornments(context: CanvasRenderingContext2D, now: number): void {
    // Descendants can override if they want to draw on top of the sprite...
  }

  drawBackground(context: CanvasRenderingContext2D, now: number): void {
    // Descendants can override if they want to draw the background...
  }

  matches(matchData: any): boolean {
    return matchData === null;   // Descendants can override if they want to implement a custom search/find functionality...
  }

  storeLastPosition() {
    this.lastX = this.x;
    this.lastY = this.y;
  }

  updatePosition(now: number) {
    if (this instanceof Sparks)
      debugger;

    this.storeLastPosition();
    var secondsPassed = (now - this.timeStart) / 1000;

    var xDisplacement = Physics.getDisplacement(secondsPassed, this.velocityX, this.getHorizontalThrust(now));
    this.x = this.startX + Physics.metersToPixels(xDisplacement);

    var yDisplacement = Physics.getDisplacement(secondsPassed, this.velocityY, this.getVerticalThrust(now));
    this.y = this.startY + Physics.metersToPixels(yDisplacement);
  }
}