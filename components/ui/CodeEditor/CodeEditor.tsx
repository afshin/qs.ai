'use client';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useEffect, useState } from 'react';

function onClassChange(node: HTMLElement, callback: (cls: string) => void) {
  let lastClassString = node.classList.toString();
  const mutationObserver = new MutationObserver((mutationList) => {
    for (const item of mutationList) {
      if (item.attributeName === 'class') {
        const classString = node.classList.toString();
        if (classString !== lastClassString) {
          callback(classString);
          lastClassString = classString;
          break;
        }
      }
    }
  });

  mutationObserver.observe(node, { attributes: true });

  return mutationObserver;
}

interface IProps {
  code: string;
  setCode: (val: string) => void;
  language: any;
}
export function CodeEditor(props: IProps) {
  const themeChanged = useCallback((cls: string) => {
    const currentTheme = cls === 'light' ? githubLight : githubDark;
    setTheme(currentTheme);
  }, []);
  const [theme, setTheme] = useState(githubLight);
  useEffect(() => {
    const html = document.documentElement;
    const currentTheme =
      html.classList.toString() === 'light' ? githubLight : githubDark;
    setTheme(currentTheme);
    const obs = onClassChange(html, themeChanged);
    return () => {
      obs.disconnect();
    };
  }, [setTheme, themeChanged]);

  return (
    <CodeMirror
      value={props.code}
      onChange={props.setCode}
      minHeight="200px"
      theme={theme}
      extensions={[props.language]}
    />
  );
}
