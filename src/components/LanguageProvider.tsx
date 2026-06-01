"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "es" | "ru";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  teamMode: boolean;
  enableTeamMode: () => void;
  /** true una vez leído el estado del navegador (evita parpadeo/hidratación). */
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LANG_KEY = "pp_lang";
const TEAM_KEY = "pp_team";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Por defecto siempre español: el render del servidor y el primer render del
  // cliente coinciden (español). El ruso se aplica tras montar, solo en equipo.
  const [lang, setLangState] = useState<Lang>("es");
  const [teamMode, setTeamMode] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const team = localStorage.getItem(TEAM_KEY) === "1";
      const stored = localStorage.getItem(LANG_KEY);
      setTeamMode(team);
      if (team && stored === "ru") {
        setLangState("ru");
        document.documentElement.lang = "ru";
      }
    } catch {
      // Sin acceso a localStorage: queda en español.
    }
    setReady(true);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // ignore
    }
    document.documentElement.lang = next === "ru" ? "ru" : "es-PA";
  }, []);

  const enableTeamMode = useCallback(() => {
    setTeamMode(true);
    try {
      localStorage.setItem(TEAM_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, teamMode, enableTeamMode, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "es",
      setLang: () => {},
      teamMode: false,
      enableTeamMode: () => {},
      ready: false,
    };
  }
  return ctx;
}
