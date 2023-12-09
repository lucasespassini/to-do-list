const ModalTypes = {
  PRIORITY: "priority",
  TODO: "todo",
  NOTE: "note",
  DELETE_ACCOUNT: "delete-account",
};

/**
 * @param {Event} e
 */
const stopPropagation = (e) => e.stopPropagation();

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
    case ModalTypes.DELETE_ACCOUNT:
      modalForm.setAttribute("action", "/user/delete");
      modalForm.children.item(1).remove();
      modalForm.children.item(1).remove();
      const title = document.createElement("h3");
      title.textContent = "Confirmar deleção da conta?";
      const button = document.createElement("button");
      button.innerHTML = "Confirmar";
      button.classList.add("button", "button-danger");
      modalForm.append(title);
      modalForm.append(button);
      break;
  }
};

const closeModal = () => {
  const modal = document.getElementsByClassName("modal")[0];
  const modalForm = document.getElementById("form-modal");
  modal.style.display = "none";
  modalForm.removeAttribute("action");
};
