"use client";

import type {
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  ISeriesApi,
  ISeriesPrimitive,
  PrimitiveHoveredItem,
  PrimitivePaneViewZOrder,
  SeriesAttachedParameter,
  Time,
} from "lightweight-charts";

export type PositionControlsModel = {
  entryPrice: number;
  pnlText: string;
  qtyText: string;
};

type Action = "reverse" | "close";
type HitId = `pos:${Action}`;

type Rect = Readonly<{ x: number; y: number; w: number; h: number }>;

function isInsideRect(x: number, y: number, r: Rect): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function isHitId(value: string): value is HitId {
  return value === "pos:reverse" || value === "pos:close";
}

function fillRect(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  fillStyle: string,
): void {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(r.x, r.y, r.w, r.h);
}

function strokeRect(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  strokeStyle: string,
  lineWidth: number,
): void {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
}

function drawSeparator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, h);
}

function measureTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
): number {
  ctx.save();
  ctx.font = font;
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  yMiddle: number,
  color: string,
  font: string,
  align: CanvasTextAlign,
): void {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = align;
  ctx.fillText(text, x, yMiddle);
  ctx.restore();
}

function drawCenteredIcon(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  icon: string,
  color: string,
  font: string,
): void {
  drawText(ctx, icon, r.x + r.w / 2, r.y + r.h / 2, color, font, "center");
}

type Layout = Readonly<{
  outer: Rect;
  pnl: Rect;
  qty: Rect;
  reverseBtn: Rect;
  closeBtn: Rect;
}>;

class Renderer implements IPrimitivePaneRenderer {
  private yCoord: number | null = null;
  private model: PositionControlsModel | null = null;

  private hitReverse: Rect | null = null;
  private hitClose: Rect | null = null;

  setState(yCoord: number | null, model: PositionControlsModel | null): void {
    this.yCoord = yCoord;
    this.model = model;

    // IMPORTANT: yCoord can be 0; only null means "not drawable"
    if (yCoord === null || model === null) {
      this.hitReverse = null;
      this.hitClose = null;
    }
  }

  getHitRects(): { reverse: Rect | null; close: Rect | null } {
    return { reverse: this.hitReverse, close: this.hitClose };
  }

  private computeLayout(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    centerY: number,
    pnlText: string,
    qtyText: string,
  ): Layout {
    const fontText = "600 13px ui-sans-serif, system-ui, -apple-system";

    const height = 22;
    const y = Math.round(centerY - height / 2);

    const padX = 8;

    // only text width + padding (no mins)
    const pnlW = Math.ceil(measureTextWidth(ctx, pnlText, fontText) + padX * 2);
    const qtyW = Math.ceil(measureTextWidth(ctx, qtyText, fontText) + padX * 2);

    const btnW = height;
    const totalW = pnlW + qtyW + btnW * 2;

    const x = Math.round((canvasWidth - totalW) / 2);

    const outer: Rect = { x, y, w: totalW, h: height };
    const pnl: Rect = { x, y, w: pnlW, h: height };
    const qty: Rect = { x: x + pnlW, y, w: qtyW, h: height };
    const reverseBtn: Rect = { x: x + pnlW + qtyW, y, w: btnW, h: height };
    const closeBtn: Rect = { x: reverseBtn.x + btnW, y, w: btnW, h: height };

    this.hitReverse = reverseBtn;
    this.hitClose = closeBtn;

    return { outer, pnl, qty, reverseBtn, closeBtn };
  }

  draw(target: Parameters<IPrimitivePaneRenderer["draw"]>[0]): void {
    target.useMediaCoordinateSpace((scope) => {
      const ctx = scope.context;
      const w = scope.mediaSize.width;

      if (this.yCoord === null || this.model === null) {
        this.hitReverse = null;
        this.hitClose = null;
        return;
      }

      const layout = this.computeLayout(
        ctx,
        w,
        this.yCoord,
        this.model.pnlText,
        this.model.qtyText,
      );

      const greenStroke = "rgb(74, 222, 128)";
      const pnlBg = "rgba(0,0,0,1)";
      const qtyBg = "rgba(34, 197, 94, 1)";
      const btnBg = "rgba(0,0,0,1)";
      const separator = "rgba(34, 197, 94, 1)";
      const textWhite = "rgba(255,255,255,1)";
      const iconColor = "rgba(255,255,255,1)";

      const fontText = "600 11px ui-sans-serif, system-ui, -apple-system";
      const fontIcon = "700 15px ui-sans-serif, system-ui, -apple-system";

      ctx.save();
      // segments
      fillRect(ctx, layout.pnl, pnlBg);
      fillRect(ctx, layout.qty, qtyBg);
      fillRect(ctx, layout.reverseBtn, btnBg);
      fillRect(ctx, layout.closeBtn, btnBg);

      // separators
      drawSeparator(
        ctx,
        layout.qty.x,
        layout.outer.y,
        layout.outer.h,
        separator,
      );
      drawSeparator(
        ctx,
        layout.reverseBtn.x,
        layout.outer.y,
        layout.outer.h,
        separator,
      );
      drawSeparator(
        ctx,
        layout.closeBtn.x,
        layout.outer.y,
        layout.outer.h,
        separator,
      );

      // border
      strokeRect(ctx, layout.outer, greenStroke, 1.5);
      ctx.restore();

      const yMid = layout.outer.y + layout.outer.h / 2;

      // pnl left, qty centered
      drawText(
        ctx,
        this.model.pnlText,
        layout.pnl.x + 10,
        yMid,
        textWhite,
        fontText,
        "left",
      );
      drawText(
        ctx,
        this.model.qtyText,
        layout.qty.x + layout.qty.w / 2,
        yMid,
        textWhite,
        fontText,
        "center",
      );

      // icons centered
      drawCenteredIcon(ctx, layout.reverseBtn, "↕", iconColor, fontIcon);
      drawCenteredIcon(ctx, layout.closeBtn, "×", iconColor, fontIcon);
    });
  }
}

class PaneView implements IPrimitivePaneView {
  constructor(private readonly rendererImpl: Renderer) {}
  renderer(): IPrimitivePaneRenderer {
    return this.rendererImpl;
  }
  zOrder(): PrimitivePaneViewZOrder {
    return "top";
  }
}

/**
 *  CHANGED: generic is Time (NOT "Candlestick") — matches attachPrimitive typing in 5.1
 * but we still keep series as Candlestick to access priceToCoordinate().
 */
export class PositionControlsPrimitive implements ISeriesPrimitive<Time> {
  private series: ISeriesApi<"Candlestick"> | null = null;
  private requestUpdate: (() => void) | null = null;

  private model: PositionControlsModel | null = null;

  private readonly renderer = new Renderer();
  private readonly paneView = new PaneView(this.renderer);

  constructor(private readonly onAction: (a: Action) => void) {}

  // CHANGED: accept param typed by the interface (Time), then narrow by usage:
  attached(param: SeriesAttachedParameter<Time>): void {
    // runtime series is the Candlestick series you attached to
    this.series = param.series as unknown as ISeriesApi<"Candlestick">;
    this.requestUpdate = param.requestUpdate;
  }

  detached(): void {
    this.series = null;
    this.requestUpdate = null;
  }

  setModel(model: PositionControlsModel | null): void {
    this.model = model;
    this.requestUpdate?.();
  }

  updateAllViews(): void {
    if (!this.series || !this.model) {
      this.renderer.setState(null, null);
      return;
    }

    const y = this.series.priceToCoordinate(this.model.entryPrice);
    if (y === null) {
      this.renderer.setState(null, null);
      return;
    }

    this.renderer.setState(y, this.model);
  }

  paneViews(): readonly IPrimitivePaneView[] {
    return [this.paneView];
  }

  hitTest(x: number, y: number): PrimitiveHoveredItem | null {
    const rects = this.renderer.getHitRects();

    if (rects.reverse && isInsideRect(x, y, rects.reverse)) {
      return {
        externalId: "pos:reverse",
        zOrder: "top",
        cursorStyle: "pointer",
      };
    }
    if (rects.close && isInsideRect(x, y, rects.close)) {
      return { externalId: "pos:close", zOrder: "top", cursorStyle: "pointer" };
    }
    return null;
  }

  // CHANGED: accept unknown to match caller directly (no TS error)
  handleClick(hoveredObjectId: unknown): void {
    if (typeof hoveredObjectId !== "string") return;
    if (!isHitId(hoveredObjectId)) return;

    if (hoveredObjectId === "pos:reverse") this.onAction("reverse");
    if (hoveredObjectId === "pos:close") this.onAction("close");
  }
}
