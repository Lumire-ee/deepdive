document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container"); // 전체 container
  const todoList = document.getElementById("todoList"); // ul List
  const inputContainer = document.getElementById("inputContainer"); // 입력폼
  const textInput = document.getElementById("todoItemText"); // Todo 내용
  const detailInput = document.getElementById("todoItemDetail"); // Todo 상세내용
  const dateInput = document.getElementById("todoItemDate"); // Todo 목표날짜

  const todos = []; // Todo목록 저장할 배열

  let isInputVisible = false;

  // 컨테이너 클릭하면 입력 폼 보이기
  container.addEventListener("click", (event) => {
    if (isInputVisible) {
      if (!inputContainer.contains(event.target)) {
        const text = textInput.value; // 내용 입력 값
        const detail = detailInput.value; // 상세 내용 입력 값
        const date = dateInput.value; // 목표 날짜 입력 값

        // 입력값을 todo목록 배열에 추가
        if (text) {
          todos.push({
            text,
            detail,
            date,
            completed: false,
          });
          renderTodos();
        }

        // 입력 폼 초기화
        textInput.value = "";
        detailInput.value = "";
        dateInput.value = "";

        // 입력 폼 숨기기
        inputContainer.style.display = "none";
        isInputVisible = false;
      }
    } else if (event.target === container) {
      isInputVisible = true;
      inputContainer.style.display = "block";
    }
  });

  function renderTodos() {
    todoList.innerHTML = ""; // 기존 목록 초기화

    todos.forEach((todo, index) => {
      const li = document.createElement("li"); // li 요소 생성
      li.classList.add("listItem");

      li.innerHTML = `
      <div class="listContainer">
        <input type="checkbox" ${
          todo.completed ? "checked = 'checked'" : "data-checked = 'false'"
        } data-index="${index}">
        <div class="text">${todo.text}<div>
        <div class="detail">${todo.detail}<div>
        <div class="date">${todo.date}</div>
      </div>
      `;

      // 체크박스 체크하면 완료상태로 변경
      li.querySelector("input[type=checkbox]").addEventListener(
        "change",
        (event) => {
          const listItem = event.target.closest(".listContainer");
          const index = event.target.dataset.index;
          if (event.target.checked) {
            listItem.classList.add("listItemHide");
            // 1.5초후 삭제
            setTimeout(() => {
              todos.splice(index, 1);
              renderTodos();
            }, 1500);
          }
        }
      );

      todoList.appendChild(li);
    });
  }
});
