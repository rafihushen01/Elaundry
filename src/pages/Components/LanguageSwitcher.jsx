import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div>
      <button onClick={() => changeLang("en")}>EN</button>
      <button onClick={() => changeLang("bn")}>BN</button>
      <button onClick={() => changeLang("fr")}>FR</button>
    </div>
  );
}
