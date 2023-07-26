import "./style.css";

const elements: FloatElement[] = [];

interface FloatElement {
  element: HTMLElement;
  x: number;
  y: number;
  p: Physics;
  update: () => void;
}

class Physics {
  constructor(public x: number, public y: number, public p?: Physics) {}

  update() {
    if (this.p) {
      this.p.update();
      this.x += this.p.x;
      this.y += this.p.y;
    }
  }
}

class FloatText implements FloatElement {
  element: HTMLElement;
  // x: number;
  // y: number;
  p: Physics;

  static fromText(text: string): FloatText {
    const span = document.createElement("span");
    span.innerHTML = text;
    // initElement(span);
    const fText = new FloatText(span);
    return fText;
  }

  constructor(element: HTMLElement) {
    this.element = element;
    this.p = new Physics(0, 0);
  }

  get x(): number {
    return this.p.x;
  }

  get y(): number {
    return this.p.y;
  }

  init(x?: number, y?: number) {
    if (x) {
      this.p.x = x;
    } else {
      this.p.x = innerWidth * Math.random();
    }

    if (y) {
      this.p.y = y;
    } else {
      this.p.y = innerHeight * Math.random();
    }

    this.element.style.position = "absolute";
    this.element.style.height = "0";
    this.update();
  }

  update() {
    this.p.update();
    this.element.style.top = this.y + "px";
    this.element.style.left = this.x + "px";
  }
}

function makeCanvas() {
  const inputElement: HTMLInputElement = document.querySelector("#app > input")!;
  inputElement.addEventListener("keydown", (event: Event) => {
    const ev = event as KeyboardEvent;
    if (ev.key === "Enter") {
      pushFloatText(inputElement.value);
      inputElement.value = "";
    }
  })

  // pushFloatText("This is a test.");
  setInterval(move, 1 / 30);
}

function pushFloatText(text: string) {
  const rootDiv = document.querySelector("#root-div");

  const testText = FloatText.fromText(text);
  testText.init();
  testText.p.p = new Physics(0, 0);
  testText.p.p.p = new Physics(0, 0);
  rootDiv?.append(testText.element);
  elements.push(testText);
}

function move() {
  const coeff = 1 / 10000;
  const reductionRate = [970/1000, 990 / 1000, 9999 / 10000] as const;
  for (const fElement of elements) {
    fElement.p.p!.p!.x += (Math.random() - 1 / 2) * coeff;
    fElement.p.p!.p!.x *= reductionRate[2];
    fElement.p.p!.x *= reductionRate[1];
    fElement.p.p!.p!.y += (Math.random() - 1 / 2) * coeff;
    fElement.p.p!.p!.y *= reductionRate[2];
    fElement.p.p!.y *= reductionRate[1];
    fElement.update();
    makeInWindow(fElement.p);
  }
}

function makeInWindow(p: Physics) {
  p.x = p.x % innerWidth;
  if (p.x < 0) {
    p.x += innerWidth;
  }
  p.y = p.y % innerHeight;
  if (p.y < 0) {
    p.y += innerHeight;
  }
}

function entry(listener: () => void) {
  addEventListener("DOMContentLoaded", listener);
}

entry(makeCanvas);
