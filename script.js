document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container"); // 전체 container
  const todoList = document.getElementById("todoList"); // ul List
  const inputContainer = document.getElementById("inputContainer"); // 입력폼
  const textInput = document.getElementById("todoItemText"); // Todo 내용
  const detailInput = document.getElementById("todoItemDetail"); // Todo 상세내용
  const dateInput = document.getElementById("todoItemDate"); // Todo 목표날짜
  const addButton = document.getElementById("addButton"); // Todo 추가 버튼

  const todos = []; // Todo목록 저장할 배열

  let isInputVisible = false;

  // 컨테이너 클릭하면 입력 폼 보이게
  container.addEventListener("click", (event) => {
    if (event.target === container) {
      isInputVisible = !isInputVisible;
      inputContainer.style.display = isInputVisible ? "flex" : "none"; // 토글
    }
  });

  addButton.addEventListener("click", () => {
    const text = textInput.value; // 내용 입력 값
    const detail = detailInput.value; // 상세 내용 입력 값
    const date = dateInput.value; // 목표 날짜 입력 값

    if (!text) return; // 내용이 비어있으면 리스트에 추가하지 않음

    // 입력값을 todo목록 배열에 추가
    todos.push({
      text,
      detail,
      date,
      completed: false,
    });

    // 입력 폼 초기화
    textInput.value = "";
    detailInput.value = "";
    dateInput.value = "";

    // 입력 폼 숨기기
    inputContainer.style.display = "none";
    isInputVisible = false;

    renderTodos();
  });

  // todo 목록 렌더링
  function renderTodos() {
    todoList.innerHTML = ""; // 기존 리스트 초기화 (중복제거)

    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.classList.add("listItem");

      // list 내부 내용 ("data-" 커스텀 속성 사용)
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

      // 체크박스 체크하면 완료상태로 변경 (삭제)
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
