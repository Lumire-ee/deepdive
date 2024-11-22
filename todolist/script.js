document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container"); // 전체 container
  const todoList = document.getElementById("todoList"); // ul List
  const inputContainer = document.getElementById("inputContainer"); // 입력폼
  const textInput = document.getElementById("todoItemText"); // Todo 내용
  const detailInput = document.getElementById("todoItemDetail"); // Todo 상세내용
  const dateInput = document.getElementById("todoItemDate"); // Todo 목표날짜

  const todos = []; // Todo목록 저장할 배열

  let isInputVisible = false;

  // 로컬스토리지에서 데이터 불러오기
  function loadTodosLocalStorage() {
    const saveTodos = localStorage.getItem("todos");
    if (saveTodos) {
      todos.length = 0;
      todos.push(...JSON.parse(saveTodos));
    }
  }

  // 로컬스토리지에 데이터 저장
  function saveTodosLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // 컨테이너 클릭하면 입력 폼 보이기
  container.addEventListener("click", (event) => {
    if (isInputVisible) {
      if (!inputContainer.contains(event.target)) {
        const text = textInput.value; // 내용 입력 값
        const detail = detailInput.value; // 상세 내용 입력 값
        const date = dateInput.value; // 목표 날짜 입력 값

        // 수정 상태인지 확인
        if (inputContainer.dataset.editingIndex !== undefined) {
          const index = inputContainer.dataset.editingIndex;
          todos[index] = {
            text,
            detail,
            date,
            completed: todos[index].completed,
          };
          delete inputContainer.dataset.editingIndex;
        } else if (text.trim()) {
          todos.push({
            text: text.trim(),
            detail: detail.trim(),
            date,
            completed: false,
          }); // 새 Todo 추가 (공백만 입력시 리스트 추가 방지)
        }
        // localStorage에 Todo 저장
        saveTodosLocalStorage();

        renderTodos();

        // 입력 폼 초기화 후 숨기기
        textInput.value = "";
        detailInput.value = "";
        dateInput.value = "";
        inputContainer.style.display = "none";

        // 수정 상태 해제
        inputContainer.classList.remove("editing");
        container.appendChild(inputContainer);
        isInputVisible = false;
      }
    } else if (event.target === container) {
      isInputVisible = true;
      inputContainer.style.display = "block";
    }
  });

  // todo 목록 렌더링
  function renderTodos() {
    todoList.innerHTML = ""; // 기존 리스트 초기화 (중복 제거)

    todos.forEach((todo, index) => {
      const li = document.createElement("li"); // li 요소 생성
      li.classList.add("listItem");
      li.dataset.index = index;

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
          event.stopPropagation();

          const listItem = event.target.closest(".listContainer");
          const index = event.target.dataset.index;

          if (event.target.checked) {
            listItem.classList.add("listItemHide");
            if (inputContainer.dataset.editingIndex == index) {
              textInput.value = "";
              detailInput.value = "";
              dateInput.value = "";
              inputContainer.style.display = "none";
              delete inputContainer.dataset.editingIndex;
              isInputVisible = false;
            }
            // 1.5초후 삭제
            setTimeout(() => {
              todos.splice(index, 1);

              //localStorage에 Todo 저장
              saveTodosLocalStorage();

              renderTodos();
            }, 1500);
          }
        },
        { once: true }
      );

      // 목록 수정
      li.addEventListener("click", (event) => {
        const index = event.target.closest(".listItem").dataset.index;
        const todo = todos[index];

        // 입력 폼에 기존 데이터 로드
        textInput.value = todo.text;
        detailInput.value = todo.detail;
        dateInput.value = todo.date;

        inputContainer.dataset.editingIndex = index; // 수정 중인 항목 저장
        isInputVisible = true;

        const listItem = event.target.closest(".listItem");
        listItem.after(inputContainer);
        inputContainer.style.display = "block";

        // 수정 상태 디자인 변경
        inputContainer.classList.add("editing");

        event.stopPropagation(); // 부모 클릭 이벤트 방지
      });

      todoList.appendChild(li);
    });
  }

  // localStorage에서 Todo 불러오기
  loadTodosLocalStorage();
  renderTodos();
});
