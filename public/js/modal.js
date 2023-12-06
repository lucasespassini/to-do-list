const ModalTypes = {
  PRIORITY: "priority",
  TODO: "todo",
  NOTE: "note",
};

/**
 * @param {Event} e
 */
const stopPropagation = (e) => {
  e.stopPropagation();
};

/**
 * @param {HTMLElement} el
 */
const openModal = (el) => {
  const modal = document.getElementsByClassName("modal")[0];
  const modalForm = document.getElementById("form-modal");
  modal.style.display = "block";

  switch (el.id) {
    case ModalTypes.PRIORITY:
      modalForm.setAttribute("action", "/priority/create");
      break;
    case ModalTypes.TODO:
      modalForm.setAttribute("action", "/to-do/create");
      break;
    case ModalTypes.NOTE:
      modalForm.setAttribute("action", "/note/create");
      break;
  }
};

const closeModal = () => {
  const modal = document.getElementsByClassName("modal")[0];
  const modalForm = document.getElementById("form-modal");
  modal.style.display = "none";
  modalForm.removeAttribute("action");
};
