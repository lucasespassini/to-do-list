(() => {
  const flash = document.getElementsByClassName("flash-container")[0];
  if (!flash) return;

  setTimeout(() => flash.classList.add("flash-open"), 100);

  setTimeout(() => {
    flash.classList.remove("flash-open");
    flash.classList.add("flash-close");
  }, 3000);
})();
