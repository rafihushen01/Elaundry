import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const translateText = (source, t) => {
  if (!source || typeof source !== "string") return source;
  const trimmed = source.trim();
  if (!trimmed) return source;
  if (!/[A-Za-z]/.test(trimmed)) return source;

  const translated = t(trimmed, { defaultValue: trimmed });
  if (!translated || translated === trimmed) return source;
  return source.replace(trimmed, translated);
};

const translateTree = (root, t) => {
  if (!root) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;

        const blocked = ["SCRIPT", "STYLE", "NOSCRIPT"];
        if (blocked.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const textNodes = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    if (!node.__i18nSourceText) {
      node.__i18nSourceText = node.textContent;
    }

    const translated = translateText(node.__i18nSourceText, t);
    if (translated !== node.textContent) {
      node.textContent = translated;
    }
  });

  const attrTargets = root.querySelectorAll("[placeholder],[title],[aria-label],input[type='submit'],input[type='button']");
  attrTargets.forEach((element) => {
    [
      ["placeholder", "i18nSourcePlaceholder"],
      ["title", "i18nSourceTitle"],
      ["aria-label", "i18nSourceAriaLabel"],
      ["value", "i18nSourceValue"],
    ].forEach(([attribute, datasetKey]) => {
      if (!element.hasAttribute(attribute)) return;

      if (!element.dataset[datasetKey]) {
        element.dataset[datasetKey] = element.getAttribute(attribute) || "";
      }

      const translated = translateText(element.dataset[datasetKey], t);
      if (translated !== element.getAttribute(attribute)) {
        element.setAttribute(attribute, translated);
      }
    });
  });
};

const AutoTranslateApp = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let frame = null;

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        translateTree(document.body, t);
      });
    };

    schedule();

    const observer = new MutationObserver(() => {
      schedule();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [i18n.language, pathname, t]);

  return null;
};

export default AutoTranslateApp;
