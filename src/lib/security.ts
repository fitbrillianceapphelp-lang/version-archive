import { useEffect } from "react";

export function useSecurityShield() {
  useEffect(() => {
    // ============================================================
    // 🛡️ FitBrilliance Security Shield — 6 Layers of Protection
    // ============================================================

    // ── Layer 1: Disable Right-Click Context Menu ──────────────
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // ── Layer 2: Block DevTools Keyboard Shortcuts ─────────────
    // F12 | Ctrl+Shift+I/J/C | Ctrl+U | Ctrl+S | Ctrl+P
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Ctrl+Shift+I / J / C (Inspector, Console, Elements)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i" ||
         e.key === "J" || e.key === "j" ||
         e.key === "C" || e.key === "c" ||
         e.key === "K" || e.key === "k")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Ctrl+U (View Source), Ctrl+S (Save Page), Ctrl+P (Print)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "u" || e.key === "U" ||
         e.key === "s" || e.key === "S" ||
         e.key === "p" || e.key === "P")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // ── Layer 3: Prevent Drag & Drop of Page Elements ──────────
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // ── Layer 4: Global Copy Protection ────────────────────────
    // Allows copy inside inputs/textareas, blocks everywhere else
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData(
          "text/plain",
          "محتوى محمي بموجب حقوق الملكية الفكرية لمنظومة Fit Brilliance © 2026"
        );
      }
    };

    // ── Layer 5: Block Text Selection on Protected Content ─────
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow selection inside forms
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) return;
      // Block on main content areas
      if (target?.closest("main, .protected-content")) {
        e.preventDefault();
        return false;
      }
    };

    // ── Layer 6: DevTools Size-Change Detection ────────────────
    // Detects when DevTools is opened by checking window size change
    const devToolsThreshold = 160;
    let devToolsOpen = false;

    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > devToolsThreshold || heightDiff > devToolsThreshold;

      if (isOpen && !devToolsOpen) {
        devToolsOpen = true;
        // Soft deterrent: clear the console and show warning
        console.clear();
        console.log(
          "%c🔒 تحذير أمني | Security Warning",
          "color:#e5a93c; font-size:18px; font-weight:bold;"
        );
        console.log(
          "%cهذه المنصة محمية بموجب حقوق الملكية الفكرية لمنظومة Fit Brilliance © 2026. أي محاولة للوصول غير المصرح به قد تُعرّضك للمسؤولية القانونية.",
          "color:#f4f0e7; font-size:13px;"
        );
      } else if (!isOpen) {
        devToolsOpen = false;
      }
    };

    const devToolsInterval = setInterval(detectDevTools, 1500);

    // ── Register All Event Listeners ───────────────────────────
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("selectstart", handleSelectStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("selectstart", handleSelectStart);
      clearInterval(devToolsInterval);
    };
  }, []);
}
