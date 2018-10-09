﻿//` ![](204DC0A5D26C752B4ED0E8696EBE637B.png)

var splatSoundEffect = new Audio(Folders.assets + 'Sound Effects/Splat.mp3');

class Drone extends SpriteProxy {
  displayName: string;
  userId: string;
  backgroundColor: string = '#fff';
  outlineColor: string = '#888';
  height: number;
  width: number;


  private _color: string;

  get color(): string {
    return this._color;
  }

  set color(newValue: string) {
    if (this._color === newValue)
      return;

    let textHsl: HueSatLight = HueSatLight.fromHex(newValue);
    let backgroundHsl: HueSatLight = HueSatLight.clone(textHsl);
    let outlineHsl: HueSatLight = HueSatLight.clone(textHsl);
    if (backgroundHsl.isBright()) {
      backgroundHsl.light = 0.02;
      if (textHsl.getPerceivedBrightness() < 0.7)
        textHsl.light += 0.15;
      outlineHsl.light = 0.3;
    }
    else {
      if (textHsl.getPerceivedBrightness() > 0.3)
        textHsl.light -= 0.15;
      backgroundHsl.light = 0.98;
      outlineHsl.light = 0.92;
    }

    this.backgroundColor = backgroundHsl.toHex();
    this.outlineColor = outlineHsl.toHex();
    this._color = textHsl.toHex();
  }
  constructor(startingFrameNumber: number, public x: number, public y: number) {
    super(startingFrameNumber, x, y);
  }

  getHorizontalThrust(): number {
    return 1;
  }

  getVerticalThrust(): number {
    return -1;
  }

  drawAdornments(context: CanvasRenderingContext2D, now: number): void {
    const fontSize: number = 14;
    context.font = fontSize + 'px Arial';

    context.textBaseline = 'top'; //` ![](774083667316C80C98D43F9C370CC1C8.png;;0,68,400,130;0.02510,0.02510)
    context.textAlign = 'center';

    let centerX: number = this.x + this.width / 2;
    let yTop: number = this.y + this.height * 1;
    let size = context.measureText(this.displayName);
    let halfWidth: number = size.width / 2;
    context.fillStyle = this.backgroundColor;
    const outlineSize: number = 3;
    context.fillRect(centerX - halfWidth - outlineSize, yTop - outlineSize, size.width + outlineSize * 2, fontSize + outlineSize * 2);

    context.strokeStyle = this.outlineColor;
    context.lineWidth = 2;
    context.strokeRect(centerX - halfWidth - outlineSize, yTop - outlineSize, size.width + outlineSize * 2, fontSize + outlineSize * 2);


    context.fillStyle = this.color;
    context.fillText(this.displayName, centerX, yTop);
  }

  getSplats(command: string): SplatSprites {
    if (command === 'red')
      return redSplotches;
    else if (command === 'black')
      return blackSplotches;
    else if (command === 'white')
      return whiteSplotches;
    else if (command === 'orange')
      return orangeSplotches;
    else if (command === 'amber')
      return amberSplotches;
    else if (command === 'yellow')
      return yellowSplotches;
    else if (command === 'green')
      return greenSplotches;
    else if (command === 'blue')
      return blueSplotches;
    else if (command === 'cyan')
      return cyanSplotches;
    else if (command === 'indigo')
      return indigoSplotches;
    else if (command === 'magenta')
      return magentaSplotches;
    else if (command === 'violet')
      return violetSplotches;
    return null;
  }

  dropPaint(command: string, params: string): any {
    let splats: SplatSprites = this.getSplats(command);
    splats.sprites.push(new SpriteProxy(0, this.x - splats.spriteWidth / 2 + this.width / 2, this.y - splats.spriteHeight / 2 + this.height / 2));
    splatSoundEffect.play();
  }

  // Picks a sequence of random numbers between 0 and maxBounds. pickCount is the number of random numbers selected.
  pick(pickCount: number, maxBounds: number): number[] {
    let result: number[] = [];
    let attempts: number = 0;
    while (result.length < pickCount && pickCount < maxBounds && attempts < 1000)
    {
      attempts++;
      let thisPick: number = Math.floor(Math.random() * maxBounds);
      if (result.indexOf(thisPick) === -1)
        result.push(thisPick);
    }
    return result;
  }


  matches(matchData: string): boolean {
    return this.userId == matchData;
  }
}
