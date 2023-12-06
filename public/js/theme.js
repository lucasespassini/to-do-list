const Themes = {
  DARK: "dark",
  LIGHT: "light",
};

const enableDarkMode = () => {
  const body = document.body;
  const btnTheme = document.getElementById("btn-theme");
  localStorage.setItem("theme", Themes.DARK);
  body.classList.add(Themes.DARK);
  body.classList.remove(Themes.LIGHT);
  btnTheme.innerText = "light_mode";
};

const enableLightMode = () => {
  const body = document.body;
  const btnTheme = document.getElementById("btn-theme");
  localStorage.setItem("theme", Themes.LIGHT);
  body.classList.add(Themes.LIGHT);
  body.classList.remove(Themes.DARK);
  btnTheme.innerText = "dark_mode";
};

const defineTheme = () => {
  const theme = localStorage.getItem("theme");
  theme === Themes.DARK ? enableDarkMode() : enableLightMode();
};

const toggleTheme = () => {
  const body = document.body;
  const theme = localStorage.getItem("theme");

  switch (theme) {
    case Themes.DARK:
      enableLightMode();
      break;
    case Themes.LIGHT:
      enableDarkMode();
      break;
    default:
      body.classList.contains(Themes.DARK)
        ? enableLightMode()
        : enableDarkMode();
  }
};

defineTheme();
